import { asserts, entries, random } from '@lenix/lenix'
import {
	createPed as oxCreatePed,
	notify,
	requestAnimDict,
	requestModel,
	triggerServerCallback,
	checkDependency,
	progressBar,
} from '@overextended/ox_lib/client'
import type { Vec3, Vec4 } from 'lenix'
import { api, blip, entity } from 'lenix/client'
import type { Outlaw } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)

const config = {
	taskCoords: [
		[522.43, 198.49, 107.31],
		[584.08, 138.19, 98.47],
		[971.46, -95.89, 74.31],
		[1192.5, -1249.22, 39.32],
		[814.02, -491.28, 30.52],
		[1221.41, 333.76, 82.11],
		[-1363.22, 362.93, 63.76],
		[-1792.98, 158.06, 66.58],
		[-1286.53, 4497.34, 14.74],
		[-1632.98, 4735.9, 52.31],
		[10.38, 3736.92, 39.52],
		[-164.93, 6139.83, 31.21],
		[-86.79, 6368.98, 32.38],
		[-105.77, 6528.71, 29.17],
		[1700.97, 4868.5, 41.85],
		[2016.15, 4986.96, 41.1],
	],
	peds: [
		{
			model: 'g_m_importexport_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-2213.64, -371.48, 13.32, 39.33],
		},
		{
			model: 'g_m_m_armboss_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [1075.89, -2358.9, 30.28, 261.78],
		},
		{
			model: 'g_m_y_ballaeast_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [545.97, -2690.91, 6.22, 3.52],
		},
		{
			model: 'g_m_y_ballaorig_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [1459.76, 1043.43, 112.33, 272.81],
		},
		{
			model: 'g_m_y_ballasout_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-1844.91, 223.29, 84.44, 308.06],
		},
		{
			model: 'g_m_y_lost_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [793.74, 537.9, 126.11, 142.59],
		},
		{
			model: 'g_m_y_mexgoon_03',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [1661.04, -26.0, 17377, 116.52],
		},
		{
			model: 'g_m_y_salvaboss_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-957.23, -1566.86, 5.02, 106.8],
		},
		{
			model: 'g_m_y_mexgoon_02',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [164.83, 2226.22, 90.87, 51.62],
		},
		{
			model: 'g_m_y_armgoon_02',
			scenario: 'WORLD_HUMAN_STAND_FISHING',
			coords: [713.28, 4092.59, 35.73, 179.51],
		},
		{
			model: 'g_m_y_korean_02',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-2165.67, 5196.09, 16.88, 58.42],
		},
		{
			model: 'g_m_m_chicold_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [445.96, 6463.31, 28.78, 54.34],
		},
	],
} as const

let isPlayerFree = true
let waypoint: number, prop: number | null

const setPlayerStatus = (state: boolean) => (isPlayerFree = state)

const randomInteractCoords = (): Vec3 => {
	const index = random(1, config.taskCoords.length)
	const coords = config.taskCoords[index]
	asserts(coords)
	return [...coords]
}

const createWayPoint = () => {
	const coords = randomInteractCoords()

	waypoint = blip.create({
		coords,
		icon: 543,
	})
	SetBlipColour(waypoint, 1)
	SetBlipScale(waypoint, 0.9)
	BeginTextCommandSetBlipName('STRING')
	AddTextComponentString('Anonymous')
	EndTextCommandSetBlipName(waypoint)

	SetBlipRoute(waypoint, true)
	SetBlipRouteColour(waypoint, 1)
	return coords
}

const createPackage = async (coords: Vec3) => {
	const model = 'prop_cs_package_01'
	await requestModel(model)

	prop = CreateObject(GetHashKey(model), coords[0], coords[1], coords[2], true, true, false)
	SetEntityHeading(prop, 0.0)
	PlaceObjectOnGroundProperly(prop)
	SetEntityAsMissionEntity(prop, true, true)

	api.ox_target?.addLocalEntity?.(prop, [
		{
			name: prop,
			icon: 'fa-solid fa-box',
			label: 'Open the box',
			distance: 1.5,
			onSelect: takeThePackage,
		},
	])
	return prop
}

