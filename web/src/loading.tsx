import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Layout } from "./components/layout"
import './index.css'
import { Progress } from "./components/ui/progress"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { random } from "@lenix/lenix"

export function Loading() {
	const [state, setState] = useState(0)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
			console.log('data', JSON.stringify(e.data))
      switch (e.data?.eventName) {
        case "loadProgress": {
          console.log('loadProgress.loadFraction', e.data.loadFraction)
          break
        }
        case "onLogLine": {
          console.log('onLogLine.loadFraction', e.data.message)
          break
        }
        case "startDataFileEntries": {
          console.log('startDataFileEntries.count', e.data.count)
          break
        }
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
          console.log("data file entries have ended")
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
        case "fullyLoaded": {
          console.log('fullyLoaded', e.data.message)
					break
        }
      }
    }

		const interval = setInterval(() => {
			setState(prev => prev < 100 ? prev + random(1, 10) : prev)
		}, 1000)

    window.addEventListener("message", handler)
    return () => {
			window.removeEventListener("message", handler)
			clearInterval(interval)
		}
  }, [])

  return (
    <Layout className="group/layout dark h-screen bg-background/98 w-full flex items-end justify-center py-h-15 gap-w-0.5">
			<div className="w-1/2 space-y-h-1">
				<Card className="w-full hidden group-has-[[data-slot=progress]:hover]/layout:flex group-has-[[data-slot=progress]:hover]/layout:animate-in group-has-[[data-slot=progress]:hover]/layout:fade-in">
					<CardHeader>
						<CardTitle>Card Title</CardTitle>
						<CardDescription>Card Description</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent>
						<p>Card Content</p>
					</CardContent>
					<CardFooter>
						<p>Card Footer</p>
					</CardFooter>
				</Card>
				<Progress
					value={state}
					className="*:data-[slot=progress-indicator]:duration-1000"
				/>
			</div>
		</Layout>
  )
}

createRoot(document.getElementById("root")!).render(<Loading />)
