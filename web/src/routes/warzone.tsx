import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/warzone')({
	component: Outlet,
})