const takeTask = async () => {
	isPlayerFree = false
	const coords = createWayPoint()
	prop = await createPackage(coords)
	notify({
		title: 'Success',
		description: 'I have setted a waypoint for you in the map',
		type: 'success',
	})
}

const abortTask = () => {
	isPlayerFree = true
	if (waypoint) RemoveBlip(waypoint)
	notify({
		title: 'Error',
		description: 'Task Aborted',
		type: 'error',
	})
	if (prop) {
		DeleteEntity(prop)
		api.ox_target?.removeLocalEntity?.(prop, prop)
	}
	prop = null
}

const takeThePackage = async () => {
	const playerPed = PlayerPedId()
	const dict = 'pickup_object'

	await requestAnimDict(dict)

	entity.playAnim(playerPed, dict, 'pickup_low', 1.5, 1.5, 1000, 49, 0, false, false, false)

	if (await progressBar({
		duration: 1000,
		label: 'Picking up package...',
		useWhileDead: false,
		canCancel: true,
		disable: {
			move: true,
			car: true,
			combat: true,
		},
	})) {
		entity.stopAnim(playerPed, dict)
		const re = await triggerServerCallback<Outlaw.Criminial>('lenix_criminiltasks:server:receiveItem', null)
		asserts(re)
		const { success, response, item, error } = re

		if (!success || !success) {
			notify({
				title: 'Error',
				description: `Something went wrong, Could not give item: ${(response && error) || 'Unknown'}`,
				type: 'error',
			})
			return
		}

		asserts(success == true, `Failed to give ${item}, the reason: ${response}`)
		asserts(prop)

		DeleteEntity(prop)
		notify({
			title: 'Delivery',
			description: 'You picked up the package!',
			type: 'success',
		})
		isPlayerFree = true
		blip.destroy(waypoint)
	} else {
		entity.stopAnim(playerPed, dict)
		notify({
			title: 'Canceled',
			description: 'You canceled picking up the package.',
			type: 'error',
		})
	}
}

const createPed = async (pedModel: string, pedCoords: Vec4, pedScenario: unknown) => {
	await requestModel(pedModel)

	const entity = oxCreatePed(pedModel, pedCoords[0], pedCoords[1], pedCoords[2] - 0.85, pedCoords[3])
	// behavior = {
	//   freeze = true,
	//   oblivious = true
	// },
	// scenario = {
	//   name = pedScenario,
	//   timeToLeave = 0,
	//   playIntroClip = true
	// }

	return entity
}

const crash = () => {
	if (isPlayerFree) return

	abortTask()
	setPlayerStatus(false)
}

const load = async () => {
	const disposes = await Promise.all([...config.peds].map(async (ped, i) => {
		const takeName = `take_task_${i}`
		const abortName = `abort_task_${i}`

		const entity = await createPed(ped.model, [...ped.coords], ped.scenario)

		api.ox_target?.addLocalEntity?.(entity.handle, [
			{
				label: 'Take a task',
				name: takeName,
				icon: 'fa-solid fa-circle',
				onSelect: takeTask,
				canInteract: () => isPlayerFree,
				distance: 1.0,
			},
			{
				label: 'Abort the task',
				name: abortName,
				icon: 'fa-solid fa-xmark',
				onSelect: abortTask,
				canInteract: () => !isPlayerFree,
				distance: 1.0,
			},
		])

		return () => api.ox_target?.removeLocalEntity?.(entity.handle, [takeName, abortName])
	}))

	return () => {
		for (const dispose of disposes) dispose()
		crash()
	}
}

on('onResourceStop', (resourceName: string) => {
	if (resourceName !== GetCurrentResourceName()) return

	crash()
})

export default [
	load(),
	crash,
]
