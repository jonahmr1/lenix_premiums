import { repeat } from "@lenix/lenix"
import { LoadFile } from "common/utils"
import type { Start } from "types/index"

const catalog = LoadFile('public/gta-controls.json')

const loadMovie = async (name: string) => {
	console.log(`[keybinds] Loading ${name}`)
	const handle = RequestScaleformMovie(name)
	const deadline = Date.now() + 15000
	await repeat(() => !!HasScaleformMovieLoaded(handle) || Date.now() >= deadline, true, 0)
	if (!HasScaleformMovieLoaded(handle)) {
		if (handle) SetScaleformMovieAsNoLongerNeeded(handle)
		throw new Error(`${name} did not load after 15 seconds`)
	}
	console.log(`[keybinds] Loaded ${name}`)
	return handle
}

const invoke = async (movie: number, name: string, args: (string | number)[] = [], returns = false) => {
	if (!BeginScaleformMovieMethod(movie, name)) {
		throw new Error(`Could not start ${name}`)
	}
	for (const arg of args) {
		if (typeof arg === 'number') ScaleformMovieMethodAddParamInt(arg)
		else ScaleformMovieMethodAddParamTextureNameString(arg)
	}
	if (!returns) {
		EndScaleformMovieMethod()
		return ''
	}
	const result = EndScaleformMovieMethodReturnValue()
	const deadline = Date.now() + 3000
	await repeat(() => !!IsScaleformMovieMethodReturnValueReady(result) || Date.now() >= deadline, true, 0)
	if (!IsScaleformMovieMethodReturnValueReady(result)) throw new Error(`${name} timed out`)
	return GetScaleformMovieMethodReturnValueString(result)
}

const decodeText = (hex: string) => {
	if (!/^(?:[0-9a-fA-F]{4})+$/.test(hex)) throw new Error(`Invalid text transport: ${hex}`)
	return hex
		.match(/.{4}/g)!
		.map(code => String.fromCharCode(parseInt(code, 16)))
		.join('')
}

const readSlot = async (movie: number, name: string, slot: number) => {
	await invoke(movie, 'READ', [name, slot])
	const length = Number(await invoke(movie, 'SNAPSHOT', [], true))
	if (!Number.isInteger(length) || length < 1 || length > 65536) throw new Error('Invalid result length')
	let value = ''
	for (let offset = 0; offset < length; offset += 48) {
		const chunk = await invoke(movie, 'CHUNK', [offset], true)
		if (chunk.length !== Math.min(48, length - offset)) throw new Error('Incomplete result')
		value += chunk
	}
	return value.split('|').map(token => {
		if (token.startsWith('raw_')) return 'raw_' + decodeText(token.slice(4))
		if (!token.startsWith('t_')) return token
		return 't_' + decodeText(token.slice(2))
	})
}

let pending: Promise<Start.Keybind[]> | undefined

// Concurrent callers share one scan. Call again to refresh after it finishes.
export const readKeybinds = (): Promise<Start.Keybind[]> => {
	return (pending ??= scan().finally(() => {
		pending = undefined
	}))
}

const scan = async (): Promise<Start.Keybind[]> => {
	let movie = 0,
		tick: number | undefined
	try {
		const builtin = await loadMovie('instructional_buttons')
		SetScaleformMovieAsNoLongerNeeded(builtin)
		movie = await loadMovie('lenix_keybind_reader_blank')
		tick = setTick(() => DrawScaleformMovieFullscreen(movie, 255, 255, 255, 0, 0))
		console.log('[keybinds] Initializing reader')
		await invoke(movie, 'INIT', [], true)
		console.log('[keybinds] Checking symbols and text')
		if ((await invoke(movie, 'CHECK_MARKER', [], true)) !== 'expected=TEXTBTN_1000; actual=TEXTBTN_1000')
			throw new Error('Keybind symbols failed')
		if (decodeText(await invoke(movie, 'CHECK_ENCODING', [], true)).slice(0, 3) !== 'Jé|')
			throw new Error('Keybind text transport failed')

		const rows: Start.Keybind[] = []
		const read = async (source: Start.Keybind['source'], section: string, name: string, lookup = name) => {
			console.log(`[keybinds] Reading ${name}`)
			const primary = await readSlot(movie, lookup, 0)
			const secondary = await readSlot(movie, lookup, 1)
			// Build 3889: never-assigned FiveM secondary can echo the primary as plain text.
			const secondaryFallback =
				source === 'FIVEM' &&
				primary.length === 1 &&
				/^(t_.+|b_\d+)$/.test(primary[0]!) &&
				secondary.length === 1 &&
				secondary[0] === 'raw_' + primary[0]
			rows.push({
				source,
				section,
				name,
				primary,
				secondary: secondaryFallback ? ['UNBOUND'] : secondary,
				secondaryFallback,
			})
			console.log(`[${source}] Found #${rows.length} ${name}: primary=${JSON.stringify(primary)} secondary=${JSON.stringify(secondaryFallback ? ['UNBOUND'] : secondary)}`)
		}
		const seen = new Set<string>()
		for (const section of catalog.sections)
			for (const { name } of section.actions) {
				if (seen.has(name)) continue
				seen.add(name)
				await read('GTA', section.name, name)
			}
		const commands = [...new Set<string>(GetRegisteredCommands().map(({ name }: { name: string }) => name))]
		for (let offset = 0; offset < commands.length; offset += 20) {
			const batch = commands.slice(offset, offset + 20)
			const lookups = batch.map(name => 'INPUT_' + (GetHashKey(name) >>> 0).toString(16).toUpperCase().padStart(8, '0'))
			const bits = await invoke(movie, 'DISCOVER', [lookups.join('|')], true)
			if (bits.length !== batch.length || /[^01]/.test(bits)) throw new Error('Invalid discovery')
			for (let i = 0; i < batch.length; i++)
				if (bits[i] === '1') await read('FIVEM', 'PM_PANE_CFX', batch[i]!, lookups[i]!)
		}
		console.log(`Found ${rows.length} keybinds`)
		return rows
	} catch (error) {
		console.error('[keybinds] Scan failed:', error instanceof Error ? error.stack : String(error))
		throw error
	} finally {
		if (tick !== undefined) clearTick(tick)
		if (movie) SetScaleformMovieAsNoLongerNeeded(movie)
	}
}
