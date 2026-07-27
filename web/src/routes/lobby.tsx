import { Header } from "@/components/header"
import { Layout } from "@/components/layout"
import { Outlet } from "react-router"

export const Lobby = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<Layout>
				<Outlet />
			</Layout>
		</div>
	)
}