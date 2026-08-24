import { addCommand } from '@overextended/ox_lib/server';
import { Matches } from './match';
import './nui'
import { Parties } from './party';

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}

on('playerDropped', () => {
	Parties.crash(source)
	Matches.crash(source)
})