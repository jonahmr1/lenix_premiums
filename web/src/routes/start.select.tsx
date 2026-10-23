import Selection from '@/screens/select'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/start/select')({
	component: Selection,
})
