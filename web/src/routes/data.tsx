import { Lobby } from './lobby'
import { Leaderboard } from './leaderboard'
import { Play } from './play'
import type { Route } from '@/types'

export const routes: Route[] = [
	{
		to: '/',
		label: 'LOBBY',
		element: <Lobby />,
		children: [
			{
				to: '/play',
				label: 'PLAY',
				element: <Play />,
			},
			{
				to: '/leaderboard',
				label: 'LEADERBOARD',
				element: <Leaderboard />
			},
		]
	},
	{
		to: '/in-game',
		label: 'In Game',
		element: <></>,
	},
]