import { Layout } from "@/components/layout"
import { Outlet } from "react-router"

export const Lobby = () => {
	return (
		<Layout>
			<Outlet />
		</Layout>
	)
}