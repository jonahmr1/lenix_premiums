import deathmatch from '@workspace/ui/assets/competitive/lobby/team_deathmatch.png'
import streetfight from '@workspace/ui/assets/competitive/lobby/street_fight.png'
import hostageextraction from '@workspace/ui/assets/competitive/lobby/hostage_extraction.png'
import bombplant from '@workspace/ui/assets/competitive/lobby/bomb_plant.png'
import domination from '@workspace/ui/assets/competitive/lobby/domination.png'
import flagcapture from '@workspace/ui/assets/competitive/lobby/flag_capture.png'
import armsrace from '@workspace/ui/assets/competitive/lobby/arms_race.png'
import convoyshift from '@workspace/ui/assets/competitive/lobby/convoy_shift.png'

export const MAPS = {
	italien_street: {
		label: 'Italien Street',
		spawn: [
			[
				[375.7244, -373.3676, 46.8850],
				[380.4030, -375.0867, 46.9546],
				[379.1216, -377.6660, 46.965],
				[374.2903, -376.1084, 46.9260]
			],
			[
				[416.4116, -322.3034, 47.4014],
				[409.7668, -319.5173, 48.0966],
				[410.5701, -315.6648, 48.2882],
				[417.3006, -318.4163, 47.6100]
			]
		]
	},
	cinema_studio: {
		label: 'Cinema Studio',
		spawn: [
			[
				[-1150.5419, -478.6596, 38.4439],
				[-1150.0653, -475.5192, 38.4675],
				[-1145.3240, -475.8688, 38.8882],
				[-1145.2239, -479.5527, 39.0267]
			],
			[
				[-1190.5670, -544.3643, 28.5991],
				[-1185.6829, -539.5520, 28.9082],
				[-1181.0304, -545.8311, 28.7503],
				[-1185.8680, -550.0421, 28.2185]
			]
		]
	},
} as const

interface ModeDataBase {
	label: string
	description: string
	image: string
	maps: (keyof typeof MAPS)[]
	teams: number
	players: number
}

type ModeData = ModeDataBase | ModeDataBase & {
	duration: number
	scoreLimit: number
} | ModeDataBase & {
	points: string[]
}

export const MODES: Record<string, ModeData> = {
	team_deathmatch: {
		label: 'Team Deathmatch',
		description: 'Teams battle for the highest score. Reach the kill limit or have the most eliminations when the timer expires to win.',
		image: deathmatch,
		maps: ['italien_street', 'cinema_studio'],
		duration: 90_000,
		teams: 2,
		players: 4,
		scoreLimit: 60
	},
	street_fight: {
		label: 'Street Fight',
		description: 'Take on rival teams and fight to survive. The last team standing wins.',
		image: streetfight,
		maps: ['cinema_studio'],
		teams: 4,
		players: 4,
	},
	hostage_extraction: {
		label: 'Hostage Extraction',
		description: 'Two teams battle over a hostage. SWAT pushes in to extract the hostage while the Criminals defends from inside.',
		image: hostageextraction,
		maps: ['cinema_studio', 'italien_street'],
		teams: 2,
		players: 5,
	},
	bomb_plant: {
		label: 'Bomb Plant',
		description: 'Plant the bomb at the target site and defend it until it detonates. The opposing team must stop the detonation before time runs out.',
		image: bombplant,
		maps: ['cinema_studio', 'italien_street'],
		teams: 2,
		players: 5,
	},
	domination: {
		label: 'Domination',
		description: 'Capture and hold three control points to earn points. The team with the most points when the timer ends wins.',
		image: domination,
		maps: ['cinema_studio', 'italien_street'],
		points: ['Alpha', 'Bravo', 'Charlie'],
		teams: 2,
		players: 12,
	},
	flag_capture: {
		label: 'Flag Capture',
		description: 'Capture the enemy flag and return it to your base while defending your own. First team to reach the score limit wins.',
		image: flagcapture,
		maps: ['cinema_studio', 'italien_street'],
		scoreLimit: 10,
		teams: 3,
		players: 4,
	},
	arms_race: {
		label: 'Arms Race',
		description: 'Eliminate enemies to advance through a set of weapons. The first player to complete the weapon progression wins.',
		image: armsrace,
		maps: ['cinema_studio', 'italien_street'],
		teams: 10,
		players: 1,
	},
	convoy_shift: {
		label: 'Convoy Shift',
		description: 'Two teams fight for control of the convoy. Push it to the enemy base—the team that pushes it farthest wins.',
		image: convoyshift,
		maps: ['cinema_studio', 'italien_street'],
		teams: 2,
		players: 6,
	},
} as const