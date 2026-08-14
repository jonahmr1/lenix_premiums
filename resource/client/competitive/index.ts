import { notify } from '@overextended/ox_lib/client'
import { control, emitNui as emitEvent, onNui } from 'lenix/client'
import type { Competitive } from 'types/index'

let open: boolean = false
const inviterWhileUnFocused: Competitive.Player['Profile'][] = []

control.on({
	event: 'press',
	key: 'G',
	onEvent: () => {
		emitEvent<Competitive.Events['open']>('competitive:open')
		open = true
		inviterWhileUnFocused.forEach(getInvited)
	},
})

onNui('competitive:unFocus', () => {
	open = false
	return null
})

const getInvited = (inviter: Competitive.Player['Profile']) => emitEvent<Competitive.Events['playerInvited']>('competitive:playerInvited', inviter)

onNet('lenix:server:competitive:getInvited', async (inviter: Competitive.Player['Profile']) => {
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
