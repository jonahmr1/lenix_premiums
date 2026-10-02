import { oxmysql } from "@overextended/oxmysql"
import { fullName, getProfileId } from "./utils"
import type { Competitive } from "types/index"
import { asserts } from "@lenix/lenix"


export const profileCols = ['profile_id', 'name', 'status'] as const


export const fetchProfile = async (client: number): Promise<Competitive.Profile> => {
	asserts(GetPlayerPed(client.toString()), `Could not find client<${client}>`)
	const profileId = getProfileId(client)

	const selectedCols = ['profile_id', 'name', 'status'] as const
	const selectProfile = `SELECT ${selectedCols.join(', ')} FROM ${fullName('profiles')} WHERE profile_id = ? LIMIT 1`

	try {
		const profile = await oxmysql.single<Pick<Competitive.Profile, typeof selectedCols[number]>>(
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
			`INSERT INTO ${fullName('profiles')} (${selectedCols.join(', ')}) VALUES (?, ?, ?)
				ON DUPLICATE KEY UPDATE profile_id = profile_id`,
			[profileId, name, 'online']
		)
		asserts(re !== null && re !== undefined, `Failed to create a new profile for player<${client}>`)

		return await fetchProfile(client)
	} catch (e) {
		throw e
	}
}

export const getBucketProfiles = (profiles: Omit<Competitive.Profile, 'avatar'>[]) => Promise.all(profiles.map(async profile => ({
	...profile,
	avatar: null
})))

export const getProfiles = async (): Promise<Competitive.Profile[]> => {
	const profiles = await oxmysql.query<{
		profile_id: string;
		name: string;
		status: "offline" | "online" | "dnd"
	}[]>(
		`SELECT ${profileCols.join(', ')} FROM ${fullName('profiles')}`
	) satisfies Record<(typeof profileCols)[number], any>[]

	return await getBucketProfiles(profiles)
}

export const getStatsDetails = (stats: Competitive.APIs['getStats']) => {
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
}
