import type { Character } from "@overextended/ox_core";
import { triggerServerCallback } from "@overextended/ox_lib/client";
import { repeat } from "@lenix/lenix";
import { control, emitNui, isNuiReady, onNui, pool } from "lenix/client";
import type { Start } from "types/index";
import { login as competitive } from "../competitive";
import { login as outlaw } from "../outlaw";

let character: Character | undefined | null
let characters: Character[]
let logout: () => void = () => {}

onNui<Start.Requests['selectMode']>('start:selectMode', async ({ mode }) => {
	const characterSelected = await triggerServerCallback<Character | undefined>('lenix:server:start:modeSelected', 5000, characters, mode)

	character = characterSelected ?? undefined

	switch (mode) {
		case 'competitive': {
			logout = competitive(logout)
			break
		}
		case 'outlaw': {
			logout = outlaw(logout)
			break
		}
		default: throw `Wrong mode: ${mode}`
	}

	return null
})

control.on({
	event: 'press',
	key: 'ESCAPE',
	onEvent: () => {
		emitNui<Start.Events['pause']>('start:pause')
	}
})

globalThis.exports('charselect', async (chars: Character[]): Promise<Character | undefined> => {
	character = null
	characters = chars

	await repeat(() => isNuiReady(), true, 500)
	emitNui<Start.Events['modeSelection']>('start:modeSelection')
	console.log('mode select')

	return repeat(() => character, character => character !== null, 500)
})

pool(DisableFrontendThisFrame)