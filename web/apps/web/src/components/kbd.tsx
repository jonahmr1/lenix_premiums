import { Button } from "@workspace/ui/components/button"
import { Kbd } from "@workspace/ui/components/kbd"
import { audiobility } from "@workspace/ui/lib/utils"
import { onKeyDown } from "lenix/nui"
import { useEffect } from "react"

export const NavKbd = ({ children, icon: Icon, onClick, keybind, disable }: {
	children: React.ReactNode
	icon: React.ReactNode
	onClick: () => void
	keybind: string
	disable?: 'click' | 'hover'
}) => {
	useEffect(() => {
		const dispose = onKeyDown(keybind, () => {
			onClick()
			audiobility.onMouseDown()
		})

		return dispose
	}, [])

	return (
		<div className="group space-x-2 flex items-center">
			<Button
				onClick={onClick}
				{...disable === 'click' ? { onMouseEnter: audiobility.onMouseEnter } : disable === 'hover' ? { onMouseDown: audiobility.onMouseDown } : audiobility}
				className="bg-foreground"
			>
				<Kbd className="bg-background text-foreground group-hover:bg-foreground group-hover:text-background rounded-md font-black italic">
					{Icon}
				</Kbd>
				<span className="font-sans">{children}</span>
			</Button>
		</div>
	)
}