import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Layout } from "./components/layout"
import './index.css'
import { Progress } from "./components/ui/progress"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { asserts, entries } from "@lenix/lenix"
import dayjs from "dayjs"
import { CheckCircleIcon, CircleIcon, TerminalIcon } from "@phosphor-icons/react"
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "./components/ui/message-scroller"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card"
import { ThemeProvider } from "./components/theme-provider"
import { Spinner } from "./components/ui/spinner"
import { AnimatePresence, motion } from "motion/react"
import { Howl } from 'howler'
import { cdn } from "./lib"
import assets from './lib/assets'
import { focusNui } from "lenix/nui"

type Log = Record<string, string | number | boolean>

const STAGES = {
	preloadingAssets: 'Preloading the assets',
	loadingGameData: 'Loading Maps',
	initializeMaps: 'Preparing Maps',
	initializeSession: 'Preparing Session',
	startingResources: 'Starting Resources',
}
const BACKGROUNDS = [
	'assets/loading/ls-1.png',
	'assets/loading/ls-2.png',
	'assets/loading/ls-3.png',
	'assets/loading/ls-4.png',
] as const
const CROSSFADE_INTERVAL = 10

const prePlayer = new Howl({
	src: cdn('assets/loading/loading.mp3'),
	volume: 0.5
})
const player = new Howl({
	src: cdn('assets/loading/welcome_to_los_santos.mp3'),
	volume: 0.0
})


