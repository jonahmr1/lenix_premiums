import { Layout } from "@/components/layout"
import { useLocation, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { user } from "@/lib/user";
import { getTheme, toggleTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { Play } from "@/pages/play"
import { Leaderboard } from "@/pages/leaderboard"
import type { BaseRoute } from "@/types"

const pages: BaseRoute[] = [
	{
		to: '/',
		label: 'PLAY',
		element: <Play />,
	},
	{
		to: '/rank',
		label: 'RANK',
		element: <Leaderboard />
	},
	{
		to: '/leaderboard',
		label: 'LEADERBOARD',
		element: <Leaderboard />
	},
	{
		to: '/stats',
		label: 'STATS',
		element: <Leaderboard />
	},
]

export const Home = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex justify-between min-h-[10vh] w-full px-20 border-b bg-background/10">
				<div className="flex items-center cursor-default select-none w-1/10 font-extrabold">RANKZONE</div>
				<div>
					<NavigationMenu className="h-full">
						<div className="grid grid-flow-col auto-cols-fr h-full gap-5">
							{pages.map(page => {
								const isInCurrentRoute = pathname === page.to
								return (
									<Button
										key={page.to}
										className={`border-0 rounded-none h-full px-0 w-fit bg-transparent ${page.to === '/play' ? 'text-2xl' : 'text-sm'} ${isInCurrentRoute ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
										variant='link'
										onClick={() => nav(page.to)}
									>
										{page.label}
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
