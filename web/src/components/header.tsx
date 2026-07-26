import { useLocation, useNavigate } from "react-router"
import { Button } from "./ui/button"
import { NavigationMenu } from "./ui/navigation-menu"
import { Dot } from "lucide-react"

const routes = [
	{
		label: 'LOBBY',
		to: '/'
	},
	{
		label: 'PLAY',
		to: '/modes'
	},
	{
		label: 'LEADERBOARD',
		to: '/leaderboard'
	},
]

export const Header = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()

	return (
		<div className="flex justify-between absolute min-h-6/100 w-full px-20 border-b">
			<div className="flex items-center">Rankzone</div>
			<div>
				<NavigationMenu className="h-full">
					{routes.map(route => (
						<Button
							key={route.to}
							className="border-0 h-full px-10 text-md relative"
							variant={pathname === route.to ? 'default' : 'ghost'}
							onClick={() => {
								nav(route.to)
							}
						}>
							{route.label}
							<Dot className="absolute top-full" size={0} />
						</Button>
					))}
				</NavigationMenu>
			</div>
			<div className="flex items-center">Lenix</div>
		</div>
	)
}