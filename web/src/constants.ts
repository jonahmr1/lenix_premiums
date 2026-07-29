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

export const userStatuses = {
	online: {
		label: 'Online',
		className: 'bg-green-500',
	},
	offline: {
		label: 'Offline',
		className: 'bg-muted-foreground',
	},
	in_game: {
		label: 'In Game',
		className: 'bg-yellow-500',
	},
	dnd: {
		label: 'Do Not Disturb',
		className: 'bg-red-500',
	},
}