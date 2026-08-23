import type { Character } from "@overextended/ox_core";
import { repeat } from "lenix";
import { emitNui, onNui } from "lenix/client";
import type { Starting } from "types/index";

let character: Character | undefined | null = null
let characters: Character[]

onNui<Starting.Requests['selectMode']>('starting:selectMode', async ({ mode }) => {
	switch (mode) {
		case 'competitive': {
			character = characters[0]
			return null
		}
		case 'outlaw': {
			character = characters[1]
			return null
		}
		default: throw `Wrong selection mode: ${mode}`
	}
})

onNui<Starting.Requests['exitGame']>('starting:exitGame', () => {
	QuitGame()
	return null
})

exports('charselect', async (chars: Character[]): Promise<Character | undefined> => {
	characters = chars
	emitNui<Starting.Events['modeSelection']>('starting:modeSelection')
	
	return await repeat(() => character, undefined, 1000)
})