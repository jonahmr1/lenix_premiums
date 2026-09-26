import { useEffect, useState } from "react"
import { motion, type MotionProps } from 'motion/react'

type HitVariant = typeof hitVariants[number]
type MarkerConfig = {
	lines: 1 | 2
	color: string
}

const hitVariants = ['hit', 'headshot', 'armorHit', 'armorBreak', 'kill'] as const
const variants = {
	hit: { lines: 1, color: 'bg-foreground' },
	headshot: { lines: 1, color: 'bg-background' },
	armorHit: { lines: 2, color: 'bg-foreground' },
	armorBreak: { lines: 1, color: 'bg-primary' },
	kill: { lines: 1, color: 'bg-opposite' },
} satisfies Record<HitVariant, MarkerConfig>
const size = {
	wrapper: '-translate-x-2 -translate-y-2.5',
	width: 'w-3.5',
	offset: 6,
	positions: ['-left-2', 'left-2', 'left-2 top-4', '-left-2 top-4'],
}
const arms = [
	{ id: 'tl', x: -1, y: -1, rotate: 45, clip: '[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]' },
	{ id: 'tr', x: 1, y: -1, rotate: -45, clip: '[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]' },
	{ id: 'br', x: 1, y: 1, rotate: 45, clip: '[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]' },
	{ id: 'bl', x: -1, y: 1, rotate: -45, clip: '[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]' },
]

const armAnimation = (x: number, y: number, rotate: number): MotionProps => ({
	initial: { x: 0, y: 0, rotate, opacity: 1 },
	animate: { x: [0, x, x], y: [0, y, y], opacity: [1, 1, 0] },
	transition: {
		duration: 0.4,
		times: [0, 0.5, 1],
		ease: [0, 0, 0.58, 1],
	},
})

export const HitMarker = () => {
	const [state, setVariant] = useState<{ id: number, variant: HitVariant }>({ id: 0, variant: 'hit' })

	useEffect(() => {
		const interval = setInterval(() => {
			setVariant(prev => {
				const id = prev.id + 1
				return { id, variant: hitVariants[id % hitVariants.length] }
			})
		}, 150)

		return () => clearInterval(interval)
	}, [])

	const config = variants[state.variant]

	return (
		<div
			key={state.id}
			className={`absolute left-1/2 top-1/2 ${size.wrapper}`}
		>
			{arms.map((arm, index) => (
				<motion.div
					key={arm.id}
					{...armAnimation(arm.x * size.offset, arm.y * size.offset, arm.rotate)}
					className={`absolute space-y-px ${size.positions[index]}`}
				>
					{Array.from({ length: config.lines }, (_, line) => (
						<div key={line} className={`h-0.5 ${size.width} ${config.color} ${arm.clip}`} />
					))}
				</motion.div>
			))}
		</div>
	)
}
