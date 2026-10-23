import { Outlet } from '@tanstack/react-router'
import { Roster } from './roster'

export const Police = () => (
	<>
		<Roster />
		<Outlet />
	</>
)
