import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './components/layout'
import './index.css'
import { Progress } from './components/ui/progress'
import { asserts } from '@lenix/lenix'
import { ThemeProvider } from './components/theme-provider'
import { AnimatePresence, motion } from 'motion/react'
import { Howl } from 'howler'
import { anim, cdn } from './lib'
import assets from './lib/assets'
import { focusNui } from 'lenix/nui'
import debugEvents from './debug.log.json'

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
	volume: 0.5,
})

export function Loading() {
	const [state, setState] = useState({ progress: 0, name: '' })
	const [backgroundIndex, setBackgroundIndex] = useState(0)
	const [preloaded, setPreloaded] = useState<{ name: string; loaded: number; done: boolean }>({
		name: assets[0] ?? '',
		loaded: 0,
		done: false,
	})

	useEffect(() => {
		if (preloaded.done) return

		const timeout = setTimeout(async () => {
			await Promise.allSettled(
				assets.map(async src => {
					const response = await fetch(cdn(src), { cache: 'force-cache' })

					if (!response.ok) throw `Failed to preload: ${src}`

					await response.arrayBuffer()
					setPreloaded(prev => ({
						...prev,
						name: src,
						loaded: prev.loaded + 1,
					}))
				}),
			)
			setPreloaded(prev => ({ ...prev, done: true }))
		})

		return () => clearTimeout(timeout)
	}, [preloaded.done])

	useEffect(() => {
		// player.play()
		focusNui()

		const interval = setInterval(() => {
			setBackgroundIndex(index => (index + 1) % BACKGROUNDS.length)
		}, CROSSFADE_INTERVAL * 1000)

		const handler = (e: MessageEvent) => {
			const data = e.data as Log
			console.log({ data })
			asserts(data.eventName, `(eventName) doesn't exist in: ${JSON.stringify(data)}`)

			data?.message === 'fullyLoaded' && console.log(e.data.message)

			setState(prev => ({
				progress: data.eventName === 'loadProgress' ? (data.loadFraction as number) * 100 : prev.progress,
				name: typeof data.name === 'string' ? data.name : prev.name,
			}))
		}

		window.addEventListener('message', handler)

		return () => {
			window.removeEventListener('message', handler)
			clearInterval(interval)
			player.stop()
		}
	}, [])

	useEffect(() => {
		if (!import.meta.env.DEV || 'GetParentResourceName' in window || !preloaded.done) return

		let index = 0
		const interval = setInterval(() => {
			if (index >= debugEvents.length) {
				clearInterval(interval)
				return
			}
			window.postMessage(debugEvents[index++], window.location.origin)
		}, 10)

		return () => clearInterval(interval)
	}, [preloaded.done])

	const preloadProgress = assets.length ? (preloaded.loaded / assets.length) * 100 : 100
	const progress = preloaded.done ? state.progress : preloadProgress

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
			<Layout className='relative flex size-full items-end justify-center bg-linear-to-t from-neutral-950/50 to-transparent'>
				<motion.div
					className='w-[67vw] space-y-[1vh]'
					{...anim}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 2 }}
				>
					<p className='text-muted-foreground text-center text-xs uppercase italic'>
						{preloaded.done ? state.name : preloaded.name}
					</p>
					<Progress value={progress} className='outline outline-offset-1' />
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
