import { Skull, SprayCan, Trophy } from 'lucide-react'
import { Spray } from './routes/spray'
import type { AppIcon } from './types'

export const apps: AppIcon[] = [
	{
		name: 'Gang Management',
		styles: 'bg-blue-950',
		icon: {
			element: Skull,
			styles: 'text-blue-500',
		},
		element: Spray,
	},
	{
		name: 'Leaderboard',
		styles: 'bg-yellow-950',
		icon: {
			element: Trophy,
			styles: 'text-yellow-500',
		},
		element: Spray,
	},
	{
		name: 'Sprays War',
		styles: 'bg-red-950',
		icon: {
			element: SprayCan,
			styles: 'text-red-500',
		},
		element: Spray,
	},
]