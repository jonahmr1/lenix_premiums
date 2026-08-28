import { repeat } from '@lenix/lenix'
import { createObject, onServerCallback } from '@overextended/ox_lib/client'
import { Config } from 'common/config/outlaw'
import { type Vec3, type Vec4 } from 'lenix'
import { entity, player } from 'lenix/client'
import type { Competitive } from 'types/index'


onServerCallback('lenix:server:competitive:getPrepared', async (coords: Vec3): Promise<Competitive.APIs['prepareForMatch']> => {
	const ped = player.entity()

	SetFocusPosAndVel(...coords, 0, 0, 0)
	entity.teleport(...coords)

	try {
		return await repeat(() => {
			RequestCollisionAtCoord(...coords)

			if (
				!IsEntityWaitingForWorldCollision(ped) &&
				HasCollisionLoadedAroundEntity(ped)
			) {
				return true
			}

			return false
		}, true, 500)
	} finally {
		ClearFocus()
	}
})


export const createPreRoundStagingArea = async (walls: Vec4[], mode: Competitive.Match['mode']) => {
	const WALL_HEIGHT = 3.0
	const levels = 2

	for (const coords of walls) {
		for (let level = 0; level < levels; level++) {
			const [x, y, z, h] = coords

			const obj = await createObject(
				'prop_ld_dstsign_01',
				x,
				y,
				z + level * WALL_HEIGHT,
				h,
			)

			SetEntityVisible(obj.handle, Config.wall_debug, false)
			SetEntityCollision(obj.handle, true, true)

			setTimeout(() => {
				DeleteEntity(obj.handle)
			}, Config.game_modes[mode].pre_and_post_round_time * 1000)
		}
	}
}