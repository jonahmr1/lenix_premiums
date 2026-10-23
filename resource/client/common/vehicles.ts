import { asserts, random, State } from '@lenix/lenix'
import { cache, checkDependency, sleep } from '@overextended/ox_lib'
import { notify, createVehicle, registerContext, showContext, createPed } from '@overextended/ox_lib/client'
import type { Vec3, Vec4 } from 'lenix'
import { api, cam, control, timer } from 'lenix/client'
import type { AtLeastOne } from 'types/index'
import { behavior, VEHICLES } from '../lib'
import { GetPlayer } from '@overextended/ox_core/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_target', '1.18.1', true)

interface Membership {
	charIds: number[]
	groups: {
		name: string
		grade?: number
	}[]
}

type Model = {
	[Category in keyof typeof VEHICLES]: keyof (typeof VEHICLES)[Category]
}[keyof typeof VEHICLES]

const deleteAfter = 15 * 60_000
const warnAt = deleteAfter * 0.1
const sets = 10
const interval = 200

const state = new State({ lastVehicle: null as number | null })

const variants: Record<
	string,
	{
		model: Model
		allowed?: AtLeastOne<Membership>
		disallowed?: AtLeastOne<Membership>
		color?: [number, number, number]
		plate?: string
		image?: string
	}[]
> = {
	std: [
		{
			model: 'cypher',
			allowed: {
				charIds: [1],
				groups: [
					{
						name: 'police',
						grade: 2,
					},
				],
			},
			disallowed: {
				charIds: [2],
				groups: [
					{
						name: 'cartel',
						grade: 1,
					},
				],
			},
			plate: `LENIX${random(100, 999)}`,
			color: [0, 255, 206],
		},
	],
}

const locations = [
	{
		ped: [-252.2817, -297.2987, 21.6264, 69.0925],
		vehicle: [-256.1688, -333.2883, 29.1064, 9.207],
		variant: 'std',
	},
	{
		ped: [-295.1785, -622.0973, 32.7741, 175.3196],
		vehicle: [-301.8, -626.566, 32.1928, 271.8865],
		variant: 'std',
	},
	{
		ped: [1851.5194, 2583.6697, 45.6639, 357.8237],
		vehicle: [1855.4651, 2578.8855, 45.4116, 271.0542],
		variant: 'std',
	},
	{
		ped: [-292.8378, -985.7634, 31.0969, 41.8034],
		vehicle: [-301.6614, -990.4818, 31.0812, 343.2394],
		variant: 'std',
	},
	{
		ped: [418.6655, -991.6953, 21.3117, 90.1289],
		vehicle: [429.1385, -986.8941, 21.3117, 91.0006],
		variant: 'std',
	},
] as const satisfies {
	ped: Vec4
	vehicle: Vec4
	variant: keyof typeof variants
}[]

