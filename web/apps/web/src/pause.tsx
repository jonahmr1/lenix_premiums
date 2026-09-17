import { audiobility } from "@workspace/ui/lib/utils"
import { fetchNuiServer, onKeyDown, unFocus } from "lenix/nui"
import type { Start } from "types"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { NavKbd } from "@/components/kbd"
import type { ButtonStart } from "./types"
import { Layout } from "./components/layout"
import { ArrowRight } from "lucide-react"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { Header } from "./components/header"

export const Pause = () => {
	const nav = useNavigate()

	useEffect(() => {
		const dispose = onKeyDown('Escape', handleEscape)

		return dispose
	}, [])

	const handleEscape = (disableClickAudio?: true) => {
		disableClickAudio !== true && audiobility.onMouseDown()
		unFocus()
		nav(-1)
	}

	const buttons: ButtonStart[] = [
		{
			label: 'Resume',
			onClick: () => handleEscape(true)
		},
		{
			label: 'Settings',
			onClick: () => nav('/settings'),
		},
		{
			label: 'Leave',
			onClick: async () => {
				await fetchNuiServer<Start.Requests['logout']>('start:logout', {})
				nav('/start')
			}
		},
	]

	return (
		<Layout type="p" className='h-screen bg-linear-to-r from-neutral-950 to-transparent flex flex-col justify-between'>
			<div className="flex gap-md items-center">
				<div className="w-0.5 h-2/3 bg-foreground"></div>
				<Header>Paused</Header>
			</div>
			<ButtonGroup orientation='vertical' className="w-1/3 h-full justify-center">
				{buttons.map((button, i) => (
					<div className="flex group gap-xs not-last:border-b">
						<div className="h-full w-0.5 shrink-0 bg-foreground opacity-0 group-hover:opacity-100"></div>
						<Button
							key={i}
							variant='ghost'
							onClick={() => button.onClick()}
							size='lg'
							className='uppercase text-light italic font-semibold border-0 tracking-wider text-fluid-2.5 w-full justify-between py-md px-px'
						>
							<span className="px-lg">{button.label}</span>
							<ArrowRight className="opacity-0 [:hover>&]:opacity-100 size-md stroke-1 mr-sm" />
						</Button>
					</div>
				))}
			</ButtonGroup>
			<KbdGroup className='w-full flex'>
				<NavKbd
					onClick={() => buttons[0].onClick()}
					keybind="Escape"
					icon='Esc'
				>
					{buttons[0].label}
				</NavKbd>
			</KbdGroup>
		</Layout>
	)
}