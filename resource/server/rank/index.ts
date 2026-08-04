import { onClientCallback } from "@overextended/ox_lib/server"
import { oxmysql } from "@overextended/oxmysql"
import type { Rank } from 'types/index'

onClientCallback('lenix:server:rank:getProfile', (client): Rank.Player['Profile'] => {

	return 
})

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}

setImmediate(async () => {
	const ret = oxmysql.query(`
		CREATE TABLE IF NOT EXISTS lenix_premiums:competitive (
			id INT UNSIGNED NOT NULL PRIMARY KEY,
		)
	`)
})