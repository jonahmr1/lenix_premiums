// Experimental, UNTESTED in FiveM. Saved XML is not verified applied renderer state.
import { repeat } from '@lenix/lenix'

type Values = { graphics: Record<string, number | boolean>; video: Record<string, number | boolean> }
type Attempt = { loader: 'LoadVars' | 'XML' | 'MovieClip.loadVariables'; status: string; reason: string | null }
type FileResult = { path: string; status: 'loaded' | 'unavailable'; attempts: Attempt[]; values: Values | null }
export type SavedGraphics = {
	readerVersion: 'LXML2'
	status: 'loaded' | 'ambiguous' | 'unavailable'
	valueState: 'savedFile'
	appliedState: 'unverified'
	capturedAt: number
	source: string | null
	reason: string | null
	files: FileResult[]
}
const paths = ['fxd:/gta5_settings.xml', 'user:/settings.xml'] as const
const loaders = ['LoadVars', 'XML', 'MovieClip.loadVariables'] as const
const movieName = 'lenix_settings_xml_reader'
const limit = 16384

// Parse only the numeric/boolean graphics and video sections of the known schema.
// No external entities, arbitrary file paths, UI labels or guessed enum mappings.
function parseSettingsXml(raw: string): Values {
	const xml = raw
		.replace(/^\uFEFF/, '')
		.replace(/<\?xml\s[^?]*\?>/, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.trim()
	if (raw.length > limit || !/^<Settings\s*>[\s\S]*<\/Settings>$/.test(xml) || /<!|<\?/.test(xml))
		throw new Error('Not a supported GTA Settings XML document')
	const values: Values = { graphics: {}, video: {} }
	for (const group of ['graphics', 'video'] as const) {
		const blocks = [...xml.matchAll(new RegExp(`<${group}\\s*>([\\s\\S]*?)<\\/${group}>`, 'g'))]
		if (blocks.length !== 1) throw new Error(`Expected one ${group} section`)
		const rest = blocks[0]![1]!.replace(
			/<([A-Za-z][A-Za-z0-9_]*)\s+value\s*=\s*(["'])([^"']*)\2\s*\/>/g,
			(_, key: string, _quote: string, text: string) => {
				if (Object.hasOwn(values[group], key) || ['__proto__', 'constructor', 'prototype'].includes(key))
					throw new Error(`Duplicate or invalid ${group} field`)
				const value =
					text === 'true'
						? true
						: text === 'false'
							? false
							: /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(text)
								? Number(text)
								: NaN
				if (typeof value === 'number' && !Number.isFinite(value)) throw new Error(`Invalid ${group}.${key} value`)
				values[group][key] = value
				return ''
			},
		)
		if (rest.trim() || !Object.keys(values[group]).length || Object.keys(values[group]).length > 256)
			throw new Error(`Unsupported ${group} content`)
	}
	return values
}

export async function readSavedGraphics(): Promise<SavedGraphics> {
	const result: SavedGraphics = {
		readerVersion: 'LXML2',
		status: 'unavailable',
		valueState: 'savedFile',
		appliedState: 'unverified',
		capturedAt: Date.now(),
		source: null,
		reason: null,
		files: paths.map(path => ({ path, status: 'unavailable', attempts: [], values: null })),
	}
	let movie = 0
	let tick: number | undefined
	const deadline = Date.now() + 25000
	const invoke = async (method: string, args: number[] = []) => {
		if (Date.now() >= deadline) throw new Error('XML reader exceeded its 25-second limit')
		if (!BeginScaleformMovieMethod(movie, method)) throw new Error(`XML reader could not start ${method}`)
		for (const arg of args) ScaleformMovieMethodAddParamInt(arg)
		const id = EndScaleformMovieMethodReturnValue()
		const expires = Math.min(deadline, Date.now() + 1500)
		await repeat(() => !!IsScaleformMovieMethodReturnValueReady(id) || Date.now() >= expires, true, 0)
		if (!IsScaleformMovieMethodReturnValueReady(id)) throw new Error(`XML reader ${method} timed out`)
		return GetScaleformMovieMethodReturnValueString(id)
	}
	try {
		movie = RequestScaleformMovieInstance(movieName)
		const loadDeadline = Date.now() + 5000
		await repeat(() => !!HasScaleformMovieLoaded(movie) || Date.now() >= loadDeadline, true, 0)
		if (!HasScaleformMovieLoaded(movie)) throw new Error(`${movieName}.gfx did not load within 5 seconds`)
		// Advance only this empty movie; it has no visual objects and zero alpha.
		tick = setTick(() => DrawScaleformMovieFullscreen(movie, 255, 255, 255, 0, 0))
		if ((await invoke('START')) !== 'LXML2') throw new Error('XML reader version mismatch')
		const states = Array.from({ length: paths.length * loaders.length }, () => ({ status: 'loading', length: 0 }))
		const fileDeadline = Date.now() + 4000
		for (let poll = 0; poll < 100; poll++) {
			for (let i = 0; i < states.length; i++) {
				if (states[i]!.status !== 'loading') continue
				const match =
					/^LXML2\|(loading|ready|failed|unsupportedConstructor|unsupportedLoad|tooLarge|invalidData)\|(\d+)$/.exec(
						await invoke('INFO', [i]),
					)
				if (!match) throw new Error('Invalid XML reader status')
				const length = Number(match[2])
				if (
					!Number.isInteger(length) ||
					length > limit * 4 ||
					length % 4 !== 0 ||
					(match[1] === 'ready' && length === 0)
				)
					throw new Error('Invalid XML reader payload length')
				states[i] = { status: match[1]!, length }
			}
			if (states.every(state => state.status !== 'loading') || Date.now() >= fileDeadline) break
			const nextPoll = Math.min(fileDeadline, Date.now() + 50)
			await repeat(() => Date.now() >= nextPoll, true, 0)
		}
		for (let fileIndex = 0; fileIndex < paths.length; fileIndex++) {
			const file = result.files[fileIndex]!
			for (let loaderIndex = 0; loaderIndex < loaders.length; loaderIndex++) {
				const index = fileIndex * loaders.length + loaderIndex
				const state = states[index]!
				const attempt: Attempt = {
					loader: loaders[loaderIndex]!,
					status: state.status === 'loading' ? 'timeout' : state.status,
					reason: null,
				}
				file.attempts.push(attempt)
				if (state.status !== 'ready') {
					attempt.reason =
						state.status === 'failed'
							? 'No file data returned; missing file or denied/unsupported loading cannot be distinguished'
							: state.status === 'invalidData'
								? 'Legacy loader returned fragmented or non-text data; no values accepted'
								: `Loader ${attempt.status}`
					continue
				}
				if (file.values) continue
				try {
					let raw = ''
					for (let offset = 0; offset < state.length; offset += 48) {
						const chunk = await invoke('CHUNK', [index, offset])
						if (!/^(?:[0-9a-f]{4})+$/.test(chunk) || chunk.length !== Math.min(48, state.length - offset))
							throw new Error('Incomplete XML transport')
						raw += chunk
							.match(/.{4}/g)!
							.map(code => String.fromCharCode(parseInt(code, 16)))
							.join('')
					}
					file.values = parseSettingsXml(raw)
					file.status = 'loaded'
					attempt.status = 'parsed'
				} catch (error) {
					attempt.status = 'invalid'
					attempt.reason = String(error)
				}
			}
		}
		const loaded = result.files.filter(file => file.status === 'loaded')
		result.status = loaded.length === 1 ? 'loaded' : loaded.length > 1 ? 'ambiguous' : 'unavailable'
		result.source = loaded.length === 1 ? loaded[0]!.path : null
		result.reason =
			loaded.length > 1
				? 'Both settings files exist; the active file is unverified'
				: loaded.length === 1
					? 'Saved file read; active file and applied renderer state are unverified'
					: 'Neither settings file could be read and parsed; see attempts'
	} catch (error) {
		result.reason = String(error)
	} finally {
		if (tick !== undefined) clearTick(tick)
		if (movie) SetScaleformMovieAsNoLongerNeeded(movie)
		result.capturedAt = Date.now()
	}
	return result
}
