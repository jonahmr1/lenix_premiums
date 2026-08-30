import { cache, checkDependency } from '@overextended/ox_lib'
import { notify, createVehicle, registerContext, showContext, createPed } from '@overextended/ox_lib/client'
import type { Vec4 } from 'lenix'
import { api } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_target', '1.18.1', true)

let lastVehicle: number
let vehicleInterval: ReturnType<typeof setInterval>

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

const spawnVehicle = async (model: typeof variants[keyof typeof variants][number], spawn: Vec4) => {
	if (lastVehicle && DoesEntityExist(lastVehicle)) {
		DeleteEntity(lastVehicle)
	}

	const vehicle = await createVehicle(model, ...spawn)
	TaskWarpPedIntoVehicle(cache.ped, vehicle.handle, -1)
	lastVehicle = vehicle.handle

	clearInterval(vehicleInterval)

	const deleteAfter = 15 * 60 * 1000
	const warnAt = deleteAfter * 0.1
	const pollInterval = Math.min(5000, Math.max(500, warnAt / 4))
	let emptySince = GetGameTimer()
	let warned = false

	vehicleInterval = setInterval(() => {
		if (!DoesEntityExist(vehicle.handle)) {
			clearInterval(vehicleInterval)
			return
		}

		const occupied = GetVehicleNumberOfPassengers(vehicle.handle) > 0 || !IsVehicleSeatFree(vehicle.handle, -1)
		if (occupied) {
			emptySince = GetGameTimer()
			warned = false
			return
		}

		const remaining = deleteAfter - (GetGameTimer() - emptySince)

		if (remaining <= warnAt && !warned) {
			warned = true
			notify({
				title: `Your unattended vehicle will be removed in ${Math.ceil(warnAt / 1000)} seconds.`,
				type: 'warning',
			})
		}

		if (remaining <= 0) {
			DeleteEntity(vehicle.handle)
			clearInterval(vehicleInterval)
		}
	}, pollInterval)
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
	const disposes = await Promise.all(locations.map(async ({ ped, vehicle, menu }, i) => {
		const name = `rental_${i}`
		const entity = await createPed('a_m_m_prolhost_01', ...ped)

		api.ox_target?.addLocalEntity?.(entity.handle, {
			name,
			icon: 'fas fa-car',
			label: 'Take a car',
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
		})

		return () => api.ox_target?.removeLocalEntity?.(entity.handle, name)
	}))

	return () => {
		for (const dispose of disposes) dispose()
	}
}

export default [
	load()
]
