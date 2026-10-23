import { api } from 'lenix/server'

setImmediate(() => {
	api.ox_inventory?.RegisterShop?.('Police', {
		name: 'Police Arsenal',
		groups: {
			police: 1,
		},
		inventory: [{ name: 'weapon_pistol', price: 0, grade: 1 }],
		locations: [[0, 0, 0]],
	})
})
