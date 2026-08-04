import { addKeybind, triggerServerCallback } from '@overextended/ox_lib/client'
import { weights } from 'common/config'
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
	const stats = await triggerServerCallback<Rank.Player['Performance'][]>('lenix:server:rank:getStats', defaultDelay)
	if (!stats) throw 'Failed to get stats'

	const profiles = await triggerServerCallback<Rank.Player['Profile'][]>('lenix:server:rank:getProfiles', defaultDelay)
	if (!profiles) throw 'Failed to get profiles'

	const statsByProfile = new Map<
		Rank.Player['Profile']['profile_id'],
		Pick<Rank.Player['Stats'], 'kills' | 'deaths' | 'assists' | 'wins' | 'losses'>
	>()

	for (const performance of stats) {
		const current = statsByProfile.get(performance.profile_id) ?? {
			kills: 0,
			deaths: 0,
			assists: 0,
			wins: 0,
			losses: 0,
		}

		current.kills += performance.kills
		current.deaths += performance.deaths
		current.assists += performance.assists
		current.wins += performance.result === 'win' ? 1 : 0
		current.losses += performance.result === 'loss' ? 1 : 0

		statsByProfile.set(performance.profile_id, current)
	}

	return profiles
		.map(profile => ({
			place: 0,
			score: (() => {
				const stats = statsByProfile.get(profile.profile_id)
				if (!stats) throw `Failed to get stats for profile_id<${profile.profile_id}>`

				return Math.max(
					0,
					stats.wins * weights.win +
						stats.losses * weights.loss +
						stats.kills * weights.kill +
						stats.assists * weights.assist +
						stats.deaths * weights.death,
				)
			})(),
			profile_id: profile.profile_id,
			name: profile.name,
			avatar: profile.avatar,
		}))
		.sort((a, b) => b.score - a.score)
		.map((profile, index) => ({
			...profile,
			place: index + 1,
		}))
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
	const matches = await triggerServerCallback<Rank.Player['Match'][]>('lenix:server:rank:getMatches', defaultDelay)
	if (!matches) throw 'Failed to get matches'

	return matches
})

onNui<Rank.Requests['getStats']>('rank:getStats', async () => {
	const stats = await triggerServerCallback<Rank.Player['Stats']>('lenix:server:rank:getStats', defaultDelay)
	if (!stats) throw 'Failed to get stats'

	return stats
})
