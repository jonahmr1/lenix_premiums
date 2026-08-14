import { notify } from '@overextended/ox_lib/client'
import { control, emitNui as emitEvent } from 'lenix/client'
import type { Competitive } from 'types/index'

control.on({
	event: 'press',
	key: 'G',
	onEvent: () => emitEvent<Competitive.Events['open']>('competitive:open'),
})

onNet('lenix:server:competitive:getInvited', async (inviter: Competitive.Player['Profile']) => {
	emitEvent<Competitive.Events['playerInvited']>('competitive:playerInvited', inviter)
	// TODO
	notify({ title: 'You have received a new invite' })
})

onNet('lenix:server:competitive:updateParty', (party: Competitive.Player['Party']) => {
	emitEvent<Competitive.Events['updateParty']>('competitive:updateParty', party)
})
