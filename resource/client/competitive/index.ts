import { createObject, notify, onServerCallback } from '@overextended/ox_lib/client'
import { Config } from 'common/config/competitive'
import { repeat, type Vec3, type Vec4 } from 'lenix'
import { client, control, emitNui as emitEvent, emitNui, onNui } from 'lenix/client'
import type { Competitive } from 'types/index'

let open: boolean = false
let inviterWhileUnFocused: Competitive.GamerProfile[] = []


const getInvited = (inviter: Competitive.GamerProfile) =>
	emitEvent<Competitive.Events['playerInvited']>('competitive:playerInvited', inviter)


control.on({
	event: 'press',
	key: 'K',
	onEvent: () => {
		emitEvent<Competitive.Events['open']>('competitive:open')
		open = true
		setTimeout(() => {
			inviterWhileUnFocused.forEach(getInvited)
			inviterWhileUnFocused = []
		}, 1000)
	},
})

onNui('competitive:unFocus', () => {
	open = false
	return null
})

onNet('lenix:server:competitive:getInvited', async (inviter: Competitive.GamerProfile) => {
	if (open) {
		getInvited(inviter)
		return
	}
	notify({ title: 'You have received a new invite' })
	inviterWhileUnFocused.push(inviter)
})

onNet('lenix:server:competitive:updateParty', (party: Competitive.Party) => {
	emitEvent<Competitive.Events['updateParty']>('competitive:updateParty', party)
})

onServerCallback('lenix:server:competitive:getPrepared', async (coords: Vec3): Promise<Competitive.APIs['prepareForMatch']> => {
	const ped = client.player.entity()

	SetFocusPosAndVel(...coords, 0, 0, 0)
	client.player.teleport(...coords)

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


const createPreRoundStagingArea = async (walls: Vec4[], mode: Competitive.Match['mode']) => {
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

onNet('lenix:server:competitive:newRound', async (
	mode: Competitive.Match['mode'],
	round: Competitive.CasualMatch,
	coords: Vec4,
	walls: Vec4[]
) => {
	await createPreRoundStagingArea(walls, mode)

	const ped = client.player.entity()
	const weaponHash = GetHashKey('WEAPON_PISTOL')

	client.player.teleport(...coords)

	GiveWeaponToPed(ped, weaponHash, 9999, false, true)
	SetCurrentPedWeapon(ped, weaponHash, true)
	SetPedInfiniteAmmo(ped, true, weaponHash)
	SetEntityHealth(ped, GetEntityMaxHealth(ped))

	emitNui<Competitive.Events['newRound']>('competitive:newRound', mode, round)
})

onNet('lenix:server:competitive:updateRound', (teams: Competitive.CasualMatch) => {
	emitNui<Competitive.Events['updateRound']>('competitive:updateRound', teams)
})

onNet('lenix:server:competitive:updateStage', (stage: Competitive.Stage) =>
	emitNui<Competitive.Events['updateStage']>('competitive:updateStage', stage)
)