const game = {
	isAreaBusy: (coords: Vec3) => {
		const isOccupied = IsPositionOccupied(...coords, 3.0, false, true, true, false, false, 0, false)
		if (isOccupied)
			notify({
				title: 'Spawn point is occupied.',
				type: 'error',
			})

		return isOccupied
	},

	despawnLastVehicle: () => {
		if (!state.lastVehicle) return

		DeleteEntity(state.lastVehicle)
		state.lastVehicle = null

		notify({
			title: 'Your vehicle have been removed.',
			type: 'success',
		})
	},

	handleDeletionSchedule(vehicleHandle: number) {
		const clearTimer = timer({
			duration: deleteAfter,
			updateInterval: warnAt,
			onInterval: timeLeft => {
				if (vehicleHandle !== state.lastVehicle) {
					clearTimer()
					return
				}

				const occupied = GetVehicleNumberOfPassengers(vehicleHandle) > 0 || !IsVehicleSeatFree(vehicleHandle, -1)
				if (occupied) {
					this.handleDeletionSchedule(vehicleHandle)
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

				this.despawnLastVehicle()
				clearTimer()
			},
		})
	},

	async spawnVehicle(model: Model, spawn: Vec4, plate = 'LENIX', rgb: Vec3 = [255, 255, 255]) {
		if (game.isAreaBusy([spawn[0], spawn[1], spawn[2]])) return

		this.despawnLastVehicle()

		const { handle } = await createVehicle(model, ...spawn, true)

		for (const i of Array(sets).keys()) {
			setTimeout(() => {
				SetEntityAlpha(handle, 51, false)
				setTimeout(() => SetEntityAlpha(handle, 102, false), 100)
			}, i * interval)
		}
		await sleep(sets * interval)
		ResetEntityAlpha(handle)

		plate && SetVehicleNumberPlateText(handle, plate)

		SetVehicleEngineOn(handle, true, false, true)
		// @ts-expect-error double check the args
		TaskEnterVehicle(cache.ped, handle, 1000, -1, 1.0, 0, 0)

		SetVehicleCustomPrimaryColour(handle, ...rgb)
		SetVehicleCustomSecondaryColour(handle, ...rgb)

		state.lastVehicle = handle
		this.handleDeletionSchedule(handle)
	},

	async previewVehicle(model: Model, spawn: Vec4) {
		if (this.isAreaBusy([spawn[0], spawn[1], spawn[2]])) return

		const { handle } = await createVehicle(model, ...spawn, true)

		const [destroy] = cam.create({
			coords: spawn,
			offset: [2.0, 5.0, 1.0, 180.0],
			rotation: [0.0, -10.0],
		})

		const dispose = control.on({
			event: 'press',
			key: 'ESCAPE',
			onEvent: () => {
				DeleteVehicle(handle)
				destroy()
				dispose()
			},
		})
	},
}

const isEligible = (vehicleMenu: (typeof variants)[keyof typeof variants][number]) => {
	const player = GetPlayer()

	let eligible = true

	const allowed = vehicleMenu.allowed
	if (allowed) {
		eligible = false

		if (allowed.charIds) {
			asserts(player.charId)

			if (allowed.charIds.includes(player.charId)) eligible = true
		}

		if (allowed.groups) {
			for (const { name, grade } of allowed.groups) {
				const currentGrade: number | undefined = player.getGroup(name)
				if (currentGrade) {
					if (grade) {
						if (grade <= currentGrade) eligible = true
					} else eligible = true
				}
			}
		}
	}

	const disallowed = vehicleMenu.disallowed
	if (disallowed) {
		if (disallowed.charIds) {
			asserts(player.charId)

			if (disallowed.charIds.includes(player.charId)) eligible = false
		}

		if (disallowed.groups) {
			for (const { name, grade } of disallowed.groups) {
				const currentGrade: number | undefined = player.getGroup(name)
				if (currentGrade) {
					if (grade) {
						if (grade > currentGrade) eligible = false
					} else eligible = false
				}
			}
		}
	}

	return eligible
}

const load = async () => {
	const disposes = await Promise.all(
		locations.map(async ({ ped, vehicle, variant }, i) => {
			const name = [
				`vehicles_${variant}_menu_${i}`,
				`vehicles_${variant}_list_${i}`,
				`vehicles_${variant}_preview_${i}`,
			] as const

			const entity = await createPed('a_m_m_prolhost_01', ...(ped satisfies Vec4 as Vec4))
			behavior(entity.handle, 'WORLD_HUMAN_CLIPBOARD')

			registerContext({
				id: name[0],
				title: 'Vehicles',
				options: [
					{
						title: 'Vehicles Available',
						menu: name[1],
					},
					{
						title: 'Preview Vehicles',
						menu: name[2],
					},
				],
			})
			registerContext({
				menu: name[0],
				id: name[1],
				title: 'Vehicles Available',
				options: [
					...variants[variant]!.map(vehicleMenu => ({
						title: vehicleMenu.model,
						onSelect: () => game.spawnVehicle(vehicleMenu.model, vehicle, vehicleMenu.plate, vehicleMenu.color),
						image: `https://docs-backend.fivem.net/vehicles/${vehicleMenu.model}.webp`,
						disabled: !isEligible(vehicleMenu),
					})),
				],
			})
			registerContext({
				menu: name[0],
				id: name[2],
				title: 'Preview Vehicles',
				options: [
					...variants[variant]!.map(vehicleMenu => ({
						title: vehicleMenu.model,
						onSelect: () => game.previewVehicle(vehicleMenu.model, vehicle),
						image: `https://docs-backend.fivem.net/vehicles/${vehicleMenu.model}.webp`,
					})),
				],
			})

			api.ox_target?.addLocalEntity?.(entity.handle, [
				{
					name: name[0],
					icon: 'fas fa-bars',
					label: 'Vehicles',
					onSelect: async () => {
						if (game.isAreaBusy([vehicle[0], vehicle[1], vehicle[2]])) return

						showContext(name[0])
					},
				},
				{
					name: `vehicles_${variant}_return_${i}`,
					icon: 'fas fa-trash-arrow-up',
					label: 'Return The Vehicle',
					canInteract: () => state.lastVehicle,
					onSelect: async () => {
						game.despawnLastVehicle()
					},
				},
			])

			return () => api.ox_target?.removeLocalEntity?.(entity.handle)
		}),
	)

	return () => {
		for (const dispose of disposes) dispose()
	}
}

export default () => [load()]
