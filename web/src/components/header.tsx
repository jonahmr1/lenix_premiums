import { useLocation, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { NavigationMenu } from "./ui/navigation-menu"
import { IconDiamondsFilled } from '@tabler/icons-react';
import { routes } from "@/routes/data";

export const Header = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()

	return (
		<div className="flex justify-between absolute min-h-5/100 w-full px-20 border-b">
			<div className="flex items-center cursor-default select-none">Rankzone</div>
			<div>
				<NavigationMenu className="h-full">
					{routes.map(route => {
						const isInCurrentRoute = pathname === route.to
						return (
							<Button
								key={route.to}
								className={`relative border-0 h-full flex flex-col ${route.to === '/play' ? 'px-20 text-xl' : 'px-10 text-xs'}`}
								variant={isInCurrentRoute ? 'default' : 'ghost'}
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
			</div>
			<div className="flex items-center cursor-default select-none">Lenix</div>
		</div>
	)
}