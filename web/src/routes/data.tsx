import { BackToBack } from './back-to-back'
import { Leaderboard } from './leaderboard'
import { BombPlant } from './bomb-plant'
import { GroundBattle } from './ground-battle'
import { CustomGame } from './custom-game'
import { Play } from './play'
import { Home } from './home'
import type { Route } from '@/types'

export const routes: Route[] = [
  {
    to: '/',
    label: 'LOBBY',
    element: <Home />,
  },
  {
    to: '/play',
    label: 'PLAY',
    element: <Play />,
    children: [
      { to: 'back-to-back', label: 'Back-To-Back', element: <BackToBack /> },
      { to: 'bomb-plant', label: 'Bomb Plant', element: <BombPlant /> },
      { to: 'ground-battle', label: 'Ground Battle', element: <GroundBattle /> },
      { to: 'custom-game', label: 'Custom Game', element: <CustomGame /> },
    ],
  },
	{
		to: 'leaderboard',
		label: 'LEADERBOARD',
		element: <Leaderboard />
	},
]