import { asserts } from '@lenix/lenix'
import { onServerCallback, triggerServerCallback } from '@overextended/ox_lib/client'
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
	onEvent: () => emitEvent<Competitive.Events['open']>('competitive:open'),
})

const getProfiles = async () => {
	const profiles = await triggerServerCallback<Competitive.Player['Profile'][]>('lenix:server:competitive:getProfiles', defaultDelay)
	asserts(profiles, 'Failed to get profiles')

	return profiles
}

const getProfile = async (inviter?: number) => {
	const profile = await triggerServerCallback<Competitive.Player['Profile']>('lenix:server:competitive:getProfile', defaultDelay, inviter)
	asserts(profile, 'Failed to get profile')

	return profile
}

onNui<Competitive.Requests['getProfile']>('competitive:getProfile', async () => await getProfile())

onNui<Competitive.Requests['getLeaderboard']>('competitive:getLeaderboard', async () => {
	const performances = await triggerServerCallback<Competitive.Player['Performance'][]>('lenix:server:competitive:getPerformances', defaultDelay)
	asserts(performances, 'Failed to get performances')

	const profiles = await getProfiles()

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

onNui<Competitive.Requests['getMatches']>('competitive:getMatches', async () => {
	const matches = await triggerServerCallback<Competitive.Player['Match'][]>('lenix:server:competitive:getMatches', defaultDelay)
	asserts(matches, 'Failed to get matches')

	return matches
})

onNui<Competitive.Requests['getStats']>('competitive:getStats', async () => {
	const stats = await triggerServerCallback<Competitive.APIs['getStats']>('lenix:server:competitive:getStats', defaultDelay)
	asserts(stats, 'Failed to get stats')

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

onNui<Competitive.Requests['party']['get']>('competitive:party:create', async () => {
	const party = await triggerServerCallback<Competitive.Player['Party']>('lenix:server:competitive:createParty', defaultDelay)
	asserts(party, 'Failed to create party')

	return party
})

onNui<Competitive.Requests['party']['setSize']>('competitive:party:setSize', async ({ size }) => {
	const party = await triggerServerCallback<Competitive.Player['Party']>('lenix:server:competitive:setSize', defaultDelay, size)
	if (party === undefined) return null
	asserts(party, 'Failed to set party size')

	return party
})

onNui<Competitive.Requests['getFriends']>('competitive:getFriends', async () => {
	const friends = await triggerServerCallback<Competitive.Player['Profile'][] | undefined>('lenix:server:competitive:getFriends', defaultDelay)
	asserts(friends, 'Failed to get friends')

	return friends
})

onNui<Competitive.Requests['setStatus']>('competitive:setStatus', async ({ status }) => {
	const newStatus = await triggerServerCallback<boolean>('lenix:server:competitive:setStatus', defaultDelay, status)
	if (newStatus === undefined) return null
	asserts(newStatus, 'Failed to set status')

	return status
})

onNui<Competitive.Requests['getProfiles']>('competitive:getProfiles', getProfiles)

onNui<Competitive.Requests['invitePlayer']>('competitive:invitePlayer', async ({ id }) => {
	triggerServerCallback('lenix:server:competitive:invitePlayer', defaultDelay, id)
})

onNui<Competitive.Requests['acceptInvite']>('competitive:acceptInvite', async ({ inviter }) => {
	const party = await triggerServerCallback<Competitive.Player['Party']>('lenix:server:competitive:acceptInvite', defaultDelay, inviter)
	asserts(party, 'Failed to accept invite')

	return party
})

onNui<Competitive.Requests['ignoreInvites']>('competitive:ignoreInvites', ({ inviter }) => {
	triggerServerCallback('lenix:server:competitive:ignoreInvites', defaultDelay, inviter)
})

onNet('lenix:server:competitive:getInvited', async (inviter: number) => {
	const profile = await getProfile(inviter)
	emitEvent<Competitive.Events['playerInvited']>('competitive:playerInvited', profile.name, inviter)
})

onServerCallback('lenix:server:competitive:updateParty', (party: Competitive.Player['Party']) => {
	emitEvent<Competitive.Events['updateParty']>('competitive:updateParty', party)
})
