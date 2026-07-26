import { redirect } from "react-router"
import { Button } from "./ui/button"
import { NavigationMenu, NavigationMenuLink, navigationMenuTriggerStyle } from "./ui/navigation-menu"

const routes = [
	{
		label: 'Home',
		to: '/'
	},
]

export const Header = () => {
	return (
		<div className="flex justify-between px-20">
			<div>Rankzone</div>
			<div>
				<NavigationMenu>
					{routes.map(route => (
						<NavigationMenuLink key={route.to} asChild className={navigationMenuTriggerStyle()}>
							<Button onClick={() => redirect(route.to)}>{route.label}</Button>
						</NavigationMenuLink>
					))}
				</NavigationMenu>
			</div>
			<div></div>
		</div>
	)
}