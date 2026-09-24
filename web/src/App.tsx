import { useEffect } from "react"
import { focusNui, onNuiEmit } from 'lenix/nui'
import type { Start } from 'types'
import { useNavigate } from "@tanstack/react-router"
import { Pause } from "./screens/pause"
import { Settings } from "./screens/settings"

export function App() {
	const nav = useNavigate()

	useEffect(() => onNuiEmit<Start.Events['modeSelection']>('start:modeSelection', () => {
		nav({ to: '/starting' })
		focusNui()
	}), [])

  return (
		<>
			<img
				src='lobby.png'
				className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
			/>
			<Pause />
			<Settings />
		</>
  )
}

export default App
