import { createFileRoute } from '@tanstack/react-router'
import { Credit } from '@/screens/credit'

export const Route = createFileRoute('/starting/credit')({
	component: Credit,
})