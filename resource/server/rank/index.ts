import { onClientCallback } from "@overextended/ox_lib/server"
import type { Rank } from 'types/index'
import './db/schema'
import { oxmysql } from "@overextended/oxmysql"
import { tablePrefix } from "./db/schema"

onClientCallback('lenix:server:rank:getProfile', async (client): Promise<Rank.Player['Profile']> => {
	const profileId = GetPlayerIdentifierByType(client.toString(), 'fivem')
	const name = GetPlayerName(client.toString())

	const selectedCols = ['profile_id', 'name', 'status'] as const

	let profile = await oxmysql.single<Pick<Rank.Player['Profile'], typeof selectedCols[number]>>(
		`SELECT ${selectedCols.join(', ')} FROM ${tablePrefix}profiles WHERE profile_id = ? LIMIT 1`,
		[profileId]
	)

	if (!profile) {
		const re = await oxmysql.insert(
			`INSERT INTO ${tablePrefix}profiles (${selectedCols.join(', ')}) VALUES (?, ?, ?)`,
			[profileId, name, 'offline']
		)
		if (!re) throw 'Failed to create a new profile'

		profile = await oxmysql.single<Rank.Player['Profile']>(
			`SELECT ${selectedCols.join(', ')} FROM ${tablePrefix}profiles WHERE profile_id = ? LIMIT 1`,
			[profileId]
		)
	}

	return {
		...profile,
		avatar: null
	}
})

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}