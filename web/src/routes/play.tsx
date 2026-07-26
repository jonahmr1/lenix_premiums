import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Outlet } from "react-router"

export const Play = () => {
	return (
		<Layout>
			<Button>Test</Button>
			<Outlet />
		</Layout>
	)
}