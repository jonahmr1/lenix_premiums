import { onClientCallback } from "@overextended/ox_lib/server"
import type { Competitive } from 'types/index'
import { oxmysql } from "@overextended/oxmysql"
import { fullName } from "./db"
import { parties, Party } from "./party"
import Config from "common/config"
import { palette } from "lenix"

const profileCols = ['profile_id', 'name', 'status'] as const

const getProfileId = (client: number) => GetPlayerIdentifierByType(client.toString(), 'fivem')

const getProfile = async (client: number) => {
	const profileId = getProfileId(client)

	const selectedCols = ['profile_id', 'name', 'status'] as const
	const selectProfile = `SELECT ${selectedCols.join(', ')} FROM ${fullName('profiles')} WHERE profile_id = ? LIMIT 1`

	try {
		const profile = await oxmysql.single<Pick<Competitive.Player['Profile'], typeof selectedCols[number]>>(
			selectProfile,
			[profileId]
		)

		if (profile) return {
			...profile,
			avatar: null
		}

		// create new player
		const name = GetPlayerName(client.toString())
		const re = await oxmysql.insert(
			`INSERT INTO ${fullName('profiles')} (${selectedCols.join(', ')}) VALUES (?, ?, ?)`,
			[profileId, name, 'online']
		)
		if (!re) throw 'Failed to create a new profile'

		return await oxmysql.single<Competitive.Player['Profile']>(
			selectProfile,
			[profileId]
		)
	} catch (e) {
		console.log(palette('red', String(e)))
	}
}

onClientCallback('lenix:server:rank:getProfile', async (client): Promise<Competitive.Player['Profile']> => {
	const profile = await getProfile(client)
	if (!profile) throw `Failed to get profile for player<${client}>`
	return profile
})

onClientCallback('lenix:server:rank:getPerformances', async (_client): Promise<Competitive.Player['Performance'][]> => {
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

onClientCallback('lenix:server:rank:getStats', async (client): Promise<Competitive.APIs['getStats']> => {
	const profile_id = getProfileId(client)

	const selectedCols = ['result', 'kills', 'deaths', 'assists'] as const
	const stats = await oxmysql.query<{
		result: 'win' | 'loss'
		kills: number
		deaths: number
		assists: number
	}[]>(
		`SELECT ${selectedCols.join(', ')} FROM ${fullName('performances')} WHERE profile_id = ?`,
		[profile_id]
	) satisfies Record<(typeof selectedCols)[number], any>[]

	return stats
})

onClientCallback('lenix:server:rank:getProfiles', async (_client): Promise<Competitive.Player['Profile'][]> => {
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
})

onClientCallback('lenix:server:rank:getMatches', async (client): Promise<Competitive.Player['Match'][]> => {
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
			if (!matchPerformance) throw `Could not find match<${match.match_id}> in matchesPerformance`

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
		throw e
	}
})

onClientCallback('lenix:server:rank:createParty', async (client): Promise<Competitive.Player['Party']> => {
	const profile = await getProfile(client)
	if (!profile) throw `Failed to get profile for player<${client}>`
	const party = new Party(profile)

	parties.set(client, party)
	return party
})

onClientCallback('lenix:server:rank:setSize', async (client, size: number): Promise<Competitive.Player['Party']> => {
	const party = parties.get(client)
	if (!party) throw `Could not find party for client<${client}>`
	party.size = size

	return party
})

onClientCallback('lenix:server:rank:getFriends', async (client): Promise<Competitive.Player['Profile'][] | undefined> => {
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
	}
})

onClientCallback('lenix:server:rank:setStatus', async (client, newStatus: Competitive.Player['Profile']['status']): Promise<boolean> => {
	const profileId = getProfileId(client)

	try {
		const re = await oxmysql.query(
			`UPDATE ${fullName('profiles')} SET status = ? WHERE profile_id = ?`,
			[newStatus, profileId]
		)
		if (!re) throw `Failed to update status for player<${client}>`
		return true
	} catch (error) {
		console.log(palette('red', String(error)))
		return false
	}
})

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}
