import { SprayCan } from 'lucide-react'
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
]
