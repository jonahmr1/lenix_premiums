import { repeat, State } from '@lenix/lenix'
import { cache, checkDependency } from '@overextended/ox_lib'
import { emitNui, isNuiReady, onEvent, pool } from 'lenix/client'
import { api } from 'lenix/client'
import type { Outlaw } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_inventory', '2.47.9', true)
checkDependency('ox_core', '1.5.14', true)

type OxWeapon = {
	ammo: string
	label: string
	name: string
	metadata: { ammo: number }
} | undefined

const nativeImage = (name: string) => `https://docs-backend.fivem.net/weapons/${name}.png`

const state = new State<Outlaw.Hud & {
	display: {
		vitals: boolean,
		weaponary: boolean
	}
}>({
	display: {
		vitals: false,
		weaponary: false
	},
	health: 0,
	armor: 0,
	weapon: {
		image: nativeImage('WEAPON_UNARMED'),
		name: 'Unknown',
		clipAmmo: 0,
		clipSize: 0,
		reserveAmmo: 0,
	},
	lungs: 0
})

const updateDisplay = (newState: typeof state.display) => {
	emitNui<Outlaw.Events['displayHud']>('hud:display', newState)
}

const updateValues = (values: Omit<typeof state, 'display'>) => {
	emitNui<Outlaw.Events['updateHud']>('hud:update', values)

	state.armor = values.armor
	state.health = values.health
	state.weapon = values.weapon
}

const updateThisFrame = () => {
	const weaponHash = GetSelectedPedWeapon(cache.ped)
	const hasWeapon = GetMaxAmmo(cache.ped, weaponHash)[1] > 0

	if (hasWeapon === state.display.weaponary) {
		updateDisplay({ ...state.display, weaponary: hasWeapon })
		updateValues({
			...state,
			weapon: {
				...state.weapon,
				clipSize: GetWeaponClipSize(weaponHash),
			}
		})
		state.display.weaponary = !hasWeapon
	}

	if (IsPedShooting(cache.ped)) {
		updateValues({
			...state,
			weapon: {
				...state.weapon,
				clipAmmo: GetAmmoInClip(cache.ped, weaponHash)[1],
			}
		})
	}
}

const load = () => {
	setTimeout(async () => {
		await repeat(isNuiReady)
		updateDisplay({ vitals: true, weaponary: true })
	})

	return () => updateDisplay({ vitals: false, weaponary: false })
}

export default [
	onEvent('ox_inventory:currentWeapon', (weapon: OxWeapon) => {
		if (!weapon) return
	
		const reserveAmmo = api.ox_inventory?.GetItemCount?.<number, [unknown]>(weapon.ammo) ?? 0
		updateValues({
			...state,
			weapon: {
				...state.weapon,
				reserveAmmo,
				name: weapon.label,
				image: nativeImage(weapon.name)
			}
		})
	}),

	onEvent('ox_inventory:itemCount', (itemName: string, reserveAmmo: number) => {
		const weapon = api.ox_inventory?.getCurrentWeapon<OxWeapon>?.()
		if (!weapon || weapon.ammo !== itemName) return
	
		updateValues({ ...state, weapon: { ...state.weapon, reserveAmmo } })
	}),

	onEvent('entityDamaged', (victim: number) => {
		if (victim !== cache.ped) return

		const health = GetEntityHealth(cache.ped) / 2
		const armor = GetPedArmour(cache.ped)

		updateValues({ ...state, health, armor })
	}),
	
	load(),

	pool(updateThisFrame)
]
