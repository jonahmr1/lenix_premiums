import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './components/layout'
import './index.css'
import { Progress } from './components/ui/progress'
import { ThemeProvider } from './components/theme-provider'
import { AnimatePresence, motion } from 'motion/react'
import { anim, audiobility, cdn } from './lib'
import assets from './lib/assets'
import debugEvents from './debug.log.json'
import { Kbd } from './components/ui/kbd'
import { Howl } from 'howler'
import { onKeyDown } from 'lenix/nui'
import type { Start } from 'types'

type Log = Record<string, string | number | boolean>

const BACKGROUNDS = [
	'assets/loading/ls-1.png',
	'assets/loading/ls-2.png',
	'assets/loading/ls-3.png',
	'assets/loading/ls-4.png',
] as const
const CROSSFADE_INTERVAL = 10

const player = new Howl({
	src: cdn('assets/loading/welcome_to_los_santos.mp3'),
	volume: import.meta.env.DEV ? 0.0 : 0.5,
})

export function Loading() {
	const [state, setState] = useState({
		progress: 0,
		name: '',
		fullyLoaded: false,
		preloaded: false,
		gameLoaded: false
	})
	const [backgroundIndex, setBackgroundIndex] = useState(0)
	const ready = state.preloaded && state.fullyLoaded && state.gameLoaded

	useEffect(() => {
		if (state.preloaded) return

		const timeout = setTimeout(async () => {
			await Promise.allSettled(
				assets.map(async src => {
					const response = await fetch(cdn(src), { cache: 'force-cache' })

					if (!response.ok) throw new Error(`Failed to preload ${src}: HTTP ${response.status}`)

					await response.arrayBuffer()
					setState(prev => ({
						...prev,
						name: src,
						progress: Math.min(100, prev.progress + 100 / assets.length),
					}))
				}),
			)
			setState(prev => ({ ...prev, name: '', progress: prev.fullyLoaded ? 100 : 0, preloaded: true }))
		})

		return () => clearTimeout(timeout)
	}, [state.preloaded])

	useEffect(() => {
		player.play()

		const interval = setInterval(() => {
			setBackgroundIndex(index => (index + 1) % BACKGROUNDS.length)
		}, CROSSFADE_INTERVAL * 1000)

		const handler = ({ data }: MessageEvent<Log>) => {
			if (data.fullyLoaded === true) {
				setState(prev => ({ ...prev, fullyLoaded: true }))
				return
			}

			setState(prev => {
				if (!prev.preloaded) return prev
				const next = {
					...prev,
					progress: data.eventName === 'loadProgress' ? (data.loadFraction as number) * 100 : prev.progress,
					name: typeof data.name === 'string' ? data.name : typeof data.message === 'string' ? data.message : prev.name,
				}
				return next.progress === prev.progress && next.name === prev.name ? prev : next
			})
		}

		window.addEventListener('message', handler)

		return () => {
			window.removeEventListener('message', handler)
			clearInterval(interval)
		}
	}, [])

	useEffect(() => {
		if (!ready) return

		window.focus()
		const dispose = onKeyDown('Space', () => {
			fetch(`https://lenix_premiums/${'start:shutdownLoading' satisfies Start.Requests['shutdownLoadingScreen'][1]}`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({})
			})
			audiobility.onMouseDown()
		})

		return dispose
	}, [ready])

	useEffect(() => {
		if (!import.meta.env.DEV || !state.preloaded) return

		let index = 0
		const interval = setInterval(() => {
			if (index >= debugEvents.length) {
				clearInterval(interval)
				window.postMessage({ fullyLoaded: true }, window.location.origin)
				return
			}
			window.postMessage(debugEvents[index++], window.location.origin)
		}, 10)

		return () => clearInterval(interval)
	}, [state.preloaded])

	return (
		<div className='bg-background relative h-screen overflow-hidden'>
			<AnimatePresence>
				<motion.img
					key={backgroundIndex}
					src={cdn(BACKGROUNDS[backgroundIndex])}
					className='absolute size-full object-cover'
					initial={{ opacity: 0, scale: 1 }}
					animate={{ opacity: 1, scale: 1.1 }}
					exit={{ opacity: 0, scale: 1.15 }}
					transition={{
						opacity: { duration: CROSSFADE_INTERVAL / 3, ease: 'easeInOut' },
						scale: { duration: CROSSFADE_INTERVAL, ease: 'linear' },
					}}
				/>
			</AnimatePresence>
			<Layout className='relative flex size-full flex-col justify-end gap-h-5 items-center bg-linear-to-t from-neutral-950/50 to-transparent'>
				<motion.div
					className='gap-w-0.5 flex items-center text-center text-2xl uppercase italic'
					initial={{ opacity: 0 }}
					animate={{ opacity: ready ? 1 : 0 }}
					transition={{ duration: 1, delay: ready ? 2 : 0 }}
				>
					<span>Press</span>
					<Kbd className='invert'>␣</Kbd>
					<span>to start</span>
				</motion.div>
				<motion.div
					className='w-[67vw] space-y-[1vh]'
					{...anim}
					initial={{ opacity: 0 }}
					animate={{ opacity: ready ? 0 : 1 }}
					transition={{ duration: 1, delay: 1 }}
				>
					<p className='text-muted-foreground text-center text-xs uppercase italic'>
						{state.name}
					</p>
					<Progress value={state.progress} className='outline outline-offset-1' />
				</motion.div>
			</Layout>
		</div>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider defaultTheme='dark'>
			<Loading />
		</ThemeProvider>
	</StrictMode>,
)
