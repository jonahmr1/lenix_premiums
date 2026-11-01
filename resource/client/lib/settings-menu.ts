// GET-only settings capture. Hidden activation is restricted to prepareGame/loading.
// UNTESTED IN FIVEM: rendering suppression, navigation and shutdown need Windows validation.
import { repeat, waste } from '@lenix/lenix'
type Scalar = string | number | boolean | null
type Row = {
	dataIndex: number
	uiIndex: Scalar
	rawRow: Scalar[]
	rendered: Record<string, Scalar> | null
}
type Section = {
	key: string
	label: string
	rows: { label: string; fields: Record<string, string> }[]
}
async function call(method: string, deadline: number, menuActive: boolean, ...args: number[]) {
	if (!!IsPauseMenuActive() !== !!menuActive) throw 'Pause menu state changed during capture'
	if (Date.now() >= deadline) throw 'Capture deadline exceeded'
	if (!BeginScaleformMovieMethodOnFrontend(method)) throw 'Settings frontend unavailable'
	args.forEach(arg => ScaleformMovieMethodAddParamInt(arg))
	const ticket = EndScaleformMovieMethodReturnValue()
	const until = Math.min(deadline, Date.now() + 1500)
	await repeat(
		() => !!IsScaleformMovieMethodReturnValueReady(ticket) || Date.now() >= until,
		true,
		0,
	)
	if (!IsScaleformMovieMethodReturnValueReady(ticket)) throw 'Settings bridge did not respond'
	if (!!IsPauseMenuActive() !== !!menuActive) throw 'Pause menu state changed during capture'
	const value = GetScaleformMovieMethodReturnValueString(ticket)
	if (typeof value !== 'string' || value.length > 49 || /[^\x20-\x7e]/.test(value))
		throw 'Invalid transport frame'
	return value
}
async function readColumn(column: 1 | 2, deadline: number, menuActive: boolean): Promise<Row[]> {
	const header = await call('GFXSET1_INFO', deadline, menuActive, column)
	const match = /^S1\|(\d+)\|(\d+)\|269bcc7202be$/.exec(header)
	if (!match) throw `Settings bridge unavailable: ${header}`
	const sequence = Number(match![1]),
		count = Number(match![2])
	if (!Number.isSafeInteger(sequence) || sequence < 1 || count > 512) throw 'Invalid snapshot size'
	const rows: Row[] = []
	let total = 0
	for (let index = 0; index < count; index++) {
		let json = ''
		let finished = false
		for (let chunk = 0; chunk < 1366; chunk++) {
			const frame = await call('GFXSET1_CHUNK', deadline, menuActive, sequence, index, json.length)
			if (!/^[DE]/.test(frame) || (frame[0] === 'D' && frame.length !== 49))
				throw 'Truncated or expired snapshot'
			json += frame.slice(1)
			total += frame.length - 1
			if (json.length > 65536 || total > 1048576) throw 'Snapshot size limit exceeded'
			if (frame[0] === 'E') {
				finished = true
				break
			}
		}
		if (!finished) throw 'Incomplete settings row'
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
	if (type === 1 || type === 5 || (typeof type === 'number' && type >= 10 && type < 20)) {
		if (!integer) throw 'Invalid choice index'
		const choices = d.slice(7)
		if (index >= choices.length) throw 'Choice index out of range'
		return {
			...base,
			kind: 'choice' as const,
			selectedIndex: index,
			value: choices[index]!,
			choices,
		}
	}
	if (type === 2 || type === 4 || (typeof type === 'number' && type >= 20)) {
		if (!integer) throw 'Invalid slider index'
		const steps = d[7] === '' || d[7] == null ? 1 : d[7]
		if (typeof steps !== 'number' || !Number.isInteger(steps) || steps < 1 || index > steps)
			throw 'Slider index out of range'
		return {
			...base,
			kind: (type === 4 ? 'meter' : 'slider') as 'meter' | 'slider',
			selectedIndex: index,
			steps,
			percent: (100 * index) / steps,
		}
	}
	// Preserve headings, actions and unknown controls without guessing their value.
	return { ...base, kind: 'other' as const, raw: d }
}

const clean = (value: string) => value.replace(/<[^>]*>|~[^~]*~/g, '').trim()
function matchesSection(rows: Row[], section: Section, sections: Section[]) {
	const own = new Set(section.rows.filter(row => row.fields.MenuPref).map(row => clean(row.label)))
	const other = new Set(
		sections
			.filter(item => item.key !== section.key)
			.flatMap(item => item.rows.filter(row => row.fields.MenuPref).map(row => clean(row.label))),
	)
	const labels = new Set(rows.map(row => clean(String(row.rawRow[6]))))
	return [...own].filter(text => !other.has(text) && labels.has(text)).length >= 2
}

export async function readSettingsMenu(
	sections: Section[],
	menuActive = !!IsPauseMenuActive(),
	deadline = Date.now() + 30000,
	expectedKey?: string,
) {
	if (GetGameBuildNumber() !== 3889) throw 'Menu capture is verified only against build 3889 data'
	const first = await readColumn(2, deadline, menuActive)
	if (first.length === 0) throw 'Settings bridge returned no rows'
	const matches = sections.filter(section => matchesSection(first, section, sections))
	if (matches.length !== 1) throw 'Loaded settings page could not be identified'
	const key = matches[0]!.key
	if (expectedKey && key !== expectedKey) throw 'Frontend returned a different settings category'
	if (!['graphics', 'advancedGraphics', 'display'].includes(key)) return null
	// Reject transitions, mixed pages, and values changing during transport.
	const second = await readColumn(2, deadline, menuActive)
	if (
		JSON.stringify(first.map(row => row.rawRow)) !== JSON.stringify(second.map(row => row.rawRow))
	)
		throw 'Settings changed during capture'
	return { key, rows: second.map(decodeSettingsRow) }
}

type Capture = NonNullable<Awaited<ReturnType<typeof readSettingsMenu>>>
const targets = ['graphics', 'advancedGraphics', 'display']
let hiddenBusy = false
export const isHiddenSettingsBusy = () => hiddenBusy

/** Only call while lenix_premiums still owns its loading screen. Never changes a setting. */
export async function readHiddenSettings(sections: Section[]) {
	if (GetGameBuildNumber() !== 3889) throw 'Hidden capture supports only build 3889'
	if (hiddenBusy || IsPauseMenuActive() || GetPauseMenuState() !== 0)
		throw 'Frontend already active; hidden capture skipped'
	const version = GetHashKey('FE_MENU_VERSION_MP_PAUSE')
	const deadline = Date.now() + 75000
	const captures: Capture[] = []
	const errors: Record<string, string> = {}
	let closing = false
	let owned = false
	let stopped = false
	let guard = 0
	const ownsFrontend = () => owned && GetCurrentFrontendMenuVersion() >>> 0 === version >>> 0
	const close = () => {
		closing = true
		if (ownsFrontend()) {
			SetFrontendActive(false)
			SetPauseMenuActive(false)
		}
	}
	const protect = () => {
		SuppressFrontendRenderingThisFrame()
		// During loading, prevent mouse, keyboard and controller changes to preferences.
		for (const group of [0, 1, 2]) DisableAllControlActions(group)
		if (Date.now() >= deadline) close()
		if (closing && GetPauseMenuState() === 0 && !IsPauseMenuActive()) {
			clearTick(guard)
			hiddenBusy = false
			removeEventListener('onResourceStop', onStop)
		}
	}
	const onStop = (resource: string) => {
		if (resource !== GetCurrentResourceName()) return
		stopped = true
		SuppressFrontendRenderingThisFrame()
		close()
		clearTick(guard)
		hiddenBusy = false
		removeEventListener('onResourceStop', onStop)
	}
	const ensureOwned = () => {
		if (stopped || closing || Date.now() >= deadline) throw 'Hidden capture stopped or timed out'
		if (!ownsFrontend() || !IsPauseMenuActive()) throw 'Frontend ownership changed during capture'
	}
	hiddenBusy = true
	on('onResourceStop', onStop)
	try {
		// Arm suppression BEFORE activation, and keep it through asynchronous shutdown.
		protect()
		guard = setTick(protect)
		owned = true
		ActivateFrontendMenu(version, false, 6)
		const readyBy = Math.min(deadline, Date.now() + 8000)
		await repeat(() => GetPauseMenuState() === 15 || stopped || Date.now() >= readyBy, true, 0)
		ensureOwned()
		if (GetPauseMenuState() !== 15) throw 'Hidden frontend did not become ready'
		let navigation: Row[] = []
		let navError = 'Settings navigation did not load'
		const navDeadline = Math.min(deadline, Date.now() + 5000)
		for (let attempt = 0; attempt < 4 && Date.now() < navDeadline; attempt++) {
			ensureOwned()
			try {
				navigation = await readColumn(1, navDeadline, true)
				if (navigation.length) break
			} catch (error) {
				navError = String(error)
			}
			await waste(100)
		}
		if (!navigation.length) throw navError
		for (const key of targets) {
			try {
				ensureOwned()
				const section = sections.find(section => section.key === key)!
				const entries = navigation.filter(
					row => clean(String(row.rawRow[6])) === clean(section.label),
				)
				const id = entries[0]?.rawRow[1]
				// IDs come from the live category column, not preference IDs or fixed row positions.
				if (
					entries.length !== 1 ||
					typeof id !== 'number' ||
					!Number.isInteger(id) ||
					id <= 1000 ||
					id >= 2000 ||
					id === 1051
				)
					throw 'Missing or ambiguous settings category'
				// MENU_INTERACTION's NO_BUTTON_PRESSED path selects column 0 and asks
				// game code to fill the selected category through LAYOUT_CHANGE_INITIAL_FILL.
				// Inception replaces the page; settings categories belong to the existing page.
				if (!BeginScaleformMovieMethodOnFrontend('MENU_INTERACTION'))
					throw 'Settings navigation unavailable'
				ScaleformMovieMethodAddParamInt(9999)
				ScaleformMovieMethodAddParamBool(true)
				ScaleformMovieMethodAddParamInt(entries[0]!.dataIndex)
				ScaleformMovieMethodAddParamBool(false)
				EndScaleformMovieMethod()
				await waste(450)
				const sectionDeadline = Math.min(deadline, Date.now() + 30000)
				let captured: Capture | null = null
				let reason = 'Settings category did not populate'
				for (let attempt = 0; attempt < 3 && Date.now() < sectionDeadline; attempt++) {
					ensureOwned()
					try {
						const snapshot = await readSettingsMenu(sections, true, sectionDeadline, key)
						ensureOwned()
						if (snapshot?.key === key) {
							captured = snapshot
							break
						}
						reason = 'Frontend returned a different settings category'
					} catch (error) {
						reason = String(error)
					}
					await waste(100)
				}
				if (!captured) throw reason
				captures.push(captured)
			} catch (error) {
				errors[key] = String(error)
			}
		}
	} finally {
		close()
		const until = Date.now() + 3000
		await repeat(() => !hiddenBusy || stopped || Date.now() >= until, true, 0)
		// If closure is delayed, the guard keeps rendering suppressed and blocks loading shutdown.
		// It releases itself when the frontend finishes closing; the stop handler remains until then.
		if (!hiddenBusy) removeEventListener('onResourceStop', onStop)
	}
	if (hiddenBusy) throw 'Frontend shutdown delayed; loading screen retained'
	return { captures, errors }
}
