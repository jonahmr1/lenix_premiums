import { onClientCallback } from "@overextended/ox_lib/server"
import type { Competitive } from 'types/index'
import { oxmysql } from "@overextended/oxmysql"
import { fullName } from "./db"
import { Parties } from "./party"
import { palette } from "lenix"
import { getProfileId } from "./utils"
import { getProfile } from "./modules"
import { asserts } from "@lenix/lenix"
import { Config } from "common/config/competitive"
import { onNuiServer } from "lenix/server"

const profileCols = ['profile_id', 'name', 'status'] as const
const performancesCols = ['result', 'kills', 'deaths', 'assists'] as const

onNuiServer<Competitive.Requests['getProfile']>('competitive:getProfile', async (client) => {
	const profile = await getProfile(client)

	return profile
})

onClientCallback('lenix:server:competitive:getProfile', async (client, player?: number): Promise<Competitive.Player['Profile']> => {
	const profile = await getProfile(player ?? client)

	return profile
})

const getProfiles = async () => {
	const profiles = await oxmysql.query<{
		profile_id: string;
		name: string;
		status: "offline" | "online" | "dnd"
	}[]>(
		`SELECT ${profileCols.join(', ')} FROM ${fullName('profiles')}`
	) satisfies Record<(typeof profileCols)[number], any>[]

	return profiles.map(profile => ({
		...profile,
		avatar: null
	}))
}

onNuiServer<Competitive.Requests['getProfiles']>('competitive:getProfiles', async () => {
	return await getProfiles()
})

onClientCallback('lenix:server:competitive:getProfiles', async (_client): Promise<Competitive.Player['Profile'][]> => {
	return await getProfiles()
})

onClientCallback('lenix:server:competitive:getPerformances', async (_client): Promise<Competitive.Player['Performance'][]> => {
	const selectedCols = ['match_id', 'profile_id', 'result', 'kills', 'deaths', 'assists'] as const
	const performances: Competitive.Player['Performance'][] = await oxmysql.query<{
		match_id: number
		profile_id: string
		result: 'win' | 'loss'
		kills: number
		deaths: number
		assists: number
	}[]>(`SELECT ${selectedCols.join(', ')} FROM ${fullName('performances')}`) satisfies Record<(typeof selectedCols)[number], any>[]

	if (!performances.length) return []

	return performances
})

onClientCallback('lenix:server:competitive:getPerformances', async (client): Promise<Competitive.APIs['getStats']> => {
	const profile_id = getProfileId(client)

	const performances = await oxmysql.query<{
		result: 'win' | 'loss'
		kills: number
		deaths: number
		assists: number
	}[]>(
		`SELECT ${performancesCols.join(', ')} FROM ${fullName('performances')} WHERE profile_id = ?`,
		[profile_id]
	) satisfies Record<(typeof performancesCols)[number], any>[]

	return performances
})

onNuiServer<Competitive.Requests['getMatches']>('competitive:getMatches', async (client) => {
	const profileId = getProfileId(client)

	const selectedCols = ['match_id', 'result', 'kills', 'deaths', 'assists'] as const
	const selectedMatchsCols = ['match_id', 'mode', 'map', 'played_at'] as const

	try {
		const matchesPerformance = await oxmysql.query<{
			match_id: number
			result: 'win' | 'loss'
			kills: number
			deaths: number
			assists: number
		}[]>(
			`SELECT ${selectedCols.join(', ')} FROM ${fullName('performances')} WHERE profile_id = ?`,
			[profileId]
		) satisfies Record<(typeof selectedCols)[number], any>[]
		if (!matchesPerformance.length) return []

		const matches: {
			match_id: number
			map: string
			played_at: number
		}[] = await oxmysql.query(
			`SELECT ${selectedMatchsCols.join(', ')} FROM ${fullName('matches')} WHERE profile_id = ?`,
			[profileId]
		) satisfies Record<(typeof selectedMatchsCols)[number], any>[]

		return matches.map(match => {
			const matchPerformance = matchesPerformance.find(self => self.match_id === match.match_id)
			asserts(matchPerformance, `Could not find match<${match.match_id}> in matchesPerformance`)

			return {
				...match,
				delta:
					matchPerformance.assists * Config.weights.assist +
						matchPerformance.deaths * Config.weights.death +
						matchPerformance.kills * Config.weights.kill +
						matchPerformance.result === 'win' ? Config.weights.win : Config.weights.loss
				,
				result: matchPerformance.result,
				stats: {
					kills: matchPerformance.kills,
					deaths: matchPerformance.deaths,
					assits: matchPerformance.assists
				}
			}
		})
	} catch (e) {
		console.log(palette('red', String(e)))
		throw e
	}
})

