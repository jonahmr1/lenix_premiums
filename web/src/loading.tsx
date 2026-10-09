import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Layout } from "./components/layout"
import './index.css'
import { Progress } from "./components/ui/progress"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { asserts, entries } from "@lenix/lenix"
// import log from './log.json'
import dayjs from "dayjs"
import { CheckCircleIcon, CircleIcon, TerminalIcon } from "@phosphor-icons/react"
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "./components/ui/message-scroller"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card"
import { ThemeProvider } from "./components/theme-provider"
import { Spinner } from "./components/ui/spinner"

import { AnimatePresence, motion } from "motion/react"
import { Howl } from 'howler'
import { cdn } from "./lib"
import { focusNui } from "lenix/nui"

type Log = Record<string, string | number | boolean>

const STAGES = {
	loadingGameData: 'Loading Maps',
	initializeMaps: 'Preparing Maps',
	initializeSession: 'Preparing Session',
	startingResources: 'Starting Resources'
}
const BACKGROUNDS = [
	'assets/loading/ls-1.png',
	'assets/loading/ls-2.png',
	'assets/loading/ls-3.png',
	'assets/loading/ls-4.png',
]
const CROSSFADE_INTERVAL = 10

const player = new Howl({
	src: cdn('assets/loading/loading.mp3'),
	volume: 0.5
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

  useEffect(() => {
		focusNui()
		
    const handler = (e: MessageEvent) => {
			const data = e.data as Log
			asserts(data.eventName, '(eventName) doesn\'t exist')
			
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

		const interval = setInterval(() => {
			setBackgroundIndex(index => (index + 1) % BACKGROUNDS.length)
		}, CROSSFADE_INTERVAL * 1000)

		player.play()

		// let i = 0
		// const interval$ = setInterval(() => {
		// 	const data = log[i] as any
		// 	if (!data) {
		// 		clearInterval(interval)
		// 		return
		// 	}

		// 	setState(prev => ({
		// 		progress: data.eventName === 'loadProgress' ? data.loadFraction as number * 100 : prev.progress,
		// 		data: [...prev.data, { ...data, time: dayjs().format("HH:mm:ss:SSS") }],
		// 		stage:
		// 			data.eventName === "startInitFunction"
		// 			? data.type === "INIT_AFTER_MAP_LOADED"
		// 				? "initializeMaps"
		// 				: data.type === "INIT_SESSION"
		// 					? "initializeSession"
		// 					: prev.stage
		// 			: data.eventName === "onLogLine"
		// 				? "startingResources"
		// 				: prev.stage
		// 	}))
		// 	i++
		// }, 50)

    return () => {
			window.removeEventListener("message", handler)
			// clearInterval(interval$)
			clearInterval(interval)
		}
	}, [])

	const stageOrder = Object.keys(STAGES) as (keyof typeof STAGES)[]

	const StagesRecord = () => {
		const currentIndex = stageOrder.indexOf(state.stage)

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
						<p>{STAGES[state.stage]}</p>
						<Spinner />
					</div>
					<HoverCard openDelay={50}>
						<HoverCardTrigger>
							<Progress value={state.progress} className="outline outline-offset-1" />
						</HoverCardTrigger>
						<HoverCardContent className="w-[67vw]">
							<Card className="h-[50vh] justify-between">
								<CardHeader>
									<CardTitle className="flex gap-[1vw]">
										<TerminalIcon />
										<p>{STAGES[state.stage]}</p>
									</CardTitle>
									<CardDescription className="uppercase">Do not close the game</CardDescription>
									<CardAction>
										<p className="text-v-1.5">{state.progress.toFixed(2)}%</p>
									</CardAction>
								</CardHeader>
								<CardContent className="h-full overflow-y-hidden border-y">
									<MessageScrollerProvider autoScroll>
										<MessageScroller>
											<MessageScrollerViewport>
												<MessageScrollerContent className="gap-0">
													{state.data.map(
														({ time, eventName, ...data }, i) =>
															eventName !== 'loadProgress' && (
																<MessageScrollerItem key={i} className="space-x-[1vw] font-normal text-muted-foreground">
																	<span className="text-muted-foreground/50">[{time}]</span>
																	<span className="text-brand">[{eventName}]</span>
																	<span className="space-x-[0.5vw]">
																		{entries(data).map(([key, value], i) => (
																			<span key={i}>
																				<span>{key}: </span>
																				<span className="font-semibold">{value.toString()}</span>
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
