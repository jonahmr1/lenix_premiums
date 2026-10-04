import { useEffect } from "react"
import { focusNui, onNuiEmit } from "lenix/nui"
import type { Start } from "types"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { Pause } from "./pause"
import { Settings } from "./settings"
import { Hud } from "./hud"
import type { FileRoutesByTo } from "@/routeTree.gen"

const dev = false

const hudAllowedModes: ({
	[K in keyof FileRoutesByTo]:
		K extends `/${infer Segment}/${string}` ? Segment :
		K extends `/${infer Segment}` ? Segment :
		K
}[keyof FileRoutesByTo])[] = ['gang', 'police']

export function App() {
  const nav = useNavigate()
  const hash = useLocation({ select: location => location.hash })
	const path = useLocation({ select: (location) => location.pathname })
	const rootHash = path === '/' && hash

  useEffect(() => {
    dev && nav({ to: '/starting' })
    const disposes = [
      onNuiEmit<Start.Events["modeSelection"]>("start:modeSelection", () => {
        nav({ to: "/starting" })
        focusNui()
      }),
      onNuiEmit<Start.Events["pause"]>("start:pause", () => {
        focusNui()
        nav({ to: "/", hash: "pause", replace: true })
      }),
    ]

    return () => disposes.forEach((dispose) => dispose())
  }, [])

  return (
    <>
      {dev && <img
        src="light.png"
        className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
      />}
      {rootHash === "pause" && <Pause />}
      {rootHash === "settings" && <Settings />}
      {hudAllowedModes.some(route => route === path.split('/')[1]) && <Hud />}
			<div className="h-screen w-full bg-background/70">Abu 6s</div>
    </>
  )
}

export default App
