import { addCommand } from '@overextended/ox_lib/server';
import { Matches } from './match';
import './nui'
import { Parties } from './party';

const printSnapshot = (data: object) => {
	const size = Buffer.byteLength(JSON.stringify(data), 'utf8')
	console.error(`snapshot: ${(size / 1024).toFixed(2)} KB | ${size} Bytes`)
}

addCommand('winky', async (source) => {
	emitNet('testit', source, 'Hi')
})

addEventListener('testserver', () => {
	console.log(source)
}, true)

addEventListener('testlocalserver', () => {
	console.log('local')
})

emit('testlocalserver')

on('playerDropped', () => {
	Parties.crash(source)
	Matches.crash(source)
})