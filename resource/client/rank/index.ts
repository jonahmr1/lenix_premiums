import { addKeybind, triggerServerCallback } from '@overextended/ox_lib/client'
import { ResourceName } from 'common/resource'
import { emitEvent, onNui } from 'lenix/client'
import type { Rank } from 'types/index'

const defaultDelay = 5000

addKeybind({
	name: `${ResourceName}:rank:open`,
	description: 'Open Rank',
	defaultKey: 'G',
	onPressed: () => emitEvent<Rank.Events['open']>('rank:open'),
})

onNui<Rank.Requests['getProfile']>('rank:getProfile', async () => {
	const profile = await triggerServerCallback<Rank.Player['Profile']>('lenix:server:rank:getProfile', defaultDelay)
	if (!profile) throw 'Failed to get profile'

	return profile
})

onNui<Rank.Requests['getLeaderboard']>('rank:getLeaderboard', async () => {
	const leaderboard = await triggerServerCallback<Rank.Leaderboard>('lenix:server:rank:getLeaderboard', defaultDelay)
	if (!leaderboard) throw 'Failed to get leaderboard'

	return leaderboard
})

onNui<Rank.Requests['party']['get']>('rank:party:get', async () => {
	const party = await triggerServerCallback<Rank.Party>('lenix:server:rank:getParty', defaultDelay)
	if (!party) throw 'Failed to get party'

	return party
})

onNui<Rank.Requests['party']['setSize']>('rank:party:setSize', async size => {
	const party = await triggerServerCallback<Rank.Party>('lenix:server:rank:setSize', defaultDelay, size)
	if (!party) throw 'Failed to set party size'

	return party
})

onNui<Rank.Requests['getMatches']>('rank:getMatches', async () => {
	const matches = await triggerServerCallback<Rank.Player['Matches']>('lenix:server:rank:getMatches', defaultDelay)
	if (!matches) throw 'Failed to get matches'

	return matches
})