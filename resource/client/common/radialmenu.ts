import { addRadialItem, checkDependency, notify, onCache, removeRadialItem } from '@overextended/ox_lib/client'
import { onNetEvent } from 'lenix/client'
import type { Start } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('illenium-appearance', '5.7.0', true)
checkDependency('ox_core', '1.5.14', true)

const radiaItems: Parameters<typeof addRadialItem>[0] = [
	{
		id: 'escort',
		label: 'Escort',
		icon: 'user-group',
		onSelect: () => emit('lenix:client:interaction:escort'),
	},
	{
		id: 'put-in-vehicle',
		label: 'Put in vehicle',
		icon: 'arrow-right-to-bracket',
		onSelect: () => emit('lenix:client:interaction:putInVehicle'),
	},
	{
		id: 'take-out-vehicle',
		label: 'Take out of vehicle',
		icon: 'arrow-right-from-bracket',
		onSelect: () => emit('lenix:client:interaction:takeOutVehicle'),
	},
	{
		id: 'reload',
		label: 'Reload',
		icon: 'shirt',
		onSelect: () => emit('illenium-appearance:client:reloadSkin'),
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: 'gear',
		onSelect: () => emit('lenix:client:settings:open'),
	},
	{
		id: 'weather',
		label: 'Weather & Time',
		icon: 'cloud-moon',
		onSelect: () => notify({ title: 'Not available yet!' }) /* emit('lenix:client:weather:open') */,
	},
	{
		id: 'emote',
		label: 'Emotes',
		icon: 'person-walking',
		onSelect: () => notify({ title: 'Not available yet!' }),
	},
]


onCache('vehicle', vehicle => {
	if (vehicle) {
		addRadialItem({
			id: 'vehicle-menu',
			label: 'Vehicle',
			icon: 'car',
			onSelect: () => notify({ title: 'Not available yet!' }),
		})
		return
	}
	removeRadialItem('vehicle-menu')
})

const load = (mode: Start.Mode) => {
	switch (mode) {
		case 'police': {
			addRadialItem({
				id: 'plist',
				label: 'Roster',
				icon: 'list-ul',
				onSelect: () => emit('lenix:server:roster:toggleDisplay'),
			})

			return () => removeRadialItem('plist')
		}
		default: console.log(`Skipping police radial item on ${mode} mode, remove this debugging log`)
	}
}

export default (mode: Start.Mode) => [
	addRadialItem(radiaItems),

	() => radiaItems.forEach(radiaItem => removeRadialItem(radiaItem.id)),

	load(mode),
]