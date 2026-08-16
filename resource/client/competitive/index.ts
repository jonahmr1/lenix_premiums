import { notify } from '@overextended/ox_lib/client'
import { control, emitNui as emitEvent, emitNui, onNui } from 'lenix/client'
import type { Competitive } from 'types/index'

let open: boolean = false
let inviterWhileUnFocused: Competitive.Player['GamerProfile'][] = []


const getInvited = (inviter: Competitive.Player['GamerProfile']) =>
	emitEvent<Competitive.Events['playerInvited']>('competitive:playerInvited', inviter)


control.on({
	event: 'press',
	key: 'G',
	onEvent: () => {
		emitEvent<Competitive.Events['open']>('competitive:open')
		open = true
		setTimeout(() => {
			inviterWhileUnFocused.forEach(getInvited)
			inviterWhileUnFocused = []
		}, 1000);
	},
})

onNui('competitive:unFocus', () => {
	open = false
	return null
})

onNet('lenix:server:competitive:updateStage', (stage: Competitive.Stage) =>
	emitNui<Competitive.Events['updateStage']>('competitive:updateStage', stage)
)

onNet('lenix:server:competitive:getInvited', async (inviter: Competitive.Player['GamerProfile']) => {
	if (open) {
		getInvited(inviter)
		return
	}
	notify({ title: 'You have received a new invite' })
	inviterWhileUnFocused.push(inviter)
})

onNet('lenix:server:competitive:updateParty', (party: Competitive.Player['Party']) => {
	emitEvent<Competitive.Events['updateParty']>('competitive:updateParty', party)
})
