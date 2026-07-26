import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Outlet, useLocation } from "react-router"
import { IconDiamondsFilled } from "@tabler/icons-react"
import { GAME_MODES } from "@/constants"

export const Play = () => {
	const { pathname } = useLocation()

	return (
		<Layout>
			<NavigationMenu className="items-start py-5">
				<div className="grid grid-flow-col auto-cols-fr">
					{GAME_MODES.map(mode => {
						const isInCurrentRoute = pathname === mode.name
						return (
							<Button
								key={mode.name}
								className="relative border-0 flex flex-col px-5 text-xs text-foreground w-full"
								variant="link"
								onClick={() => {}}
							>
								{mode.name}
								<IconDiamondsFilled
									className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-white ${isInCurrentRoute ? 'size-3' : 'size-2'}`}
								/>
							</Button>
						)
					})}
				</div>
			</NavigationMenu>
			<Outlet />
		</Layout>
	)
}