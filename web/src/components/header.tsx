import { useLocation, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { NavigationMenu } from "./ui/navigation-menu"
import { IconDiamondsFilled } from '@tabler/icons-react';
import { routes } from "@/routes/data";

export const Header = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()

	return (
		<div className="flex justify-between min-h-[5vh] w-full px-20 border-b bg-background/10">
			<div className="flex items-center cursor-default select-none w-1/10">Rankzone</div>
			<div>
				<NavigationMenu className="h-full">
					<div className="grid grid-flow-col auto-cols-fr h-full">
						{routes.map(route => {
							const isInCurrentRoute = pathname === route.to
							return (
								<Button
									key={route.to}
									className={`relative border-0 h-full w-full flex tracking-widest px-5 flex-col ${route.to === '/play' ? 'text-2xl' : 'text-sm'} ${isInCurrentRoute ? 'bg-gradient-to-t from-primary to-transparent border-b-2 border-foreground' : ''}`}
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
					</div>
				</NavigationMenu>
			</div>
			<div className="flex items-center cursor-default select-none w-1/10">Lenix</div>
		</div>
	)
}