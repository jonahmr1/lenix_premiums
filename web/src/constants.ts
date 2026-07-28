export const GAME_MODES = {
	back_to_back: {
		label: 'Back-To-Back',
	},
	bomb_plant: {
		label: 'Bomb Plant'
	},
	ground_battle: {
		label: 'Ground Battle'
	},
	custom: {
		label: 'Custom Game'
	},
}

export const PvP_AMOUNT = {
	1: ['back_to_back', 'custom'],
	2: ['back_to_back', 'custom'],
	3: ['back_to_back', 'custom', 'bomb_plant'],
	4: ['back_to_back', 'custom', 'bomb_plant', 'ground_battle'],
	5: ['back_to_back', 'custom', 'bomb_plant', 'ground_battle'],
	6: ['back_to_back', 'custom', 'bomb_plant', 'ground_battle'],
} satisfies Record<number, (keyof typeof GAME_MODES)[]>