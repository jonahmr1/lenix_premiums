import type { Character } from "@overextended/ox_core";
import { createPed, triggerServerCallback } from "@overextended/ox_lib/client";
import { asserts, repeat } from "@lenix/lenix";
import { api, cam, control, emitNui, isNuiReady, onNui, pool } from "lenix/client";
import type { Start } from "types/index";
import police from "../police";
import warzone from "../warzone";
import gang from "../gang";
import common from "../common";
import type { Vec4 } from "lenix";

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

const PED_COORDS: Vec4 = [84.0127, 628.6093, 207.3891, 174.8069]

globalThis.exports('charselect', async (chars: Character[]): Promise<Character | undefined> => {
	character = null
	characters = chars

	await repeat(() => isNuiReady(), true, 500)
	emitNui<Start.Events['modeSelection']>('start:modeSelection')

	
	const ped = await createPed('mp_m_freemode_01', ...PED_COORDS)
	
	const firstChar = characters[0]
	asserts(firstChar)
	const appearance = await triggerServerCallback('lenix:server:appearance:getappearance', null, firstChar.charId)
	if (!appearance) console.error(`Failed to get character<${firstChar.charId}> appearance`)
	
	api['illenium-appearance']?.setPedAppearance?.(ped, appearance)


	const [dispose] = cam.create({
		coords: PED_COORDS,
	})


	const selected = await repeat(() => character, character => character !== null, 500)


	dispose()
	DeletePed(ped.handle)

	return selected
})

pool(DisableFrontendThisFrame)