import { triggerServerCallback } from '@overextended/ox_lib/client'
import { Config } from 'common/config/competitive'
import { control, emitEvent, onNui } from 'lenix/client'
import type { Competitive } from 'types/index'

const defaultDelay = 5000
const defaultStats = {
	kills: 0,
	deaths: 0,
	assists: 0,
	wins: 0,
	losses: 0,
}

control.on({
	event: 'press',
	key: 'G',
	cb: () => emitEvent<Competitive.Events['open']>('rank:open'),
})

onNui<Competitive.Requests['getProfile']>('rank:getProfile', async () => {
	const profile = await triggerServerCallback<Competitive.Player['Profile']>('lenix:server:rank:getProfile', defaultDelay)
	if (!profile) throw 'Failed to get profile'

	return profile
})

onNui<Competitive.Requests['getLeaderboard']>('rank:getLeaderboard', async () => {
	const performances = await triggerServerCallback<Competitive.Player['Performance'][]>('lenix:server:rank:getPerformances', defaultDelay)
	if (!performances) throw 'Failed to get performances'

	const profiles = await triggerServerCallback<Competitive.Player['Profile'][]>('lenix:server:rank:getProfiles', defaultDelay)
	if (!profiles) throw 'Failed to get profiles'

	const statsByProfile = new Map<
		Competitive.Player['Profile']['profile_id'],
		Pick<Competitive.Player['Stats'], 'kills' | 'deaths' | 'assists' | 'wins' | 'losses'>
	>()

	for (const performance of performances) {
		const current = statsByProfile.get(performance.profile_id) ?? defaultStats

		current.kills += performance.kills
		current.deaths += performance.deaths
		current.assists += performance.assists
		current.wins += performance.result === 'win' ? 1 : 0
		current.losses += performance.result === 'loss' ? 1 : 0

		statsByProfile.set(performance.profile_id, current)
	}

	return profiles.map(profile => ({
		score: (() => {
			const stats = statsByProfile.get(profile.profile_id) ?? defaultStats
			// if (!stats) throw `Failed to get stats for profile_id<${profile.profile_id}>`

			return Math.max(
				0,
				stats.wins * Config.weights.win +
				stats.kills * Config.weights.kill +
				stats.losses * Config.weights.loss +
				stats.deaths * Config.weights.death +
				stats.assists * Config.weights.assist
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

onNui<Competitive.Requests['getMatches']>('rank:getMatches', async () => {
	const matches = await triggerServerCallback<Competitive.Player['Match'][]>('lenix:server:rank:getMatches', defaultDelay)
	if (!matches) throw 'Failed to get matches'

	return matches
})

onNui<Competitive.Requests['getStats']>('rank:getStats', async () => {
	const stats = await triggerServerCallback<Competitive.APIs['getStats']>('lenix:server:rank:getStats', defaultDelay)
	if (!stats) throw 'Failed to get stats'

	const totals = stats.reduce(
		(acc, stat) => {
			acc.kills += stat.kills
			acc.deaths += stat.deaths
			acc.assists += stat.assists
			acc.wins += stat.result === 'win' ? 1 : 0
			acc.losses += stat.result === 'loss' ? 1 : 0
			return acc
		},
		{
			kills: 0,
			deaths: 0,
			assists: 0,
			wins: 0,
			losses: 0,
		},
	)

	return {
		...totals,
		winRate: totals.wins + totals.losses ? totals.wins / (totals.wins + totals.losses) : 0,
		killsDeathsRatio: totals.deaths ? totals.kills / totals.deaths : totals.kills,
		matches: totals.wins + totals.losses,
	}
})

onNui<Competitive.Requests['party']['get']>('rank:party:create', async () => {
	const party = await triggerServerCallback<Competitive.Player['Party']>('lenix:server:rank:createParty', defaultDelay)
	if (!party) throw 'Failed to create party'

	return party
})

onNui<Competitive.Requests['party']['setSize']>('rank:party:setSize', async ({ size }) => {
	const party = await triggerServerCallback<Competitive.Player['Party']>('lenix:server:rank:setSize', defaultDelay, size)
	if (party === undefined) return null
	if (!party) throw 'Failed to set party size'

	return party
})

onNui<Competitive.Requests['getFriends']>('rank:getFriends', async () => {
	const friends = await triggerServerCallback<Competitive.Player['Profile'][] | undefined>('lenix:server:rank:getFriends', defaultDelay)
	if (!friends) throw 'Failed to get friends'

	return friends
})