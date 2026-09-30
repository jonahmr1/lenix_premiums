import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Layout } from "./components/layout"
import './index.css'
import { Progress } from "./components/ui/progress"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { asserts, entries } from "@lenix/lenix"
import log from './log.json'
import dayjs from "dayjs"
import { CheckCircleIcon, CircleIcon, TerminalIcon } from "@phosphor-icons/react"
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "./components/ui/message-scroller"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card"
import { ThemeProvider } from "./components/theme-provider"
import { Spinner } from "./components/ui/spinner"

const STAGES = {
	loadingGameData: 'Loading Maps',
	initializeMaps: 'Preparing Maps',
	initializeSession: 'Preparing Session',
	startingResources: 'Starting Resources'
}

export function Loading() {
	const [state, setState] = useState<{
		progress: number
		data: Record<string, string | number | boolean>[]
		stage: keyof typeof STAGES
	}>({
		progress: 0,
		data: [],
		stage: 'loadingGameData'
	})
  useEffect(() => {
    const handler = (e: MessageEvent) => {
			const data = e.data
			asserts(data.eventName, '(eventName) doesn\'t exist')

      switch (data.eventName) {
        case "onDataFileEntry": {
					console.log('onDataFileEntry.name', e.data.name)
          console.log('onDataFileEntry.type', e.data.type)
          console.log('onDataFileEntry.isNew', e.data.isNew)
          break
        }
				case "performMapLoadFunction": {
					console.log('performMapLoadFunction.idx', e.data.idx)
					break
				}
				case "endDataFileEntries": {

					break
				}
				case "startInitFunction": {
					console.log('startInitFunction.type', e.data.type)
					break
				}
        case "startInitFunctionOrder": {
					console.log('startInitFunctionOrder.type', e.data.type)
          console.log('startInitFunctionOrder.order', e.data.order)
          console.log('startInitFunctionOrder.count', e.data.count)
          break
        }
        case "initFunctionInvoking": {
					console.log('initFunctionInvoking.type', e.data.type)
          console.log('initFunctionInvoking.name', e.data.name)
          console.log('initFunctionInvoking.idx', e.data.idx)
          break
        }
        case "initFunctionInvoked": {
					console.log('initFunctionInvoked.type', e.data.type)
          console.log('initFunctionInvoked.name', e.data.name)
          break
        }
        case "endInitFunction": {
					console.log('endInitFunction.type', e.data.type)
          break
        }
				case "onLogLine": {
					console.log('onLogLine.loadFraction', e.data.message)
					break
				}
        case "fullyLoaded": {
          console.log('fullyLoaded', e.data.message)
					break
        }
      }
    }
		let i = 0

		const interval = setInterval(() => {
			const data = log[i] as any
			setState(prev => ({
				progress: data.eventName === 'loadProgress' ? (data.loadFraction ?? 0) * 100 : prev.progress,
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
			i++
		}, 50)

		window.addEventListener("message", handler)
    return () => {
			window.removeEventListener("message", handler)
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
    <Layout className="h-screen w-full bg-background/90 flex items-end justify-center">
			<div className="w-[67vw] space-y-[1vh]">
				<div className="flex items-center justify-center gap-[0.5vw]">
					<p>{STAGES[state.stage]}</p>
					<Spinner />
				</div>
				<HoverCard openDelay={50}>
					<HoverCardTrigger>
						<Progress value={state.progress} />
					</HoverCardTrigger>
					<HoverCardContent className="w-[67vw]">
						<Card className="h-[50vh] justify-between">
							<CardHeader>
								<CardTitle className="flex gap-[1vw]">
									<TerminalIcon />
									<p>{STAGES[state.stage]}</p>
								</CardTitle>
								<CardDescription className="uppercase">
									Do not close the game
								</CardDescription>
								<CardAction>
									<p className="text-v-1.5">{state.progress.toFixed(2)}%</p>
								</CardAction>
							</CardHeader>
							<CardContent className="overflow-y-hidden h-full border-y">
								<MessageScrollerProvider autoScroll>
									<MessageScroller>
										<MessageScrollerViewport>
											<MessageScrollerContent className="gap-0">
												{state.data.map(({ time, eventName, ...data}, i) => eventName !== 'loadProgress' && (
													<MessageScrollerItem key={i} className="space-x-[1vw] text-muted-foreground font-normal">
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
												))}
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
  )
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark">
			<Loading />
		</ThemeProvider>
	</StrictMode>,
)