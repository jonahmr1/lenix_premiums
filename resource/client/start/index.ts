import type { Character } from '@overextended/ox_core'
import { createPed } from '@overextended/ox_lib/client'
import { asserts, repeat } from '@lenix/lenix'
import { cam, emitNui, isNuiReady, onNui, player } from 'lenix/client'
import type { Mapped, Start } from 'types/index'
import police from '../police'
import warzone from '../warzone'
import gang from '../gang'
import common from '../common'
import type { Vec4 } from 'lenix'
import { hasCollided } from '../lib'
import { State } from "@lenix/lenix"
import './loading'
import type { Settings } from '../lib/settings'

const PED_COORDS: Vec4 = [84.0127, 628.9093, 207.3891, 174.8069]
const CAM_OFFSET: Vec4 = [2, 2.5, 0.75, -12.5]

let character: Start.CharacterRespose | null
let characters: Character[]
let logout: () => void = () => { }

export const state = new State({
	loadingShutdown: false as boolean,
	settings: null as Settings | null,
})

onNui<Start.Requests['selectMode']>('start:selectMode', async ({ mode, character: selectedChar }) => {
	character = selectedChar

	switch (mode) {
		case 'warzone': {
			logout = warzone()
			break
		}
		case 'police': {
			const modules = [police(), common('police')]
			logout = () => modules.forEach(mod => mod())
			break
		}
		case 'gang': {
			const modules = [gang(), common('gang')]
			logout = () => modules.forEach(mod => mod())
			break
		}
		default:
			throw `Unexcepected mode: ${mode}`
	}

	return null
})

onNui<Start.Requests['logout']>('start:logout', () => {
	logout()
	return null
})

globalThis.exports('charselect', async (chars: Character[]): Promise<Start.CharacterRespose> => {
	let keepBlack = true;

	const blackScreen = repeat(() => {
		if (!keepBlack) return true;

		DoScreenFadeOut(0);
		return false;
	}, true)

	SetEntityCoords(player.entity(), PED_COORDS[0], PED_COORDS[1], PED_COORDS[2], false, false, false, false)
	SetEntityHeading(player.entity(), PED_COORDS[3])
	SetEntityVisible(player.entity(), false, false)
	const ped = await createPed('mp_m_freemode_01', ...PED_COORDS)

	await repeat(() => hasCollided([PED_COORDS[0], PED_COORDS[1], PED_COORDS[2]], ped.handle), 1, 1000)

	const [dispose, camHandle] = cam.create({
		coords: PED_COORDS,
		offset: CAM_OFFSET,
		rotation: [-2.5, 0],
		details: {
			fov: 40,
			rotationOrder: 0,
			fadeIn: 0,
			fadeOut: 0,
			delay: 0,
		},
	})

	await repeat(() => IsCamRendering(camHandle) as unknown as number, 1, 1000);

	await repeat(() => isNuiReady(), true, 500)

	keepBlack = false;
	await blackScreen;
	DoScreenFadeIn(500);

	character = null
	characters = chars

	await repeat(() => state.loadingShutdown, true)
	asserts(state.settings)
	emitNui<Start.Events['modeSelection']>('start:modeSelection', characters, state.settings)

	const selected = await repeat(
		() => character,
		character => character !== null,
		500,
	)

	dispose()
	DeletePed(ped.handle)
	SetEntityVisible(player.entity(), true, false)

	return selected
})
