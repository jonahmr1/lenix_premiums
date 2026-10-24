import { addRadialItem, checkDependency, notify, onCache, removeRadialItem } from '@overextended/ox_lib/client'
import type { Start } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)
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
		id: 'settings',
		label: 'Settings',
		icon: 'gear',
		onSelect: () => emit('lenix:client:settings:open'),
	},
	{
		id: 'weather',
		label: 'Weather & Time',
		icon: 'cloud-moon',
		onSelect: () => emit('lenix:client:weather:open'),
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
	addRadialItem(radiaItems)

	switch (mode) {
		case 'police': {
			addRadialItem({
				id: 'plist',
				label: 'Roster',
				icon: 'list-ul',
				onSelect: () => emit('lenix:client:roster:toggleDisplay'),
			})

			return () => removeRadialItem('plist')
		}
	}

	return () => radiaItems.forEach(radiaItem => removeRadialItem(radiaItem.id))
}

export default (mode: Start.Mode) => [load(mode)]
