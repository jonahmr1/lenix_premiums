import deathmatch from '@workspace/ui/assets/competitive/lobby/team_deathmatch.png'
import streetfight from '@workspace/ui/assets/competitive/lobby/street_fight.png'

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
	image: string
	maps: (keyof typeof MAPS)[]
	teams: number
	players: number
}

type ModeData = ModeDataBase | ModeDataBase & {
	duration: number
}

export const MODES: Record<string, ModeData> = {
	team_deathmatch: {
		label: 'Team Deathmatch',
		image: deathmatch,
		maps: ['italien_street', 'cinema_studio'],
		duration: 90_000,
		teams: 2,
		players: 4,
	},
	street_fight: {
		label: 'Street Fight',
		image: streetfight,
		maps: ['cinema_studio'],
		teams: 4,
		players: 4,
	}
} as const