onNuiServer<Competitive.Requests['getFriends']>('competitive:getFriends', async (client) => {
	const selectedCols = ['sender_id', 'receiver_id', 'status'] as const
	const profile_id = getProfileId(client)
	
	try {
		const friends = await oxmysql.query<{
			status: 'accepted' | 'pending'
			sender_id: string
			receiver_id: string
		}[]>(
			`SELECT ${selectedCols.join(', ')} FROM ${fullName('friends')} WHERE (sender_id = ? OR receiver_id = ?) AND status = ?`,
			[profile_id, profile_id, 'accepted']
		) satisfies Record<(typeof selectedCols)[number], any>[]

		const friendIds = friends.map(friend =>
			friend.sender_id === profile_id ? friend.receiver_id : friend.sender_id
		)
		if (!friendIds.length) return []

		const profiles = await oxmysql.query<Competitive.Player['Profile'][]>(
			`SELECT ${profileCols.join(', ')} FROM ${fullName('profiles')} WHERE profile_id IN (?)`,
			[friendIds]
		) satisfies Record<(typeof profileCols)[number], any>[]

		return profiles
	} catch (e) {
		console.log(palette('red', String(e)))
		throw e
	}
})

onNuiServer<Competitive.Requests['setStatus']>('competitive:setStatus', async (client, { status }) => {
	const profileId = getProfileId(client)

	try {
		const re = await oxmysql.query(
			`UPDATE ${fullName('profiles')} SET status = ? WHERE profile_id = ?`,
			[status, profileId]
		)
		asserts(re, `Failed to update status for player<${client}>`)
		return true as const
	} catch (error) {
		console.log(palette('red', String(error)))
		throw error
	}
})

onNuiServer<Competitive.Requests['party']['get']>('competitive:party:get', async (client) => {
	const profile = await getProfile(client)
	asserts(profile, `Failed to get client<${client}> profile`)

	const currentParty = Parties.partyByProfileId(profile.profile_id)
	return currentParty ?? await Parties.new(client)
})

onClientCallback('lenix:server:competitive:getProfilesStats', async (_client, profiles: string[]): Promise<Competitive.APIs['getProfilesStats']> => {
	const selectedCols = ['profile_id', ...performancesCols] as const
	try {
		const performances = await oxmysql.query<{
			profile_id: string
			result: 'win' | 'loss'
			kills: number
			deaths: number
			assists: number
		}[]>(
			`SELECT ${selectedCols.join(', ')} FROM ${fullName('performances')} WHERE profile_id IN (?)`,
			[profiles]
		) satisfies Record<(typeof selectedCols)[number], any>[]

		return Object.fromEntries(
			profiles.map(profile_id => [
				profile_id,
				Object.fromEntries(
					performances.map(({ profile_id, ...stat }) => [profile_id, stat])
				)[profile_id] ?? {
					kills: 0,
					deaths: 0,
					assists: 0,
					result: 'loss',
				},
			])
		)
	} catch (e) {
		console.log(palette('red', String(e)))
		throw e
	}
})

onClientCallback('lenix:server:competitive:updateReadiness', (client, status: Competitive.Requests['updateReadiness']['2']['status']) => Parties.updateReadiness(client, status))

onClientCallback('lenix:server:competitive:leaveParty', (client) => {
	Parties.leaveParty(client)
})

onNuiServer<Competitive.Requests['party']['setSize']>('competitive:party:setSize', async (client, { size }) => {
	return await Parties.setSize(client, size)
})

onClientCallback('lenix:server:competitive:invitePlayer', (client, invited: number) => Parties.invite(client, invited))

onClientCallback('lenix:server:competitive:ignoreInvites', (client, inviter: number) => Parties.ignoreInvites(client, inviter))

onNuiServer<Competitive.Requests['acceptInvite']>('competitive:acceptInvite', async (client, { inviter }) => {
	return await Parties.acceptInvite(client, inviter)
})

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}
