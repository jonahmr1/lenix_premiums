import { Layout } from "@workspace/ui/elements/layout"
import { Menu } from "../components/menu"
import { audiobility, toast } from "@workspace/ui/lib/utils"
import { fetchNuiServer, onKeyDown, unFocus } from "lenix/nui"
import type { Starting } from "types"
import { useNavigate } from "react-router"
import { useEffect } from "react"

export const Pause = () => {
	const nav = useNavigate()

	useEffect(() => {
		const dispose = onKeyDown('Escape', handleEscape)

		return dispose
	}, [])

	const handleEscape = (disableClickAudio?: true) => {
		disableClickAudio !== true && audiobility.onMouseDown()
		unFocus()
		nav('/')
	}

	const buttons = [
		{
			label: 'Resume',
			onClick: () => handleEscape(true)
		},
		{
			label: 'Options',
			onClick: () => toast.info('Coming soon')
		},
		{
			label: 'Main Menu',
			onClick: async () => {
				await fetchNuiServer<Starting.Requests['logout']>('starting:logout', {})
				nav('/start')
			}
		},
	]
	
	return (
		<Layout className='h-screen bg-black/50'>
			<Menu buttons={buttons} kbds={[
				{
					label: 'Resume',
					icon: 'Esc',
					disable: 'click',
					onClick: handleEscape
				}
			]} />
		</Layout>
	)
}