import { SprayCan, Trophy } from 'lucide-react'
import { Spray } from './routes/spray'
import type { AppIcon } from './types'

export const apps: AppIcon[] = [
	{
		name: 'Sprays War',
		styles: 'bg-muted',
		icon: {
			element: SprayCan,
			styles: 'text-red-500',
		},
		element: Spray,
	},
	{
		name: 'Leaderboard',
		styles: 'bg-muted',
		icon: {
			element: Trophy,
			styles: 'text-orange-500',
		},
		element: Spray,
	},
]