export function Loading() {
	const [state, setState] = useState<{
		progress: number
		data: Log[]
		stage: keyof typeof STAGES
	}>({
		progress: 0,
		data: [],
		stage: 'loadingGameData'
	})
	const [backgroundIndex, setBackgroundIndex] = useState(0)
	const [preloaded, setPreloaded] = useState({ asset: 'Starting downloads…', loaded: 0, done: false, data: [] as Log[] })

  useEffect(() => {
		if (!preloaded.done) {
			prePlayer.play()
			const timeout = setTimeout(async () => {
				await Promise.allSettled(
					assets.map(async src => {
						const response = await fetch(cdn(src), { cache: 'force-cache' })
						
						if (!response.ok) throw `Failed to preload: ${src}`
						
						await response.arrayBuffer()
						setPreloaded(prev => ({
							...prev,
							asset: src,
							loaded: prev.loaded + 1,
							data: [...prev.data, { eventName: 'preloadingAssets', asset: src, time: dayjs().format("HH:mm:ss:SSS") }],
						}))
					}),
				)
				setPreloaded(prev => ({ ...prev, done: true }))
			})
			return () => {
				clearTimeout(timeout)
				prePlayer.stop()
			}
		}

		prePlayer.stop()
		player.play()
		return () => { player.stop() }
	}, [preloaded.done])

	useEffect(() => {
		focusNui()

		const interval = setInterval(() => {
			setBackgroundIndex(index => (index + 1) % BACKGROUNDS.length)
		}, CROSSFADE_INTERVAL * 1000)

    const handler = (e: MessageEvent) => {
			const data = e.data as Log
			asserts(data.eventName, `(eventName) doesn't exist, found: ${JSON.stringify(data)}`)
			
			data?.message === 'fullyLoaded' && console.log(e.data.message)

			setState(prev => ({
				progress: data.eventName === 'loadProgress' ? data.loadFraction as number * 100 : prev.progress,
				data: [...prev.data, { ...data, time: dayjs().format("HH:mm:ss:SSS") }],
				stage:
					data.eventName === "startInitFunction"
					? data.type === "INIT_AFTER_MAP_LOADED"
						? "initializeMaps"
						: data.type === "INIT_SESSION"
							? "initializeSession"
							: prev.stage
					: data.eventName === "onLogLine"
						? "startingResources"
						: prev.stage
			}))
    }
		
		window.addEventListener("message", handler)

    return () => {
			window.removeEventListener("message", handler)
			clearInterval(interval)
		}
	}, [])

	const preloadProgress = assets.length ? preloaded.loaded / assets.length * 100 : 100
	const progress = preloaded.done ? state.progress : preloadProgress
	const currentStage = preloaded.done ? state.stage : 'preloadingAssets'
	const phase = preloaded.done ? 'Step 2 of 2: Loading game' : 'Step 1 of 2: Downloading assets'
	const logs = preloaded.done ? state.data : preloaded.data

	const stageOrder = (Object.keys(STAGES) as (keyof typeof STAGES)[])
		.filter(stage => preloaded.done ? stage !== 'preloadingAssets' : stage === 'preloadingAssets')

	const StagesRecord = () => {
		const currentIndex = stageOrder.indexOf(currentStage)

		return (
			<div className="space-y-1">
				{stageOrder.map((stage, index) => (
					<div key={stage} className="flex items-center gap-[0.5vw]">
						{index < currentIndex ? <CheckCircleIcon className="text-brand" /> : index === currentIndex ? <Spinner /> : <CircleIcon />}
						<span className={index > currentIndex ? "text-muted-foreground" : "text-foreground"}>
							{STAGES[stage]}
						</span>
					</div>
				))}
			</div>
		)
	}

  return (
		<div className="h-screen bg-background relative overflow-hidden">
			<AnimatePresence>
				<motion.img
					key={backgroundIndex}
					src={cdn(BACKGROUNDS[backgroundIndex])}
					className="absolute size-full object-cover"
					initial={{ opacity: 0, scale: 1 }}
					animate={{ opacity: 1, scale: 1.1 }}
					exit={{ opacity: 0, scale: 1.15 }}
					transition={{
						opacity: { duration: CROSSFADE_INTERVAL / 3, ease: 'easeInOut' },
						scale: { duration: CROSSFADE_INTERVAL, ease: 'linear' },
					}}
				/>
			</AnimatePresence>
			<Layout className="relative flex size-full items-end justify-center bg-linear-to-t from-neutral-950/50 to-transparent">
				<div className="w-[67vw] space-y-[1vh]">
					<div className="flex items-center justify-center gap-[0.5vw] uppercase italic">
						<p>{phase}</p>
						<Spinner />
					</div>
					<HoverCard openDelay={50}>
						<HoverCardTrigger>
							<Progress value={progress} className="outline outline-offset-1" />
						</HoverCardTrigger>
						<HoverCardContent className="w-[67vw]">
							<Card className="h-[50vh] justify-between">
								<CardHeader>
									<CardTitle className="flex gap-[1vw]">
										<TerminalIcon />
										<p>{phase}</p>
									</CardTitle>
									<CardDescription className="uppercase">
										{preloaded.done ? 'Asset preloading finished. Please keep the game open.' : 'Downloading files. Game loading follows this step.'}
									</CardDescription>
									<CardAction>
										<p className="text-v-1.5">{progress.toFixed(2)}%</p>
									</CardAction>
								</CardHeader>
								<CardContent className="h-full overflow-y-hidden border-y">
									<MessageScrollerProvider autoScroll>
										<MessageScroller>
											<MessageScrollerViewport>
												<MessageScrollerContent className="gap-0">
													{logs.map(
														({ time, eventName, ...data }, i) =>
															eventName !== 'loadProgress' && (
																<MessageScrollerItem key={i} className="space-x-[1vw] font-normal text-muted-foreground">
																	<span className="text-muted-foreground/50">[{time}]</span>
																	<span className="text-brand">[{eventName}]</span>
																	<span className="space-x-[0.5vw]">
																		{entries(data).map(([key, value], i) => (
																			<span key={i}>
																				<span>{key}: </span>
																				<span className="font-medium">{value.toString()}</span>
																			</span>
																		))}
																	</span>
																</MessageScrollerItem>
															)
													)}
												</MessageScrollerContent>
											</MessageScrollerViewport>
											<MessageScrollerButton />
										</MessageScroller>
									</MessageScrollerProvider>
								</CardContent>
								<CardFooter>
									<StagesRecord />
								</CardFooter>
							</Card>
						</HoverCardContent>
					</HoverCard>
				</div>
			</Layout>
		</div>
  )
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark">
			<Loading />
		</ThemeProvider>
	</StrictMode>,
)
