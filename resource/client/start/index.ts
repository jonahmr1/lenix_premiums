import type { Character } from "@overextended/ox_core";
import { createPed, triggerServerCallback } from "@overextended/ox_lib/client";
import { repeat } from "@lenix/lenix";
import { api, cam, control, emitNui, isNuiReady, onNui, player, pool } from "lenix/client";
import type { Start } from "types/index";
import police from "../police";
import warzone from "../warzone";
import gang from "../gang";
import common from "../common";
import type { Vec4 } from "lenix";

const PED_COORDS: Vec4 = [84.0127, 628.9093, 207.3891, 174.8069]
const CAM_OFFSET: Vec4 = [2, 2.5, 30, -5]

let character: Start.CharacterRespose | null
let characters: Character[]
let logout: () => void = () => {}

onNui<Start.Requests['selectMode']>('start:selectMode', async ({ mode, character: selectedChar }) => {
	character = selectedChar

	switch (mode) {
		case 'warzone': {
			logout = warzone()
			break
		}
		case 'police': {
			const modules = [
				police(),
				common('police')
			]
			logout = () => modules.forEach(mod => mod())
			break
		}
		case 'gang': {
			const modules = [
				gang(),
				common('gang')
			]
			logout = () => modules.forEach(mod => mod())
			break
		}
		default: throw `Unexcepected mode: ${mode}`
	}


	return null
})

onNui<Start.Requests['logout']>('start:logout', () => {
	logout()
	return null
})

control.on({
	event: 'press',
	key: 'ESCAPE',
	onEvent: () => {
		emitNui<Start.Events['pause']>('start:pause')
	}
})

globalThis.exports('charselect', async (chars: Character[]): Promise<Start.CharacterRespose> => {
	character = null
	characters = chars

	await repeat(() => isNuiReady(), true, 500)
	emitNui<Start.Events['modeSelection']>('start:modeSelection', characters)


	DoScreenFadeIn(0)
	SetEntityCoords(player.entity(), PED_COORDS[0], PED_COORDS[1], PED_COORDS[2], false, false, false, false)
	SetEntityHeading(player.entity(), PED_COORDS[3])
	SetEntityVisible(player.entity(), false, false)
	const ped = await createPed('mp_m_freemode_01', ...PED_COORDS)
	const firstChar = characters[0]
	if (firstChar) {
		const appearance = await triggerServerCallback('lenix:server:appearance:getappearance', null, firstChar.charId)
		if (!appearance) console.error(`Failed to get character<${firstChar.charId}> appearance`)
		
		api['illenium-appearance']?.setPedAppearance?.(ped.handle, appearance)
	}
	const [dispose] = cam.create({
		coords: PED_COORDS,
		offset: CAM_OFFSET,
		details: {
			fov: 30,
			rotationOrder: 0,
			fadeIn: 0,
			fadeOut: 0,
			delay: 0
		}
	})
	ShutdownLoadingScreen()

	
	const selected = await repeat(
		() => character, character => character !== null, 500
	)


	dispose()
	DeletePed(ped.handle)
	SetEntityVisible(player.entity(), true, false)

	return selected
})

pool(DisableFrontendThisFrame)