import Select from '@/screens/select'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/starting/select')({
	component: Select,
})