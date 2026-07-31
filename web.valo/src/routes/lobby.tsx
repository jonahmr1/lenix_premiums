import { Layout } from "@/components/layout"
import { useLocation, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { IconDiamondsFilled } from '@tabler/icons-react';
import { user } from "@/lib/user";
import { getTheme, toggleTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { Play } from "@/pages/play"
import { Leaderboard } from "@/pages/leaderboard"
import type { BaseRoute } from "@/types"
import { Lobby } from "@/pages/lobby";

const pages: BaseRoute[] = [
	{
		to: '/',
		label: 'Lobby',
		element: <Lobby />
	},
	{
		to: '/play',
		label: 'PLAY',
		element: <Play />,
	},
	{
		to: '/leaderboard',
		label: 'LEADERBOARD',
		element: <Leaderboard />
	},
]

export const Home = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex justify-between min-h-[5vh] w-full px-20 border-b bg-background/10">
				<div className="flex items-center cursor-default select-none w-1/10 font-extrabold">RANKZONE</div>
				<div>
					<NavigationMenu className="h-full">
						<div className="grid grid-flow-col auto-cols-fr h-full">
							{pages.map(page => {
								const isInCurrentRoute = pathname === page.to
								return (
									<Button
										key={page.to}
										className={`relative border-0 h-full w-full flex tracking-widest px-7 flex-col ${page.to === '/play' ? 'text-2xl' : 'text-sm'} ${isInCurrentRoute ? 'bg-gradient-to-t from-primary to-transparent border-b-2 border-foreground' : ''}`}
										variant={isInCurrentRoute ? 'default' : 'ghost'}
										onClick={() => nav(page.to)}
									>
										{page.label}
										<IconDiamondsFilled
											className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-foreground ${isInCurrentRoute ? 'size-3' : 'size-2'}`}
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
				{pages.map(page => (
					<div key={page.to} className={pathname === page.to ? 'visible' : 'hidden'}>
						{page.element}
					</div>
				))}
			</Layout>
		</div>
	)
}
