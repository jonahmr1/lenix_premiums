import { Layout } from "@/components/layout"
import { Outlet } from "react-router"
import { useLocation, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { IconDiamondsFilled } from '@tabler/icons-react';
import { routes } from "@/routes/data";
import { user } from "@/lib/user";
import { getTheme, toggleTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export const Lobby = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()
  const homeRoute = routes.find(route => route.to === "/")
  const headerRoutes = homeRoute ? [homeRoute, ...(homeRoute.children ?? [])] : []
	
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex justify-between min-h-[5vh] w-full px-20 border-b bg-background/10">
				<div className="flex items-center cursor-default select-none w-1/10 font-extrabold">RANKZONE</div>
				<div>
					<NavigationMenu className="h-full">
						<div className="grid grid-flow-col auto-cols-fr h-full">
							{headerRoutes.map(route => {
								const isInCurrentRoute = pathname === route.to
								return (
									<Button
										key={route.to}
										className={`relative border-0 h-full w-full flex tracking-widest px-7 flex-col ${route.to === '/play' ? 'text-2xl' : 'text-sm'} ${isInCurrentRoute ? 'bg-gradient-to-t from-primary to-transparent border-b-2 border-foreground' : ''}`}
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
				<div className="flex items-center w-1/10 gap-3">
					<div className=" cursor-default select-none">{user.name}</div>
					<Button
						variant='ghost'
						onClick={() => toggleTheme()}
					>{getTheme() === 'dark' ? <Sun /> : <Moon />}
					</Button>
				</div>
			</div>
			<Layout>
				<Outlet />
			</Layout>
		</div>
	)
}