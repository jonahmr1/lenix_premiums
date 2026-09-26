import { audio } from "@/lib"
import type { MatchScore } from "@/types"
import { random } from "@lenix/lenix"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

const delay = 1

export const Result = () => {
	const [state, setState] = useState<MatchScore>()

	useEffect(() => {
		const winner = random(0, 1)
		setState({ own: winner ? 99 : 67, opponent: winner ? 67 : 100 })
		setTimeout(() => {
			audio.impact()
		}, delay * 1000);
		
		const timeout = setTimeout(() => {
			setState(undefined)
			clearTimeout(timeout)
		}, 10_000)
	}, [])

	return (
		<AnimatePresence>
			{state && (
				<div className="absolute-center place-content-center place-items-center size-full z-11">
					<motion.div
						animate={{ opacity: 1 }}
						transition={{ delay }}
						className="size-full place-content-center place-items-center uppercase"
					>
						<div className="flex w-full justify-evenly text-v-6 items-center font-semibold font-number">
							<motion.p
								initial={{ opacity: 0, x: -50 }}
								exit={{ opacity: 0, x: -50, transition: { delay: 0.2, duration: 0.2 } }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: delay + 0.2, duration: 0.2, ease: 'easeOut' }}
								className='text-brand glow-lg'
							>{state.own}</motion.p>
							<motion.p
								initial={{ opacity: 0, scale: 0.5 }}
								exit={{ opacity: 0, scale: 0.5, transition: { delay: 0 } }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: delay + 0.4, stiffness: 100, type: 'spring' }}
								className="text-v-14 font-black italic font-sans text-primary-foreground opacity-80"
							>{state.own > state.opponent ? 'Victory' : 'Defeat'}</motion.p>
							<motion.p
								initial={{ opacity: 0, x: 50 }}
								exit={{ opacity: 0, x: 50, transition: { delay: 0.2, duration: 0.2 } }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: delay + 0.2, duration: 0.2, ease: 'easeOut' }}
								className='text-opposite'
								>{state.opponent}</motion.p>
						</div>
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							exit={{ opacity: 0, y: 50, transition: { delay: 0, duration: 0.7 } }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: delay + 1, duration: 0.7, ease: 'easeOut' }}
							className="text-v-1.5 font-semibold"
						>{state.own === 100 || state.opponent === 100 ? 'Score limit reached' : 'Overtime concluded'}</motion.div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}