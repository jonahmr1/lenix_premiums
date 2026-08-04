import { onClientCallback } from "@overextended/ox_lib/server"
import type { Rank } from 'types/index'
import './db/schema'

onClientCallback('lenix:server:rank:getProfile', (client): Rank.Player['Profile'] => {

	return 
})

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}