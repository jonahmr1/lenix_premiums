import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"
import { fetchNui, fetchNuiServer, unFocusNui } from "lenix/nui"
import type { Start } from "types"
import { useNavigate } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { Layout } from '@/components/layout'
import type { ButtonStart } from './types'

const backgrounds = [bg1, bg2, bg3, bg4]
const image = backgrounds[random(0, backgrounds.length - 1)]

export const Starting = () => {
	const nav = useNavigate()

	const buttons: ButtonStart[] = [
		{
			label: 'Competitive',
			onClick: () => {
				fetchNui<Start.Requests['selectMode']>('start:selectMode', { mode: 'competitive' })
				nav('/competitive/lobby')
				unFocusNui()
			},
		},
		{
			label: 'Outlaw',
			onClick: () => {
				fetchNui<Start.Requests['selectMode']>('start:selectMode', { mode: 'outlaw' })
				nav('/outlaw')
				unFocusNui()
			}
		},
		{
			label: 'Campaign',
			onClick: () => { },
			disabled: true
		},
		{
			label: 'Settings',
			onClick: () => nav('/settings'),
			styles: 'mt-10'
		},
		{
			label: 'Credit',
			onClick: () => nav('/credit')
		},
		{
			label: 'Quit',
			onClick: () => {
				fetchNuiServer<Start.Requests['exitGame']>('start:exitGame', {})
			},
			styles: 'text-red-700 hover:text-red-500 text-shadow-red-700 hover:drop-shadow-red-500/50 mt-5'
		},
	]

	return (
		<div className="relative h-screen p-0 overflow-hidden justify-start flex-row bg-linear-to-t from-neutral-950/50 to-transparent">
			<img
				src={image}
				className="absolute -z-1 size-full object-cover"
			/>
			<div
				className='absolute size-full -z-1 bg-linear-to-r from-black/50 to-transparent'
			/>
			<Layout type='p' className="relative flex flex-col size-full justify-between">
				<div className="flex flex-col gap-5 items-start h-9/10 justify-center">
					{buttons.map((button, i) => (
						<Button
							key={i}
							variant='default'
							onClick={() => button.onClick()}
							disabled={button.disabled}
							className={`bg-transparent hover:bg-transparent uppercase drop-shadow-2xl hover:drop-shadow-white/50 duration-0 text-light text-xl hover:text-neutral-300 cursor-pointer ${button.styles}`}
						>{button.label}</Button>
					))}
				</div>
			</Layout>
		</div>
	)
}