// Background settings reader. Never opens or navigates the pause menu.
import { repeat } from '@lenix/lenix'
import catalogData from '../../../public/settings-catalog.json'
import type { Start, Mapped } from 'types/index'
import { readKeybinds } from './keybinds'
import { readSettingsMenu } from './settings-menu'
import { readSavedGraphics, type SavedGraphics } from './settings-xml'

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }
type ChoiceDefinition = { labelKey: string; fields: Record<string, string>; attributes: Record<string, string> }
type RowDefinition = {
	index: number
	labelKey: string
	fields: Record<string, string>
	attributes: Record<string, string>
	xmlChoices: ChoiceDefinition[]
}
type Catalog = {
	schema: number
	source: Record<string, string>
	limitations: string[]
	sections: {
		key: string
		name: string
		labelKey: string
		screen: string
		contexts: string
		attributes: Record<string, string>
		rows: RowDefinition[]
	}[]
	keyBindingDefinitions: Json
}
const catalog = catalogData as unknown as Catalog

type CurrentSetting = {
	rowIndex: number | null
	preference: string | null
	label: string
	status: 'available' | 'unavailable'
	value: string | number | boolean | null
	enabled: boolean | null
	uiChanged: boolean | null
	format: 'profileInteger' | 'convarInteger' | 'choice' | 'slider' | 'meter'
	selectedIndex: number | null
	choices: (string | number | boolean | null)[]
	steps: number | null
	percent: number | null
	source: string | null
	reason: string | null
}
type ClosedMenuProbe = {
	status: 'captured' | 'unavailable'
	freshness: 'unverified'
	capturedAt: number | null
	section: string | null
	rows: NonNullable<Awaited<ReturnType<typeof readSettingsMenu>>>['rows']
	reason: string | null
}
type CurrentSection = {
	status: 'notCaptured' | 'captured' | 'partial' | 'unavailable'
	capturedAt: number | null
	reason: string | null
	values: CurrentSetting[]
	bindings: Mapped<Start.Keybind>[]
}
const emptyCurrent = (): CurrentSection => ({
	status: 'notCaptured',
	capturedAt: null,
	reason: null,
	values: [],
	bindings: [],
})
const label = (key: string) => {
	const text = key ? GetLabelText(key) : ''
	return text && text !== 'NULL' ? text : key
}
const createCatalog = () => ({
	...catalog,
	appliedState: 'unverified' as const,
	savedGraphics: null as SavedGraphics | null,
	menuCaptureError: null as string | null,
	closedMenuProbe: null as ClosedMenuProbe | null,
	sections: catalog.sections.map(section => ({
		...section,
		label: label(section.labelKey),
		current: emptyCurrent(),
		rows: section.rows.map(row => ({
			...row,
			label: label(row.labelKey),
			xmlChoices: row.xmlChoices.map(choice => ({ ...choice, label: label(choice.labelKey) })),
		})),
	})),
})

