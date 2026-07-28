import { Layout } from "@/components/layout"
import { useLocation, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { user } from "@/lib/user";
import { getTheme, toggleTheme } from "@/lib/theme";
import { BarChart3, Crown, Moon, PlayIcon, Sun, Trophy } from "lucide-react";
import { Play } from "@/pages/play"
import { Leaderboard } from "@/pages/leaderboard"
import type { BaseRoute } from "@/types"

const pages = [
	{
		to: '/',
		label: 'PLAY',
		icon: PlayIcon,
		element: <Play />,
	},
	{
		to: '/rank',
		label: 'RANK',
		icon: Crown,
		element: <Leaderboard />
	},
	{
		to: '/leaderboard',
		label: 'LEADERBOARD',
		icon: Trophy,
		element: <Leaderboard />
	},
	{
		to: '/stats',
		label: 'STATS',
		icon: BarChart3,
		element: <Leaderboard />
	},
] satisfies (BaseRoute & { icon: React.ElementType })[]

const useTheme = () => getTheme()

export const Home = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()
	const theme = useTheme()

	return (
		<div className="flex flex-col h-screen">
			<div className="flex justify-between h-1/10 w-full px-[clamp(1.5rem,4vw,5rem)] border-b bg-background/10">
				<div className="flex items-center cursor-default select-none w-1/10 font-extrabold">RANKZONE</div>
				<div>
					<NavigationMenu className="h-full items-stretch">
						<div className="flex gap-10">
							{pages.map(page => {
								const isInCurrentRoute = pathname === page.to
								const Icon = page.icon

								return (
									<Button
										key={page.to}
										className={`gap-2 border-0 rounded-none h-full px-0 w-fit bg-transparent text-sm ${isInCurrentRoute ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
										variant='link'
										onClick={() => nav(page.to)}
									>
										<Icon className="size-4" />
										{page.label}
									</Button>
								)
							})}
						</div>
					</NavigationMenu>
				</div>
				<div className="flex items-center justify-end w-1/10 gap-3">
					<div className="relative size-9 shrink-0 rounded-full border border-primary/60 bg-white/5 p-1">
						<img src={user.avatar} alt="" className="size-full rounded-full object-cover" />
						<span className="absolute bottom-0 right-0 size-2.5 rounded-full border border-background bg-green-500" />
					</div>
					<div className="cursor-default select-none leading-tight">
						<div>{user.name}</div>
						<div className="text-[0.65rem] text-primary">Online</div>
					</div>
					<Button
						variant='ghost'
						onClick={() => toggleTheme()}
					>{theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
				</div>
			</div>
			<Layout>
				{pages.map(page => (
					<div key={page.to} className={`${pathname === page.to ? 'visible' : 'hidden'} h-full`}>
						{page.element}
					</div>
				))}
			</Layout>
		</div>
	)
}
