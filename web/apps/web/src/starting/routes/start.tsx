import { Layout } from "@workspace/ui/elements/layout"
import { Menu } from "../components/menu"
import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"
import { fetchNui, fetchNuiServer, unFocus } from "lenix/nui"
import type { Starting } from "types"
import { useNavigate } from "react-router"
import { toast } from "@workspace/ui/lib/utils"

const backgrounds = [bg1, bg2, bg3, bg4]
const image = backgrounds[random(0, backgrounds.length - 1)]

export const Start = () => {
	const nav = useNavigate()
	
	const buttons = [
		{
			label: 'Competitive',
			onClick: () => {
				fetchNui<Starting.Requests['selectMode']>('starting:selectMode', { mode: 'competitive' })
				nav('/')
				unFocus()
			},
			disabled: true
		},
		{
			label: 'Outlaw',
			onClick: () => {
				fetchNui<Starting.Requests['selectMode']>('starting:selectMode', { mode: 'outlaw' })
				nav('/')
				unFocus()
			}
		},
		{
			label: 'Campaign',
			onClick: () => {},
			disabled: true
		},
		{
			label: 'Options',
			onClick: () => toast.info('Coming soon')
		},
		{
			label: 'Credit',
			onClick: () => nav('/credit')
		},
		{
			label: 'Exit Game',
			onClick: () => {
				fetchNuiServer<Starting.Requests['exitGame']>('starting:exitGame', {})
			},
			styles: 'text-red-700 hover:text-red-500 text-shadow-red-700 hover:drop-shadow-red-500/50'
		},
	]

	return (
		<Layout className="relative h-screen overflow-hidden justify-start flex-row bg-linear-to-t from-black/50 to-transparent">
			<img
				src={image}
				className="absolute -z-1 size-full object-cover"
				/>
			<Menu buttons={buttons} />
		</Layout>
	)
}