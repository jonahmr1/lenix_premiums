import { LoadFile } from '../utils';

export const Config = LoadFile('public/config.outlaw.json')

export const Constants = {
	roster: {
		max_callsign_length: 6
	},
	robbery: {
		vehicle_model: 'stockade',
		mission_price: 2000
	}
}