import { Kbd } from "../../../../packages/ui/src/components/kbd";
import { Button } from "../../../../packages/ui/src/components/button";
import { audiobility } from "../../../../packages/ui/src/lib/utils";

export const NavKbd = ({ children, icon: Icon, onClick, disable }: {
	children: React.ReactNode
	icon: React.ReactNode
	onClick: React.ComponentProps<typeof Button>['onClick']
	disable?: 'click' | 'hover'
}) => (
	<div className="space-x-2 flex items-center">
		<Button
			variant='ghost'
			onClick={onClick}
			{...disable === 'click' ? { onMouseEnter: audiobility.onMouseEnter } : disable === 'hover' ? { onMouseDown: audiobility.onMouseDown } : audiobility}
		>
			<Kbd className="bg-foreground text-muted">
				{Icon}
			</Kbd>
			<span className="font-sans">{children}</span>
		</Button>
	</div>
)