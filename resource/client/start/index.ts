import type { Character } from "@overextended/ox_core";
import { triggerServerCallback } from "@overextended/ox_lib/client";
import { repeat } from "@lenix/lenix";
import { api, control, emitNui, isNuiReady, onNui, pool } from "lenix/client";
import type { Start } from "types/index";
import police from "../police";
import warzone from "../warzone";
import gang from "../gang";
import common from "../common";

let character: Character | undefined | null
let characters: Character[]
let logout: () => void = () => {}

onNui<Start.Requests['selectMode']>('start:selectMode', async ({ mode }) => {
	const characterSelected = await triggerServerCallback<Character | undefined>('lenix:server:start:modeSelected', 5000, characters, mode)

	character = characterSelected ?? undefined

	switch (mode) {
		case 'warzone': {
			logout = warzone(logout)
			break
		}
		case 'police': {
			logout = () => {
				police(logout)
				common(logout, 'police')
			}
			break
		}
		case 'gang': {
			logout = () => {
				gang(logout)
				common(logout, 'gang')
			}
			break
		}
		default: throw `Unexcepected mode: ${mode}`
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
	ShutdownLoadingScreen()

	return repeat(() => character, character => character !== null, 500)
})

pool(DisableFrontendThisFrame)