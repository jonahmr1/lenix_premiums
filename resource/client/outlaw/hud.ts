import { State } from '@lenix/lenix'
import { cache, checkDependency } from '@overextended/ox_lib'
import { emitNui, onEvent, pool } from 'lenix/client'
import { api } from 'lenix/client'
import type { Outlaw } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_inventory', '2.47.9', true)
checkDependency('ox_core', '1.5.14', true)

type OxWeapon = {
	ammo: string
	metadata: { ammo: number }
} | undefined

const state = new State({
	turnedOff: false as boolean,
	clip: 0,
	reserve: 0
})

const setHudState = () => {
	const weapon = GetSelectedPedWeapon(cache.ped)
	const hasWeapon = GetMaxAmmo(cache.ped, weapon)[1] > 0

	if (hasWeapon === state.turnedOff) {
		emitNui<Outlaw.Events['displayHud']>('hud:display', hasWeapon)
		state.turnedOff = !hasWeapon
	}

	if (!IsPedShooting(cache.ped)) return

	emitNui<Outlaw.Events['updateHud']>('hud:update', {
		reserve: state.reserve,
		clip: GetAmmoInClip(cache.ped, weapon)[1]
	})
}

const updateReserve = (reserve: number) => {
	emitNui<Outlaw.Events['updateHud']>('hud:update', { clip: state.clip, reserve })
}

export default [
	onEvent('ox_inventory:currentWeapon', (weapon: OxWeapon) => {
		if (!weapon) return
	
		const reserve = api.ox_inventory?.GetItemCount?.<number, [unknown]>(weapon.ammo) ?? 0
		updateReserve(reserve)
	}),
	
	onEvent('ox_inventory:itemCount', (itemName: string, totalCount: number) => {
		const weapon = api.ox_inventory?.getCurrentWeapon<OxWeapon>?.()
		if (!weapon || weapon.ammo !== itemName) return
	
		updateReserve(totalCount)
	}),
	
	pool(setHudState)
]
