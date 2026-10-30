// Read-only attempt against the existing frontend, even when the pause menu is closed.
// Never opens, navigates or creates a menu. Closed-menu capture is UNTESTED in-game.
// Returned rows may be cached; fresh transport does not prove fresh settings.
import { repeat, waste } from '@lenix/lenix'
type Scalar = string | number | boolean | null
type Row = { dataIndex: number; uiIndex: Scalar; rawRow: Scalar[]; rendered: Record<string, Scalar> | null }
type Section = { key: string; rows: { label: string; fields: Record<string, string> }[] }
async function call(method: string, deadline: number, menuActive: boolean, ...args: number[]) {
	if (IsPauseMenuActive() !== menuActive) throw 'Pause menu state changed during capture'
	if (Date.now() >= deadline) throw 'Capture deadline exceeded'
	if (!BeginScaleformMovieMethodOnFrontend(method)) throw 'Settings frontend unavailable'
	args.forEach(arg => ScaleformMovieMethodAddParamInt(arg))
	const ticket = EndScaleformMovieMethodReturnValue()
	const until = Math.min(deadline, Date.now() + 1500)
	await repeat(() => !!IsScaleformMovieMethodReturnValueReady(ticket) || Date.now() >= until, true, 0)
	if (!IsScaleformMovieMethodReturnValueReady(ticket)) throw 'Settings bridge did not respond'
	if (IsPauseMenuActive() !== menuActive) throw 'Pause menu state changed during capture'
	const value = GetScaleformMovieMethodReturnValueString(ticket)
	if (typeof value !== 'string' || value.length > 49 || /[^\x20-\x7e]/.test(value)) throw 'Invalid transport frame'
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
			if (!/^[DE]/.test(frame) || (frame[0] === 'D' && frame.length !== 49)) throw 'Truncated or expired snapshot'
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
		return { ...base, kind: 'choice' as const, selectedIndex: index, value: choices[index]!, choices }
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

export async function readSettingsMenu(sections: Section[], menuActive = IsPauseMenuActive()) {
	if (GetGameBuildNumber() !== 3889) throw 'Menu capture is verified only against build 3889 data'
	const deadline = Date.now() + 8000
	const first = await readColumn(2, deadline, menuActive)
	if (first.length === 0) throw 'Settings bridge returned no rows'
	const matches = sections.filter(section => matchesSection(first, section, sections))
	if (matches.length !== 1) throw 'Loaded settings page could not be identified'
	const key = matches[0]!.key
	if (!['graphics', 'advancedGraphics', 'display'].includes(key)) return null
	// Reject transitions, mixed pages, and values changing during transport.
	const second = await readColumn(2, deadline, menuActive)
	if (JSON.stringify(first.map(row => row.rawRow)) !== JSON.stringify(second.map(row => row.rawRow)))
		throw 'Settings changed during capture'
	return { key, rows: second.map(decodeSettingsRow) }
}
