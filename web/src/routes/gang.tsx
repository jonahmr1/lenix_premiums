import { Gang } from '@/screens/gang'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gang')({
	component: Gang,
})
