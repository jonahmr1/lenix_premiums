import { asserts, entries } from '@lenix/lenix'
import { notify, onServerCallback, triggerServerCallback } from '@overextended/ox_lib/client'
import { Config } from 'common/config/competitive'
import { client, control, emitNui as emitEvent, onNui } from 'lenix/client'
import type { Competitive } from 'types/index'

const defaultDelay = 5000

control.on({
	event: 'press',
	key: 'G',
	onEvent: () => emitEvent<Competitive.Events['open']>('competitive:open'),
})

onNet('lenix:server:competitive:getInvited', async (inviter: number) => {
	const profile = await triggerServerCallback<Competitive.Player['Profile']>('lenix:server:competitive:getProfile', defaultDelay, inviter)
	asserts(profile, 'Failed to get profile')

	emitEvent<Competitive.Events['playerInvited']>('competitive:playerInvited', profile.name, inviter)
	// TODO
	notify({ title: 'You have received a new invite' })
})

onServerCallback('lenix:server:competitive:updateParty', (party: Competitive.Player['Party']) => {
	emitEvent<Competitive.Events['updateParty']>('competitive:updateParty', party)
})
