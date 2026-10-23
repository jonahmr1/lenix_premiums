import { State } from '@lenix/lenix'
import { cache } from '@overextended/ox_lib'
import { requestAnimDict } from '@overextended/ox_lib/client'
import { control, entity } from 'lenix/client'

const state = new State({ handsUp: false as boolean })

const animDict = 'missminuteman_1ig_2'

export default () => [
	control.on({
		event: 'press',
		key: 'X',
		onEvent: async () => {
			if (Player(cache.ped).state.isCuffed) return

			await requestAnimDict(animDict)
			state.handsUp ? entity.stopAnim(cache.ped, animDict) : await entity.playAnim(cache.ped, animDict, 'handsup_base')
			state.handsUp = !state.handsUp
		},
	}),
]
