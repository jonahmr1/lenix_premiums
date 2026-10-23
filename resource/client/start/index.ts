import type { Character } from '@overextended/ox_core'
import { createPed } from '@overextended/ox_lib/client'
import { repeat } from '@lenix/lenix'
import { cam, emitNui, isNuiReady, onNui, player } from 'lenix/client'
import type { Start } from 'types/index'
import police from '../police'
import warzone from '../warzone'
import gang from '../gang'
import common from '../common'
import type { Vec4 } from 'lenix'
import { hasCollided } from '../lib'

const PED_COORDS: Vec4 = [84.0127, 628.9093, 207.3891, 174.8069]
const CAM_OFFSET: Vec4 = [2, 2.5, 1, -12.5]

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
	character = null
	characters = chars

	await repeat(() => isNuiReady(), true, 500)
	emitNui<Start.Events['modeSelection']>('start:modeSelection', characters)

	DoScreenFadeIn(0)
	SetEntityCoords(player.entity(), PED_COORDS[0], PED_COORDS[1], PED_COORDS[2], false, false, false, false)
	SetEntityHeading(player.entity(), PED_COORDS[3])
	SetEntityVisible(player.entity(), false, false)
	const ped = await createPed('mp_m_freemode_01', ...PED_COORDS)

	await repeat(() => hasCollided([PED_COORDS[0], PED_COORDS[1], PED_COORDS[2]],  ped.handle), 1, 1000)

	const [dispose, camHandle] = cam.create({
		coords: PED_COORDS,
		offset: CAM_OFFSET,
		rotation: [-7.5, 0],
		details: {
			fov: 40,
			rotationOrder: 0,
			fadeIn: 0,
			fadeOut: 0,
			delay: 0,
		},
	})

	await repeat(() => IsCamRendering(camHandle), true, 50);
	ShutdownLoadingScreen()

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