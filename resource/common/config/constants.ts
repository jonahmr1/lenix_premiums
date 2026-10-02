const game_maps = {
	italien_street: {
		label: 'Italien Street',
		pre_round_staging_area: [
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
		pre_round_staging_area: [
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
	}
} as const

export const Constants = {
	roster: {
		max_callsign_length: 6
	},
	robbery: {
		vehicle_model: 'stockade',
		mission_price: 2000
	},
	locker: {
		coords: [0, 0, 0],
		name: 'pd_personal_locker'
	},
	warzone: {
		game_maps,
		game_modes: {
			casual: {
				label: 'Casual',
				min_players_per_team: 1,
				rounds: 5,
				round_time: 60,
				pre_and_post_round_time: 10,
				maps_allowed: <(keyof typeof game_maps)[]>[
					'italien_street',
					'cinema_studio'
				]
			}
		},
		score_weights: {
			win: 100,
			loss: -35,
			kill: 4,
			assist: 2,
			death: -3
		},
		ignore_invites_period: 15,
		invites_spam_period: 5,
		wall_debug: false
	}
} as const