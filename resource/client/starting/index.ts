import type { Character } from "@overextended/ox_core";
import { triggerServerCallback } from "@overextended/ox_lib/client";
import { repeat } from "@lenix/lenix";
import { emitNui, isNuiReady, onNui } from "lenix/client";
import type { Starting } from "types/index";
import { login as competitive } from "../competitive";
import { login as outlaw } from "../outlaw";

let character: Character | undefined | null
let characters: Character[]
let logout: () => void = () => {}

onNui<Starting.Requests['selectMode']>('starting:selectMode', async ({ mode }) => {
	const characterSelected = await triggerServerCallback<Character | undefined>('lenix:server:starting:modeSelected', 5000, characters, mode)

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

globalThis.exports('charselect', async (chars: Character[]): Promise<Character | undefined> => {
	character = null
	characters = chars

	await repeat(() => isNuiReady(), true, 500)
	emitNui<Starting.Events['modeSelection']>('starting:modeSelection')

	return repeat(() => character, character => character !== null, 500)
})
