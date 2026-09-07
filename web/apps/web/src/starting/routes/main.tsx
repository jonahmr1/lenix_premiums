import { DEV } from "@/App"
import { focus, onNuiEmit } from "lenix/nui"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import type { Starting } from "types"

export const Main = () => {
	const nav = useNavigate()

	useEffect(() => {
		DEV(() => {
			nav('/pause')
		}, 'start')
		
		const disposes = [
			onNuiEmit<Starting.Events['modeSelection']>('starting:modeSelection', () => {
				nav('/start')
				focus()
			}),
			onNuiEmit<Starting.Events['pause']>('starting:pause', () => {
				nav('/pause')
				focus()
			})
		]

		return () => {
			for (const dispose of disposes) dispose()
		}
	}, [])

	return <></>
}
