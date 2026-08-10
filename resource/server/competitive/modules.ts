import { oxmysql } from "@overextended/oxmysql"
import { fullName } from "./db"
import { getProfileId } from "./utils"
import type { Competitive } from "types/index"
import { palette } from "lenix"

export const getProfile = async (client: number) => {
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
