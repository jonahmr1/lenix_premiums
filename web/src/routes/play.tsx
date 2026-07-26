import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Outlet, useLocation, useNavigate } from "react-router"
import { routes } from "./data"
import { IconDiamondsFilled } from "@tabler/icons-react"

export const Play = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()

	return (
		<Layout>
			<NavigationMenu className="h-full">
				{routes.map(route => {
					const isInCurrentRoute = pathname === route.to
					return (
						<Button
							key={route.to}
							className={`relative border-0 h-full flex flex-col ${route.to === '/play' ? 'px-20 text-xl' : 'px-10 text-xs'}`}
							variant='link'
							onClick={() => nav(route.to)}
						>
							{route.label}
							<IconDiamondsFilled
								className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-white ${isInCurrentRoute ? 'size-3' : 'size-2'}`}
							/>
						</Button>
					)
				})}
			</NavigationMenu>
			<Outlet />
		</Layout>
	)
}