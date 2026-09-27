import { useEffect } from "react"
import { focusNui, onNuiEmit } from "lenix/nui"
import type { Start } from "types"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { Pause } from "./pause"
import { Settings } from "./settings"

export function App() {
  const nav = useNavigate()
  const hash = useLocation({ select: location => location.hash })
	const rootHash = useLocation({ select: (location) => location.pathname }) === '/' && hash

  useEffect(() => {
    nav({ to: '/outlaw/ipad' })
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
      <img
        src="light.png"
        className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
      />
      {rootHash === "pause" && <Pause />}
      {rootHash === "settings" && <Settings />}
    </>
  )
}

export default App
