import { control, emitNui } from "lenix/client"
import type { Outlaw } from "types/index"

export default [
	control.on({
		event: 'press',
		key: 'K',
		onEvent: () => emitNui<Outlaw.Events['displayIpad']>('ipad:display')
	})
]