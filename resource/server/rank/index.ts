import { onClientCallback } from "@overextended/ox_lib/server"
import type { Rank } from 'types/index'
import './db'
import { oxmysql } from "@overextended/oxmysql"
import { tablePrefix } from "./db"

onClientCallback('lenix:server:rank:getProfile', async (client): Promise<Rank.Player['Profile']> => {
	const profileId = GetPlayerIdentifierByType(client.toString(), 'fivem')
	
	const selectedCols = ['profile_id', 'name', 'status'] as const
	const selectProfile = `SELECT ${selectedCols.join(', ')} FROM ${tablePrefix}profiles WHERE profile_id = ? LIMIT 1`

	let profile = await oxmysql.single<Pick<Rank.Player['Profile'], typeof selectedCols[number]>>(
		selectProfile,
		[profileId]
	)

	if (!profile) {
		const name = GetPlayerName(client.toString())
		const re = await oxmysql.insert(
			`INSERT INTO ${tablePrefix}profiles (${selectedCols.join(', ')}) VALUES (?, ?, ?)`,
			[profileId, name, 'offline']
		)
		if (!re) throw 'Failed to create a new profile'

		profile = await oxmysql.single<Rank.Player['Profile']>(
			selectProfile,
			[profileId]
		)
	}

	return {
		...profile,
		avatar: null
	}
})

onClientCallback('lenix:server:rank:getStats', async (_client): Promise<Rank.Player['Performance'][]> => {
	const selectedCols = ['match_id', 'profile_id', 'result', 'kills', 'deaths', 'assists'] as const
	const stats: Rank.Player['Performance'][] = await oxmysql.query<{
		match_id: number
		profile_id: string
		result: 'win' | 'loss'
		kills: number
		deaths: number
		assists: number
	}[]>(`SELECT ${selectedCols.join(', ')} FROM ${tablePrefix}performances`) satisfies Record<(typeof selectedCols)[number], any>[]
	
	return stats
})

onClientCallback('lenix:server:rank:getProfiles', async (_client): Promise<Rank.Player['Profile'][]> => {
	const selectedCols = ['profile_id', 'name', 'status'] as const
	const profiles = await oxmysql.query<{
		profile_id: string;
    name: string;
    status: "offline" | "online" | "dnd"
	}[]>(`SELECT ${selectedCols.join(', ')} FROM ${tablePrefix}profiles`) satisfies Record<(typeof selectedCols)[number], any>[]

	return profiles.map(profile => ({
		...profile,
		avatar: null
	}))
})

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}