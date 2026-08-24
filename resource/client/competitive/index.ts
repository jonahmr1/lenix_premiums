import { notify } from '@overextended/ox_lib/client'
import { control, emitNui as emitEvent, emitNui, onNui } from 'lenix/client'
import type { Competitive } from 'types/index'
import './game'

let open: boolean = false
let invitersWhileUnFocused: Competitive.GamerProfile[] = []


const getInvited = (inviter: Competitive.GamerProfile) =>
	emitEvent<Competitive.Events['playerInvited']>('competitive:playerInvited', inviter)

onNui('competitive:unFocus', () => {
	open = false
	return null
})

onNet('lenix:server:competitive:getInvited', async (inviter: Competitive.GamerProfile) => {
	if (open) {
		getInvited(inviter)
		return
	}
	notify({ title: 'You have received a new invite' })
	invitersWhileUnFocused.push(inviter)
})

onNet('lenix:server:competitive:updateParty', (party: Competitive.Party) => {
	emitEvent<Competitive.Events['updateParty']>('competitive:updateParty', party)
})

onNet('lenix:server:competitive:updateStage', (stage: Competitive.Stage) =>
	emitNui<Competitive.Events['updateStage']>('competitive:updateStage', stage)
)

addEventListener('testm', (arg) => {
	console.log(arg)
})

addEventListener('testit', (arg) => {
	console.log(arg)
}, true)

RegisterCommand('hh', () => {
	emitNet('testserver')
	emit('testm', 'Hello')
}, false)

export const login = (logout: () => void) => {
	logout()
	const remove = control.on({
		event: 'press',
		key: 'M',
		onEvent: () => {
			emitEvent<Competitive.Events['open']>('competitive:open')
			open = true
			setTimeout(() => {
				invitersWhileUnFocused.forEach(getInvited)
				invitersWhileUnFocused = []
			}, 1000)
		},
	})
	return remove
}