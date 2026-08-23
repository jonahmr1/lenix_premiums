import type { Character } from "@overextended/ox_core";
import { repeat } from "lenix";
import { api, emitNui, onNui } from "lenix/client";
import type { Starting } from "types/index";

let character: Character | undefined | null = null
let characters: Character[]

onNui<Starting.Requests['selectMode']>('starting:selectMode', async ({ mode }) => {
	switch (mode) {
		case 'competitive': {
			try {
				character = await api.lenix?.charselect?.<
					Promise<Character | undefined>, [Character[], 'menu' | 'native']
				>(characters, 'menu')
				return true
			} catch (e) {
				return false
			}
		}
		case 'outlaw': {
			return true
		}
		default: throw `Wrong selection mode: ${mode}`
	}
})

exports('charselect', async (chars: Character[]): Promise<Character | undefined> => {
	characters = chars
	emitNui<Starting.Events['modeSelection']>('starting:modeSelection')
	return repeat(() => character, undefined, 1000)
})