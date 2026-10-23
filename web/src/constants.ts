import type { Start, Warzone } from 'types'
import { cdn } from './lib'

export const MAPS_IMAGES = {
	default: cdn('assets/ipad/map.jpeg'),
}

export const MODES = {
	warzone: {
		label: 'Warzone',
		description:
			'Pure high-intensity FPS combat. Team-based firefights, tactical battles, and competitive gunplay with no roleplay.',
		image: cdn('assets/start/warzone.png'),
		disabled: false,
		color: '573D33',
		translate: -20,
	},
	police: {
		label: 'Law Enforcement',
		description:
			'Step into the role of law enforcement. Patrol the streets, respond to incidents, and serve as Police, SWAT, Sheriff, and other units.',
		image: cdn('assets/start/law.png'),
		disabled: false,
		color: '40363C',
		translate: 0,
	},
	gang: {
		label: 'Crime',
		description:
			'Build your criminal life. Join gangs, plan robberies, run illegal businesses, make money, and fight for control of the streets.',
		image: cdn('assets/start/crime.png'),
		disabled: false,
		color: '433538',
		translate: 15,
	},
	justice: {
		label: 'Undercover',
		description:
			'Work in the shadows. Take on covert operations, investigate dangerous organizations, gather information, and operate undercover.',
		image: cdn('assets/start/undercover.jpeg'),
		disabled: true,
		color: '332B2D',
		translate: 20,
	},
	race: {
		label: 'Pursuit',
		description:
			'Push your limits behind the wheel. Race through the streets, escape the law, chase targets, and compete in high-speed pursuits.',
		image: cdn('assets/start/pursuit.png'),
		disabled: true,
		color: '654E54',
		translate: 10,
	},
} satisfies Record<Start.Mode, object>

interface ModeDataBase {
	label: string
	description: string
	image: string
	maps: (keyof Warzone.GameMaps)[]
	teams: number
	players: number
	disabled?: true
}

type ModeData =
	| ModeDataBase
	| (ModeDataBase & {
			duration: number
			scoreLimit: number
	  })
	| (ModeDataBase & {
			points: string[]
	  })

export const WARZONE_MODES = {
	team_deathmatch: {
		label: 'Team Deathmatch',
		description:
			'Teams battle for the highest score. Reach the kill limit or have the most eliminations when the timer expires to win.',
		image: cdn('assets/competitive/lobby/team_deathmatch.png'),
		maps: ['italien_street', 'cinema_studio'],
		duration: 90_000,
		teams: 2,
		players: 4,
		scoreLimit: 100,
	},
	street_fight: {
		label: 'Street Fight',
		description: 'Take on rival teams and fight to survive. The last team standing wins.',
		image: cdn('assets/competitive/lobby/street_fight.png'),
		maps: ['cinema_studio'],
		teams: 4,
		players: 4,
	},
	hostage_extraction: {
		label: 'Hostage Extraction',
		description:
			'Two teams battle over a hostage. SWAT pushes in to extract the hostage while the Criminals defends from inside.',
		image: cdn('assets/competitive/lobby/hostage_extraction.png'),
		maps: ['cinema_studio', 'italien_street'],
		teams: 2,
		players: 5,
		disabled: true,
	},
	bomb_plant: {
		label: 'Bomb Plant',
		description:
			'Plant the bomb at the target site and defend it until it detonates. The opposing team must stop the detonation before time runs out.',
		image: cdn('assets/competitive/lobby/bomb_plant.png'),
		maps: ['cinema_studio', 'italien_street'],
		teams: 2,
		players: 5,
		disabled: true,
	},
	domination: {
		label: 'Domination',
		description:
			'Capture and hold three control points to earn points. The team with the most points when the timer ends wins.',
		image: cdn('assets/competitive/lobby/domination.png'),
		maps: ['cinema_studio', 'italien_street'],
		points: ['Alpha', 'Bravo', 'Charlie'],
		teams: 2,
		players: 12,
		disabled: true,
	},
	flag_capture: {
		label: 'Flag Capture',
		description:
			'Capture the enemy flag and return it to your base while defending your own. First team to reach the score limit wins.',
		image: cdn('assets/competitive/lobby/flag_capture.png'),
		maps: ['cinema_studio', 'italien_street'],
		scoreLimit: 10,
		teams: 3,
		players: 4,
		disabled: true,
	},
	arms_race: {
		label: 'Arms Race',
		description:
			'Eliminate enemies to advance through a set of weapons. The first player to complete the weapon progression wins.',
		image: cdn('assets/competitive/lobby/arms_race.png'),
		maps: ['cinema_studio', 'italien_street'],
		teams: 10,
		players: 1,
		disabled: true,
	},
	convoy_shift: {
		label: 'Convoy Shift',
		description:
			'Two teams fight for control of the convoy. Push it to the enemy base—the team that pushes it farthest wins.',
		image: cdn('assets/competitive/lobby/convoy_shift.png'),
		maps: ['cinema_studio', 'italien_street'],
		teams: 2,
		players: 6,
		disabled: true,
	},
} as const satisfies Record<string, ModeData>
