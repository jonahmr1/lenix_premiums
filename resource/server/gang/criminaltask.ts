import { asserts, entries, random } from '@lenix/lenix'
import { checkDependency, onClientCallback } from '@overextended/ox_lib/server'
import { api } from 'lenix/server'
import type { Gang } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_inventory', '2.47.9', true)

const items = {
	['money']: {
		percentage: 100,
		amount: 1000,
	},
}

onClientCallback('lenix_criminiltasks:server:receiveItem', (source): Gang.Criminial => {
	const roll = random(1, 100)
	let cumulative = 0
	let selectedItem, selectedAmount

	for (const [itemName, data] of entries(items)) {
		cumulative = cumulative + data.percentage
		if (roll <= cumulative) {
			selectedItem = itemName
			selectedAmount = data.amount ?? 1
			break
		}
	}

	if (!selectedItem)
		return {
			success: false,
			error: 'No item rolled (percentages misconfigured)',
		}

	const re = api.ox_inventory?.AddItem?.<[boolean, string], [...unknown[]]>(source, selectedItem, selectedAmount)
	asserts(re)
	const [success, response] = re

	return {
		item: selectedItem,
		amount: selectedAmount,
		success,
		response,
	}
})
