import { Button } from "@workspace/ui/components/button"
import { Kbd } from "@workspace/ui/components/kbd"
import { audiobility } from "@workspace/ui/lib/utils"

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
			<Kbd className="bg-foreground text-muted rounded-md">
				{Icon}
			</Kbd>
			<span className="font-sans">{children}</span>
		</Button>
	</div>
)