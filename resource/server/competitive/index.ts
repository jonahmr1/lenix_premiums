import './nui'
import { onClientCallback } from "@overextended/ox_lib/server"
import type { Competitive } from 'types/index'

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}
