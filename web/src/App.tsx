import { useEffect, useState } from "react"
import { focusNui, onNuiEmit } from 'lenix/nui'
import type { Start } from 'types'
import { useNavigate } from "@tanstack/react-router"
import { Pause } from "./screens/pause"
import { Settings } from "./screens/settings"
import type { Overlay } from "./types"

export function App() {
	const nav = useNavigate()
	const [overlay, setOverlay] = useState<Overlay>(null)

	useEffect(() => {
		nav({ to: '/starting' })
		return onNuiEmit<Start.Events['modeSelection']>('start:modeSelection', () => {
			nav({ to: '/starting' })
			focusNui()
		})
	}, [])

  return (
		<>
			<img
				src='lobby.png'
				className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
			/>
			{overlay && overlay === 'pause' ? <Pause setOverlay={setOverlay} /> : <Settings setOverlay={setOverlay} />}
		</>
  )
}

export default App
