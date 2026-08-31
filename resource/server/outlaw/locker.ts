import { Constants } from "common/config/outlaw"
import { api } from "lenix/server"

setImmediate(() => {
	api.ox_inventory?.RegisterStash?.(
		Constants.locker.name,
		'Personal Locker',
		50,
		100_0000,
		true,
		{
			police: 1,
		},
		Constants.locker.coords
	)
})