import { Layout } from "@workspace/ui/elements/layout"
import { Menu } from "../components/menu"
import { toast } from "@workspace/ui/lib/utils"
import { fetchNuiServer } from "lenix/nui"
import type { Starting } from "types"
import { useNavigate } from "react-router"

export const Pause = () => {
	const nav = useNavigate()

	const buttons = [
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
		<Layout className='h-screen backdrop-blur-xs'>
			<Menu buttons={buttons} />
		</Layout>
	)
}