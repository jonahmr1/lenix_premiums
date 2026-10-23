import { Mode } from '@/screens/warzone/lobby/mode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/warzone/mode')({
	component: Mode,
})
