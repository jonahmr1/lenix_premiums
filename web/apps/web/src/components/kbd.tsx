import { anim } from "@/lib"
import { Button } from "@workspace/ui/components/button"
import { Kbd } from "@workspace/ui/components/kbd"
import { audiobility } from "@workspace/ui/lib/utils"
import { onKeyDown } from "lenix/nui"
import { motion } from "motion/react"
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
		<motion.div
			{...anim}
			initial={{ opacity: 0, y: '50%' }}
			animate={{ opacity: 1, y: 0 }}
			className="group space-x-2 flex items-center"
		>
			<Button
				onClick={onClick}
				{...disable === 'click' ? { onMouseEnter: audiobility.onMouseEnter } : disable === 'hover' ? { onMouseDown: audiobility.onMouseDown } : audiobility}
				variant='secondary'
				className="gap-xs"
			>
				<Kbd>
					{Icon}
				</Kbd>
				<span className="font-sans">{children}</span>
			</Button>
		</motion.div>
	)
}