import type { Character } from "@overextended/ox_core";
import { triggerServerCallback } from "@overextended/ox_lib/client";
import { repeat } from "lenix";
import { emitNui, onNui } from "lenix/client";
import type { Starting } from "types/index";

let character: Character | undefined | null
let characters: Character[]

onNui<Starting.Requests['selectMode']>('starting:selectMode', async ({ mode }) => {
	const characterSelected = await triggerServerCallback<Character | undefined>('lenix:server:starting:modeSelected', 5000, characters, mode)

	character = characterSelected ?? undefined

	return null
})

onNui<Starting.Requests['exitGame']>('starting:exitGame', () => {
	ExecuteCommand('disconnect')
	return null
})

globalThis.exports('charselect', async (chars: Character[]): Promise<Character | undefined> => {
	character = null
	characters = chars
	emitNui<Starting.Events['modeSelection']>('starting:modeSelection')

	return repeat(() => character, character => character !== null, 1000)
})