export type Settings = ReturnType<typeof createCatalog>
const replaceCurrent = (data: Settings, key: string, current: CurrentSection): Settings => ({
	...data,
	sections: data.sections.map(section => (section.key === key ? { ...section, current } : section)),
})
function setCatalogKeyBindings(data: Settings, bindings: Start.Keybind[], capturedAt = Date.now()) {
	return replaceCurrent(data, 'keyBindings', {
		...emptyCurrent(),
		status: 'captured',
		capturedAt,
		bindings: bindings.map(binding => ({
			...binding,
			primary: [...binding.primary],
			secondary: [...binding.secondary],
		})),
	})
}
// FiveM GameProfileSettings.cpp exports PREF_* as profile_lowerCamelCase.
// Values are profile integers, NOT XML choice indexes or verified renderer state.
// https://github.com/citizenfx/fivem/blob/master/code/components/gta-core-five/src/GameProfileSettings.cpp
const missing = '__lenix_missing_preference__'
// UNTESTED in-game: raw profile values do not certify applied renderer state.
function readPreference(row: RowDefinition & { label: string }): CurrentSetting {
	const preference = row.fields.MenuPref!
	const result: CurrentSetting = {
		rowIndex: row.index,
		preference,
		label: row.label,
		status: 'unavailable',
		value: null,
		enabled: null,
		uiChanged: null,
		format: 'profileInteger',
		selectedIndex: null,
		choices: [],
		steps: null,
		percent: null,
		source: null,
		reason: null,
	}
	// This single graphics ID is documented by FiveM; other graphics IDs are unknown.
	if (preference === 'PREF_GFX_VID_OVERRIDE') {
		result.source = 'GetProfileSetting:710'
		result.value = GetProfileSetting(710)
		result.status = 'available'
		return result
	}
	if (preference.startsWith('PREF_GFX_') || preference === 'PREF_VID_MONITOR') {
		result.reason = 'FiveM excludes this graphics preference from profile convars'
		return result
	}
	// PatchExtendedBudgeting.cpp binds this variable to the actual budget slider.
	// The catalog's PREF_VID_STEREO_CONVERGENCE is repurposed by FiveM.
	const budget = row.labelKey === 'GFX_BUDGET'
	if (budget) result.format = 'convarInteger'
	// HashRageString is CASE-SENSITIVE (FiveM code/client/shared/Utils.h).
	// HashRageString('PREF_SHOW_TEXT_CHAT') = 0x903b4dcc; GetHashKey lowercases and is wrong here.
	const name = budget
		? 'vid_budgetScale'
		: preference === 'PREF_SHOW_TEXT_CHAT'
			? 'profile_0x903b4dcc'
			: 'profile_' +
				preference
					.slice(5)
					.toLowerCase()
					.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
	result.source = name
	const raw = GetConvar(name, missing)
	if (!/^-?\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)) || Number(raw) === -999) {
		result.reason = raw === missing ? 'Preference unavailable on this client' : 'Invalid or unset profile preference'
		return result
	}
	result.value = Number(raw)
	result.status = 'available'
	return result
}
let pending: Promise<Settings> | null = null
export function getSettingsCatalog(): Promise<Settings> {
	return (pending ??= readCatalog().finally(() => {
		pending = null
	}))
}
async function readCatalog(): Promise<Settings> {
	let data = createCatalog()
	try {
		data = setCatalogKeyBindings(data, await readKeybinds())
	} catch (error) {
		data = replaceCurrent(data, 'keyBindings', { ...emptyCurrent(), status: 'unavailable', reason: String(error) })
	}
	// Give FiveM's per-frame profile registration a bounded chance to finish.
	const deadline = Date.now() + 1500
	await repeat(() => GetConvar('profile_sfxVolume', missing) !== missing || Date.now() >= deadline, true, 0)
	for (const section of data.sections) {
		if (section.key === 'keyBindings') continue
		const values = section.rows.filter(row => row.fields.MenuPref).map(readPreference)
		const count = values.filter(value => value.status === 'available').length
		section.current = {
			...emptyCurrent(),
			values,
			capturedAt: Date.now(),
			status: count === values.length && count > 0 ? 'captured' : count > 0 ? 'partial' : 'unavailable',
			reason:
				count === values.length && count > 0 ? null : 'Some profile values are unavailable; see each value reason',
		}
	}
	const menuActive = IsPauseMenuActive()
	if (!menuActive) {
		data.closedMenuProbe = {
			status: 'unavailable',
			freshness: 'unverified',
			capturedAt: null,
			section: null,
			rows: [],
			reason: null,
		}
	}
	try {
		const capture = await readSettingsMenu(data.sections, menuActive)
		if (data.closedMenuProbe) {
			// Closed-menu rows may be retained from a previous visit; do not replace current preferences.
			data.closedMenuProbe = {
				status: capture ? 'captured' : 'unavailable',
				freshness: 'unverified',
				capturedAt: capture ? Date.now() : null,
				section: capture?.key ?? null,
				rows: capture?.rows ?? [],
				reason: capture ? null : 'No supported settings section returned',
			}
		} else if (capture) {
			const section = data.sections.find(section => section.key === capture.key)!
			const clean = (text: string) => text.replace(/<[^>]*>|~[^~]*~/g, '').trim()
			const profileValues = section.current.values
			section.current = {
				...emptyCurrent(),
				status: 'captured',
				capturedAt: Date.now(),
				values: capture.rows
					.map((row): CurrentSetting | null => {
						const definitions = section.rows.filter(
							definition => definition.fields.MenuPref && clean(definition.label) === clean(row.label),
						)
						const definition = definitions.length === 1 ? definitions[0] : null
						// Brightness opens a subpage; retain its background value instead of losing it.
						if (row.kind === 'other')
							return definition ? (profileValues.find(value => value.rowIndex === definition.index) ?? null) : null
						return {
							rowIndex: definition?.index ?? null,
							preference: definition?.fields.MenuPref ?? null,
							label: row.label,
							status: 'available',
							value: 'value' in row ? row.value! : row.selectedIndex!,
							enabled: row.enabled,
							uiChanged: row.uiChanged,
							format: row.kind,
							selectedIndex: row.selectedIndex!,
							choices: 'choices' in row ? row.choices! : [],
							steps: 'steps' in row ? row.steps! : null,
							percent: 'percent' in row ? row.percent! : null,
							source: 'settingsMenu',
							reason: null,
						}
					})
					.filter(value => value !== null),
			}
			if (section.current.values.some(value => value.status === 'unavailable')) {
				section.current.status = 'partial'
				section.current.reason = 'Some visible settings have no readable value'
			}
		}
	} catch (error) {
		data.menuCaptureError = String(error)
		if (data.closedMenuProbe) data.closedMenuProbe.reason = String(error)
	}
	data.savedGraphics = await readSavedGraphics()
	return data
}
