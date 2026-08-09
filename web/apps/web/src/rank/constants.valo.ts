import avatar from '@workspace/valo/assets/user.png'

// export const user = {
// 	name: 'Lenix',
// 	isReady: false,
// 	avatar,
// 	stats: {
// 		kills: 19247,
// 		deaths: 8354,
// 		assits: 17898,
// 		wins: 5469,
// 		losses: 8498,
// 	},
// }

export const GAME_MODES = [
	{
		name: 'Back-To-Back',
		playersPerTeam: 3,
	},
	{
		name: 'Bomb Plant',
		playersPerTeam: 4,
	},
	{
		name: 'Ground Battle',
		playersPerTeam: 5,
	},
	{
		name: 'Custom Game',
		playersPerTeam: 6,
	},
] as const
