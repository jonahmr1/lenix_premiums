import { DEV } from "@/App"
import type { MatchScore } from "@/types"
import { random } from "@lenix/lenix"
import { audio } from "@workspace/ui/lib/utils"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

const delay = 1

export const Result = () => {
	const [state, setState] = useState<MatchScore & { endSituation: 'score' | 'time' }>()

	useEffect(() => {
		DEV(() => {
			const winner = random(0, 1)
			setState({ own: winner ? 100 : 67, opponent: winner ? 67 : 100, endSituation: random(0, 1) ? 'score' : 'time' })
			setTimeout(() => {
				audio.impact()
			}, delay * 1000);
			
			const timeout = setTimeout(() => {
				setState(undefined)
				clearTimeout(timeout)
			}, 10_000)
		}, 'competitive')
	}, [])

	if (!state) return null

	const won = state.own > state.opponent

	return (
		<div className="backdrop-blur-xs absolute-center place-content-center place-items-center size-full z-11">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay }}
				className="size-full place-content-center place-items-center uppercase font-oxanium"
			>
				<div className="flex w-full justify-evenly text-fluid-8 items-center font-semibold font-number">
					<motion.p
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: delay + 0.2, duration: 0.2, ease: 'easeOut' }}
						className='text-brand glow-lg'
					>{state.own}</motion.p>
					<motion.p
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: delay + 0.4, stiffness: 100, type: 'spring' }}
						className="text-fluid-15 font-black font-oxanium text-neutral-300 opacity-80"
					>{won ? 'Victory' : 'Defeat'}</motion.p>
					<motion.p
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: delay + 0.2, duration: 0.2, ease: 'easeOut' }}
						className='text-opposite'
						>{state.opponent}</motion.p>
				</div>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: delay + 1, duration: 0.7, ease: 'easeOut' }}
					className="text-fluid-2"
				>{state.endSituation === 'score' ? 'Score limit reached' : 'Overtime concluded'}</motion.div>
			</motion.div>
		</div>
	)
}