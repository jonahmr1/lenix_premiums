import { Lobby } from '@/screens/warzone/lobby'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/warzone/')({
	component: Lobby,
})
