import { notify } from "@overextended/ox_lib/client"
import type { Vec4 } from "lenix"
import { control, emitNui, entity, onNetEvent, onNui, player } from "lenix/client"
import type { Competitive } from "types/index"
import { createPreRoundStagingArea } from "./rank.game"

let open: boolean = false
let invitersWhileUnFocused: Competitive.GamerProfile[] = []

const getInvited = (inviter: Competitive.GamerProfile) =>
	emitNui<Competitive.Events['playerInvited']>('competitive:playerInvited', inviter)


onNui('competitive:unFocus', () => {
	open = false
	return null
})

export default [
	control.on({
		event: 'press',
		key: 'M',
		onEvent: () => {
			emitNui<Competitive.Events['open']>('competitive:open')
			open = true
			setTimeout(() => {
				invitersWhileUnFocused.forEach(getInvited)
				invitersWhileUnFocused = []
			}, 1000)
		},
	}),

	onNetEvent('lenix:server:competitive:getInvited', async (inviter: Competitive.GamerProfile) => {
		if (open) {
			getInvited(inviter)
			return
		}
		notify({ title: 'You have received a new invite' })
		invitersWhileUnFocused.push(inviter)
	}),
	
	onNetEvent('lenix:server:competitive:updateParty', (party: Competitive.Party) => {
		emitNui<Competitive.Events['updateParty']>('competitive:updateParty', party)
	}),
	
	onNetEvent('lenix:server:competitive:updateStage', (stage: Competitive.Stage) =>
		emitNui<Competitive.Events['updateStage']>('competitive:updateStage', stage)
	),

	onNetEvent('lenix:server:competitive:newRound', async (
		mode: Competitive.Match['mode'],
		round: Competitive.CasualMatch,
		coords: Vec4,
		walls: Vec4[]
	) => {
		await createPreRoundStagingArea(walls, mode)
	
		const ped = player.entity()
		const weaponHash = GetHashKey('WEAPON_PISTOL')
	
		entity.teleport(...coords)
	
		GiveWeaponToPed(ped, weaponHash, 9999, false, true)
		SetCurrentPedWeapon(ped, weaponHash, true)
		SetPedInfiniteAmmo(ped, true, weaponHash)
		SetEntityHealth(ped, GetEntityMaxHealth(ped))
	
		emitNui<Competitive.Events['newRound']>('competitive:newRound', mode, round)
	}),
	
	onNetEvent('lenix:server:competitive:updateRound', (teams: Competitive.CasualMatch) => {
		emitNui<Competitive.Events['updateRound']>('competitive:updateRound', teams)
	})
]