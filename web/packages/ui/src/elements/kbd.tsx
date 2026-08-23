import { Kbd } from "../components/kbd";
import { Button } from "../components/button";

export const NavKbd = ({ children, icon: Icon, onClick }: {
	children: React.ReactNode
	icon: React.ReactNode
	onClick: React.ComponentProps<typeof Button>['onClick']
}) => (
	<div className="space-x-2 flex items-center">
		<Button variant='ghost' onClick={onClick}>
			<Kbd className="bg-white text-muted">
				{Icon}
			</Kbd>
			<span className="font-sans">{children}</span>
		</Button>
	</div>
)