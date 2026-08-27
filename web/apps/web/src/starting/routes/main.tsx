import { focus, onNuiEmit } from "lenix/nui"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import type { Starting } from "types"

export const Main = () => {
	const nav = useNavigate()

	useEffect(() => {
		onNuiEmit<Starting.Events['modeSelection']>('starting:modeSelection', () => {
			nav('/menu')
			focus()
		})
	}, [])

	return <></>
}
