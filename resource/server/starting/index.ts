import './db'
import { onClientCallback } from '@overextended/ox_lib/server'
import type { Character } from '@overextended/ox_core'
import type { Starting } from 'types/index'
import { oxmysql } from '@overextended/oxmysql'
import { fullName } from './utils'
import { asserts } from '@lenix/lenix'

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

onClientCallback('lenix:server:starting:modeSelected', async (client, characters: Character[], mode: Starting.Mode): Promise<Character | undefined> => {
	if (!characters.length) {
		clientsWithNoCharacters.set(client, mode)
		return
	}

	const charIds = characters.map(char => char.charId)
	
	const re = await oxmysql.single<{ charId: number }>(
		`SELECT charId FROM ${fullName('modes')} WHERE type = ? AND charId IN (?)`,
		[mode, charIds]
	)

	if (!re) {
		clientsWithNoCharacters.set(client, mode)
		return
	}
	
	return characters.find(character => character.charId === re.charId)
})