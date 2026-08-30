import { State } from '@lenix/lenix'
import { cache, checkDependency } from '@overextended/ox_lib'
import { notify, createVehicle, registerContext, showContext, createPed } from '@overextended/ox_lib/client'
import type { Vec4 } from 'lenix'
import { api, useTimer } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_target', '1.18.1', true)

const deleteAfter = 15 * 60_000
const warnAt = deleteAfter * 0.1
const state = new State({ lastVehicle: null as number | null })

const variants = {
	std: ['cypher'],
} as const satisfies Record<string, string[]>

const locations: {
	ped: Vec4
	vehicle: Vec4
	menu: keyof typeof variants
}[] = [
	{
		ped: [-252.2817, -297.2987, 21.6264, 69.0925],
		vehicle: [-256.1688, -333.2883, 29.1064, 9.207],
		menu: 'std',
	},
	{
		ped: [-295.1785, -622.0973, 32.7741, 175.3196],
		vehicle: [-301.8, -626.566, 32.1928, 271.8865],
		menu: 'std',
	},
	{
		ped: [1851.5194, 2583.6697, 45.6639, 357.8237],
		vehicle: [1855.4651, 2578.8855, 45.4116, 271.0542],
		menu: 'std',
	},
	{
		ped: [-292.8378, -985.7634, 31.0969, 41.8034],
		vehicle: [-301.6614, -990.4818, 31.0812, 343.2394],
		menu: 'std',
	},
	{
		ped: [418.6655, -991.6953, 21.3117, 90.1289],
		vehicle: [429.1385, -986.8941, 21.3117, 91.0006],
		menu: 'std',
	},
] as const

const despawnLastVehicle = () => {
	if (!state.lastVehicle) return 

	DeleteEntity(state.lastVehicle)
	state.lastVehicle = null

	notify({
		title: 'Your vehicle have been removed.',
		type: 'success',
	})
}

const handleDeletionSchedule = (vehicleHandle: number) => {
	const clearTimer = useTimer({
		duration: deleteAfter,
		updateInterval: warnAt,
		onTick: timeLeft => {
			if (vehicleHandle !== state.lastVehicle) {
				clearTimer()
				return
			}

			const occupied = GetVehicleNumberOfPassengers(vehicleHandle) > 0 || !IsVehicleSeatFree(vehicleHandle, -1)
			if (occupied) {
				handleDeletionSchedule(vehicleHandle)
				clearTimer()
				return
			}

			if (timeLeft <= warnAt) {
				notify({
					title: `Your unattended vehicle will be removed in ${Math.ceil(warnAt / 1000)} seconds.`,
					type: 'warning',
				})
				return
			}
		},
		onEnd: () => {
			if (vehicleHandle !== state.lastVehicle) return

			despawnLastVehicle()
			clearTimer()
		}
	})
}

const spawnVehicle = async (model: typeof variants[keyof typeof variants][number], spawn: Vec4) => {
	despawnLastVehicle()

	const vehicle = await createVehicle(model, ...spawn)
	TaskWarpPedIntoVehicle(cache.ped, vehicle.handle, -1)

	state.lastVehicle = vehicle.handle

	handleDeletionSchedule(vehicle.handle)
}

setImmediate(() => {
	for (const { vehicle, menu } of locations) {
		registerContext({
			id: 'rent_menu',
			title: 'Car List',
			options: [
				...variants[menu].map(model => ({
					title: model,
					onSelect: () => spawnVehicle(model, vehicle),
				})),
			],
		})
	}
})

const load = async () => {
	const disposes = await Promise.all(locations.map(async ({ ped, vehicle }, i) => {
		const name = [`rental_menu_${i}`, `rental_return_${i}`]
		const entity = await createPed('a_m_m_prolhost_01', ...ped)

		api.ox_target?.addLocalEntity?.(entity.handle, [
			{
				name: name[0],
				icon: 'fas fa-bars',
				label: 'Vehicles',
				onSelect: async () => {
					const occupied = IsPositionOccupied(vehicle[0], vehicle[1], vehicle[2], 3.0, false, true, true, false, false, 0, false,)
	
					if (occupied) {
						notify({
							title: 'Spawn point is occupied.',
						})
						return
					}
					showContext('rent_menu')
				},
			},
			{
				name: name[1],
				icon: 'fas fa-trash-arrow-up',
				label: 'Return Vehicle',
				onSelect: async () => {
					
				},
			},
		])

		return () => api.ox_target?.removeLocalEntity?.(entity.handle, [...name])
	}))

	return () => {
		for (const dispose of disposes) dispose()
	}
}

export default [
	load()
]
