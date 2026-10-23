import { Game } from '@/screens/warzone/game'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/warzone/game')({
	component: Game,
})
