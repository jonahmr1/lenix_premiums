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
		<div className="space-x-2 flex items-center">
			<Button
				variant='ghost'
				onClick={onClick}
				{...disable === 'click' ? { onMouseEnter: audiobility.onMouseEnter } : disable === 'hover' ? { onMouseDown: audiobility.onMouseDown } : audiobility}
				className="hover:bg-neutral-900!"
			>
				<Kbd className="bg-neutral-300 text-neutral-900 rounded-md">
					{Icon}
				</Kbd>
				<span className="font-sans text-neutral-300">{children}</span>
			</Button>
		</div>
	)
}