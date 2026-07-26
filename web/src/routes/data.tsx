import { Leaderboard } from './leaderboard'
import { Play } from './play'
import type { Route } from '@/types'

export const routes: Route[] = [
  {
    to: '/',
    label: 'LOBBY',
    element: <Play />,
  },
  {
    to: '/play',
    label: 'PLAY',
    element: <Play />,
  },
	{
		to: 'leaderboard',
		label: 'LEADERBOARD',
		element: <Leaderboard />
	},
]