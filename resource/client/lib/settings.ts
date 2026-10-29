// Definitions extracted from FiveM XML. Automatic page traversal is UNTESTED in FiveM.
import catalogData from '../../../public/settings-catalog.json'
import type { Start, Mapped } from 'types/index'
import { readKeybinds } from './keybinds'
import { repeat, waste } from '@lenix/lenix'

type Json = string | number | boolean | null | Json[]
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

type Scalar = string | number | boolean | null
type Row = { dataIndex: number; uiIndex: Scalar; rawRow: Scalar[]; rendered: Record<string, Scalar> | null }
type CurrentSetting = {
	menuId: Scalar
	itemId: Scalar
	label: string
	kind: string
	enabled: boolean
	uiChanged: boolean
	value: Scalar
	selectedIndex: number | null
	choices: Scalar[]
	steps: number | null
	percent: number | null
	raw: Scalar[]
}
type CurrentSection = {
	status: 'notCaptured' | 'captured' | 'unavailable'
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
function markCatalogUnavailable(data: Settings, keys: string[], reason: string): Settings {
	return {
		...data,
		sections: data.sections.map(section =>
			keys.includes(section.key)
				? { ...section, current: { ...emptyCurrent(), status: 'unavailable', reason } }
				: section,
		),
	}
}
function currentValue(row: ReturnType<typeof decodeSettingsRow>): CurrentSetting {
	return {
		menuId: row.menuId,
		itemId: row.itemId,
		label: row.label,
		kind: row.kind,
		enabled: row.enabled,
		uiChanged: row.uiChanged,
		value: 'value' in row ? row.value : 'selectedIndex' in row ? row.selectedIndex : null,
		selectedIndex: 'selectedIndex' in row ? row.selectedIndex : null,
		choices: 'choices' in row ? [...row.choices] : [],
		steps: 'steps' in row ? row.steps : null,
		percent: 'percent' in row ? row.percent : null,
		raw: 'raw' in row ? [...row.raw] : [],
	}
}
function applySettingsCapture(data: Settings, capture: SettingsCapture): Settings {
	// Keep the fresh keybinding results while filling each menu section.
	for (const section of data.sections.filter(section => section.key !== 'keyBindings')) {
		const result = capture.sections.find(item => item.key === section.key)
		data =
			result?.status === 'captured'
				? replaceCurrent(data, section.key, {
						...emptyCurrent(),
						status: 'captured',
						capturedAt: result.capturedAt,
						values: result.rows.map(currentValue),
					})
				: markCatalogUnavailable(data, [section.key], result?.reason ?? 'Section was not captured')
	}
	return data
}

// repeat checks synchronously; serialize async reads and propagate failures after it stops.
async function repeatAsync(check: () => Promise<boolean>, each: number) {
	let running = false,
		done = false,
		failed = false
	let error: unknown
	await repeat(
		() => {
			if (!running && !done) {
				running = true
				void check()
					.then(result => {
						done = result
					})
					.catch(reason => {
						error = reason
						failed = done = true
					})
					.finally(() => {
						running = false
					})
			}
			return done
		},
		true,
		each,
	)
	if (failed) throw error
}

async function call(method: string, deadline: number, ...args: number[]) {
	if (Date.now() >= deadline) throw 'Capture deadline exceeded'
	if (!BeginScaleformMovieMethodOnFrontend(method)) throw 'Settings frontend unavailable'
	args.forEach(arg => ScaleformMovieMethodAddParamInt(arg))
	const ticket = EndScaleformMovieMethodReturnValue()
	const until = Math.min(deadline, Date.now() + 1500)
	await repeat(() => !!IsScaleformMovieMethodReturnValueReady(ticket) || Date.now() >= until, true, 0)
	if (!IsScaleformMovieMethodReturnValueReady(ticket)) throw 'Settings bridge did not respond'
	const value = GetScaleformMovieMethodReturnValueString(ticket)
	if (typeof value !== 'string' || value.length > 49 || /[^\x20-\x7e]/.test(value)) throw 'Invalid transport frame'
	return value
}
async function readColumn(column: 1 | 2, deadline: number): Promise<Row[]> {
	const header = await call('GFXSET1_INFO', deadline, column)
	const match = /^S1\|(\d+)\|(\d+)\|269bcc7202be$/.exec(header)
	if (!match) throw `Settings bridge unavailable: ${header}`
	const sequence = Number(match![1]),
		count = Number(match![2])
	if (!Number.isSafeInteger(sequence) || sequence < 1 || count > 512) throw 'Invalid snapshot size'
	const rows: Row[] = []
	let total = 0
	for (let index = 0; index < count; index++) {
		let json = ''
		for (;;) {
			const frame = await call('GFXSET1_CHUNK', deadline, sequence, index, json.length)
			if (!/^[DE]/.test(frame) || (frame[0] === 'D' && frame.length !== 49)) throw 'Truncated or expired snapshot'
			json += frame.slice(1)
			total += frame.length - 1
			if (json.length > 65536 || total > 1048576) throw 'Snapshot size limit exceeded'
			if (frame[0] === 'E') break
		}
		const row = JSON.parse(json) as Row
		if (
			!row ||
			row.dataIndex !== index ||
			!Array.isArray(row.rawRow) ||
			row.rawRow.length < 7 ||
			row.rawRow[0] !== index
		)
			throw 'Invalid row'
		if (
			row.rawRow.some(
				v =>
					!(
						v === null ||
						typeof v === 'string' ||
						typeof v === 'boolean' ||
						(typeof v === 'number' && Number.isFinite(v))
					),
			)
		)
			throw 'Non-scalar row'
		rows.push(row)
		await waste(0)
	}
	return rows
}
function decodeSettingsRow(row: Row) {
	const d = row.rawRow,
		type = d[3],
		index = d[4]
	const base = {
		menuId: d[1]!,
		itemId: d[2]!,
		label: String(d[6] ?? ''),
		type: type!,
		enabled: d[5] !== 0,
		uiChanged: d[5] === 2,
	}
	const integer = typeof index === 'number' && Number.isInteger(index) && index >= 0
	if ((type === 1 || type === 5 || (typeof type === 'number' && type >= 10 && type < 20)) && integer) {
		const choices = d.slice(7)
		if (index >= choices.length) throw 'Choice index out of range'
		return { ...base, kind: 'choice', selectedIndex: index, value: choices[index]!, choices }
	}
	if ((type === 2 || type === 4 || (typeof type === 'number' && type >= 20)) && integer) {
		const steps = d[7] === '' || d[7] == null ? 1 : d[7]
		if (typeof steps !== 'number' || !Number.isInteger(steps) || steps < 1 || index > steps)
			throw 'Slider index out of range'
		return {
			...base,
			kind: type === 4 ? 'meter' : 'slider',
			selectedIndex: index,
			steps,
			percent: (100 * index) / steps,
		}
	}
	// Preserve headings, actions and unknown controls without guessing their value.
	return { ...base, kind: 'other', raw: d }
}

type SectionCapture = {
	key: string
	status: 'captured' | 'unavailable'
	reason: string | null
	capturedAt: number | null
	rows: ReturnType<typeof decodeSettingsRow>[]
}
type SettingsCapture = { sections: SectionCapture[] }
let pending: Promise<Settings> | null = null
/** Reads current menu selections; automatic traversal remains untested in FiveM. */
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
		data = markCatalogUnavailable(data, ['keyBindings'], String(error))
	}
	const pages = data.sections.filter(section => section.key !== 'keyBindings').map(section => section.key)
	if (IsPauseMenuActive()) {
		data = markCatalogUnavailable(data, pages, 'Only the currently open page can be read without changing this menu')
		try {
			if (GetGameBuildNumber() !== 3889) throw 'Settings reader is restricted to build 3889'
			const rows = await readColumn(2, Date.now() + 8000)
			const sections = data.sections.filter(section => section.key !== 'keyBindings')
			const matches = sections.filter(section => matchesSection(rows, section, sections))
			if (matches.length !== 1) throw 'Current Settings page could not be identified'
			return replaceCurrent(data, matches[0]!.key, {
				...emptyCurrent(),
				status: 'captured',
				capturedAt: Date.now(),
				values: rows.map(row => currentValue(decodeSettingsRow(row))),
			})
		} catch (error) {
			return markCatalogUnavailable(data, pages, String(error))
		}
	}
	try {
		return applySettingsCapture(data, await scan())
	} catch (error) {
		return markCatalogUnavailable(data, pages, String(error))
	}
}
const clean = (value: string) => value.replace(/<[^>]*>|~[^~]*~/g, '').trim()
function matchesSection(rows: Row[], section: Settings['sections'][number], sections: Settings['sections']) {
	const own = new Set(section.rows.filter(row => row.fields.MenuPref).map(row => clean(row.label)))
	const other = new Set(
		sections
			.filter(item => item.key !== section.key)
			.flatMap(item => item.rows.filter(row => row.fields.MenuPref).map(row => clean(row.label))),
	)
	const labels = new Set(rows.map(row => clean(String(row.rawRow[6]))))
	return [...own].filter(text => !other.has(text) && labels.has(text)).length >= 2
}
async function scan(): Promise<SettingsCapture> {
	if (GetGameBuildNumber() !== 3889) throw 'Automatic settings scan is restricted to build 3889'
	if (IsPauseMenuActive() || IsNuiFocused())
		throw 'Automatic scan requires the pause menu closed and NUI input focus released'
	const deadline = Date.now() + 90000
	const sections = createCatalog().sections.filter(section => section.key !== 'keyBindings')
	const result: SettingsCapture = { sections: [] }
	try {
		ActivateFrontendMenu(GetHashKey('FE_MENU_VERSION_MP_PAUSE'), false, 6)
		const readyBy = Date.now() + 8000
		await repeat(() => GetPauseMenuState() === 15 || Date.now() >= readyBy, true, 20)
		if (GetPauseMenuState() !== 15) throw 'Pause menu did not become ready'
		// Read actual section IDs from the live left column; never guess numeric IDs.
		let nav: Row[] = []
		const navDeadline = Math.min(deadline, Date.now() + 8000)
		let navError = 'Settings sections did not load'
		await repeatAsync(async () => {
			if (Date.now() >= navDeadline) return true
			try {
				nav = await readColumn(1, navDeadline)
			} catch (error) {
				navError = String(error)
			}
			return nav.length > 0
		}, 100)
		if (nav.length === 0) throw navError
		for (const section of sections) {
			try {
				if (!IsPauseMenuActive()) throw 'Pause menu was closed'
				const matches = nav.filter(row => clean(String(row.rendered?.label ?? row.rawRow[6])) === clean(section.label))
				if (matches.length !== 1) throw 'Section missing or ambiguous in the live menu'
				const entry = matches[0]!,
					id = entry.rawRow[1]
				if (
					typeof id !== 'number' ||
					!Number.isInteger(id) ||
					id < 1000 ||
					id > 2000 ||
					entry.rendered?.menuID !== id ||
					id === 1051
				)
					throw 'Section navigation ID is unverified'

				PauseMenuceptionGoDeeper(id - 1000)
				const until = Math.min(deadline, Date.now() + 8000)
				let previous = ''
				const captured = { rows: null as Row[] | null }
				await repeatAsync(async () => {
					if (Date.now() >= until) return true
					if (!IsPauseMenuActive()) throw 'Pause menu was closed'
					let rows: Row[]
					try {
						rows = await readColumn(2, until)
					} catch {
						previous = ''
						return false
					}
					const matched = matchesSection(rows, section, sections)
					// Compare backing data; visible clips can change with scrolling or voice meters.
					const signature = JSON.stringify(
						rows.map(row =>
							row.rawRow[3] === 4 ? row.rawRow.map((value, index) => (index === 4 ? null : value)) : row.rawRow,
						),
					)
					if (matched && signature === previous) {
						captured.rows = rows
						return true
					}
					previous = matched ? signature : ''
					return false
				}, 100)
				if (!captured.rows) throw 'Section did not produce a stable, identifiable snapshot'
				result.sections.push({
					key: section.key,
					status: 'captured',
					reason: null,
					capturedAt: Date.now(),
					rows: captured.rows.map(decodeSettingsRow),
				})
			} catch (error) {
				result.sections.push({
					key: section.key,
					status: 'unavailable',
					reason: String(error),
					capturedAt: null,
					rows: [],
				})
			}
		}
		return result
	} finally {
		SetFrontendActive(false)
	}
}
