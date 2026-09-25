import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Layout } from "./components/layout"
import './index.css'
import { Progress } from "./components/ui/progress"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { CaretDownIcon } from "@phosphor-icons/react"
import { random } from "@lenix/lenix"

export function Loading() {
	const [state, setState] = useState(0)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      switch (e.data?.eventName) {
        case "loadProgress": {
          console.log(e.data.loadFraction, 'loadProgress.loadFraction')
          break
        }
        case "onLogLine": {
          console.log(e.data.message, 'onLogLine.loadFraction')
          break
        }
        case "startDataFileEntries": {
          console.log(e.data.count, 'startDataFileEntries.count')
          break
        }
        case "onDataFileEntry": {
          console.log(e.data.name, 'onDataFileEntry.name')
          console.log(e.data.type, 'onDataFileEntry.type')
          console.log(e.data.isNew, 'onDataFileEntry.isNew')
          break
        }
        case "performMapLoadFunction": {
          console.log(e.data.idx, 'performMapLoadFunction.idx')
          break
        }
        case "endDataFileEntries": {
          console.log("data file entries have ended")
          break
        }
        case "startInitFunction": {
          console.log(e.data.type, 'startInitFunction.type')
          break
        }
        case "startInitFunctionOrder": {
          console.log(e.data.type, 'startInitFunctionOrder.type')
          console.log(e.data.order, 'startInitFunctionOrder.order')
          console.log(e.data.count, 'startInitFunctionOrder.count')
          break
        }
        case "initFunctionInvoking": {
          console.log(e.data.type, 'initFunctionInvoking.type')
          console.log(e.data.name, 'initFunctionInvoking.name')
          console.log(e.data.idx, 'initFunctionInvoking.idx')
          break
        }
        case "initFunctionInvoked": {
          console.log(e.data.type, 'initFunctionInvoked.type')
          console.log(e.data.name, 'initFunctionInvoked.name')
          break
        }
        case "endInitFunction": {
          console.log(e.data.type, 'endInitFunction.type')
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
