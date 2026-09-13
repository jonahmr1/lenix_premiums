import { HandFist, Skull, SprayCan, Trophy } from 'lucide-react'
import { Spray } from './routes/spray'
import type { AppIcon } from './types'

export const apps: AppIcon[] = [
	{
		name: 'Gang',
		styles: 'bg-blue-950',
		icon: {
			element: Skull,
			styles: 'text-blue-500',
		},
		disabled: true
	},
	{
		name: 'Leaderboard',
		styles: 'bg-yellow-950',
		icon: {
			element: Trophy,
			styles: 'text-yellow-500',
		},
		disabled: true
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
	{
		name: 'Gang War',
		styles: 'bg-green-950',
		icon: {
			element: HandFist,
			styles: 'text-green-500',
		},
		disabled: true
	},
]