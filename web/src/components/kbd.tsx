import { anim } from '@/lib'
import { Button } from './ui/button'
import { Kbd } from './ui/kbd'
import { audiobility } from '@/lib'
import { onKeyDown } from 'lenix/nui'
import { motion } from 'motion/react'
import { useEffect } from 'react'

export const NavKbd = ({
	children,
	icon: Icon,
	onClick,
	keybind,
}: {
	children: React.ReactNode
	icon: React.ReactNode
	onClick: () => void
	keybind: string
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
			className='group flex items-center'
		>
			<Button onClick={onClick} variant='background' className='gap-w-0.5 py-h-2 group'>
				<Kbd className='bg-foreground text-background font-bold uppercase group-hover:invert'>{Icon}</Kbd>
				<span className='text-v-1.2 font-sans uppercase'>{children}</span>
			</Button>
		</motion.div>
	)
}
