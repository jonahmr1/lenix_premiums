import { Start } from '@/screens/start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/start/')({
	component: Start,
})
