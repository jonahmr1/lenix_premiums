import type { LucideIcon } from 'lucide-react'

export interface Route {
	to: `/${string}`
	label: string
	icon: LucideIcon
	element: React.JSX.Element
}
