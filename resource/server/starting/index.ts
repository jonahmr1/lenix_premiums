import './db'
import { onClientCallback } from '@overextended/ox_lib/server'
import type { Character } from '@overextended/ox_core'
import type { Starting } from 'types/index'
import { oxmysql } from '@overextended/oxmysql'
import { fullName } from './utils'
import { asserts } from '@lenix/lenix'
import { onNuiServer } from 'lenix/server'
import { GetPlayer } from '@overextended/ox_core/server'

const clientsWithNoCharacters = new Map<number, Starting.Mode>()

on('ox:createdCharacter', async (playerId: number, _userId: number, charId: number) => {
	const mode = clientsWithNoCharacters.get(playerId)
	asserts(mode, `Failed to get client<${playerId}>'s selected mode to create a new char`)

	await oxmysql.insert(
		`INSERT INTO ${fullName('modes')} (charId, type) VALUES(?, ?)`,
		[charId, mode]
	)
	clientsWithNoCharacters.delete(playerId)
})

onNuiServer<Starting.Requests['logout']>('starting:logout', (client) => {
	const player = GetPlayer(client)
	asserts(player, `Failed to get player<${client}> to logout`)

	player.logout()
	return null
})

onNuiServer<Starting.Requests['exitGame']>('starting:exitGame', (client) => {
	const player = GetPlayer(client)
	asserts(player, `Failed to get player<${client}> to disconnect`)

	player.logout(true, true)
	DropPlayer(client.toString(), 'You exited the game')

	return null
})

onClientCallback('lenix:server:starting:modeSelected', async (client, characters: Character[], mode: Starting.Mode): Promise<Character | undefined> => {
	if (!characters.length) {
		clientsWithNoCharacters.set(client, mode)
		return
	}

	const re = await oxmysql.single<{ charId: number }>(
		`SELECT charId FROM ${fullName('modes')} WHERE type = ? AND charId IN (?)`,
		[mode, characters.map(char => char.charId)]
	)

	if (!re) {
		clientsWithNoCharacters.set(client, mode)
		return
	}
	
	const character = characters.find(character => character.charId === re.charId)
	asserts(character, `Couldn't find client<${client}>'s character<${re.charId}>`)
	return character
})
