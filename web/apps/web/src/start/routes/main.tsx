import { DEV } from "@/App"
import { focus, onNuiEmit } from "lenix/nui"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import type { Start } from "types"

export const Main = () => {
	const nav = useNavigate()

	useEffect(() => {
		DEV(() => {
			nav('/pause')
		}, 'start')

		const disposes = [
			onNuiEmit<Start.Events['modeSelection']>('start:modeSelection', () => {
				nav('/start')
				focus()
			}),
			onNuiEmit<Start.Events['pause']>('start:pause', () => {
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
