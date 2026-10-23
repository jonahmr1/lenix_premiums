import { control, emitNui, pool } from "lenix/client"
import type { Start } from "types/index"

control.on({
	event: 'press',
	key: 'ESCAPE',
	onEvent: () => {
		emitNui<Start.Events['pause']>('start:pause')
	},
})

// pool(DisableFrontendThisFrame)
