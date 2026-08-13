import './nui'
import { onClientCallback } from "@overextended/ox_lib/server"
import type { Competitive } from 'types/index'
import { fetchProfile } from "./modules"

onClientCallback('lenix:server:competitive:getProfile', async (client, player?: number): Promise<Competitive.Player['Profile']> => {
	const profile = await fetchProfile(player ?? client)

	return profile
})

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}
