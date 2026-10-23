import { Police } from '@/screens/police'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/police')({
	component: Police,
})
