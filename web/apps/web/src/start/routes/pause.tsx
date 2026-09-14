import { audiobility, toast } from "@workspace/ui/lib/utils"
import { fetchNuiServer, onKeyDown, unFocus } from "lenix/nui"
import type { Start } from "types"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import type { ButtonStart } from "../types"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { NavKbd } from "@/components/kbd"

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
			label: 'Options',
			onClick: () => nav('/start/options'),
			styles: 'mt-10'
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
		<div className='h-screen bg-neutral-950/40'>
			<div className="flex flex-col size-full justify-between">
				<div className="w-1/3 flex flex-col gap-5 items-start px-25 h-full justify-center">
					{buttons.map((button, i) => (
						<Button
							key={i}
							variant='default'
							onClick={() => button.onClick()}
							className={`bg-transparent hover:bg-transparent uppercase drop-shadow-2xl hover:drop-shadow-white/50 duration-0 text-light text-xl hover:text-neutral-300 cursor-pointer ${button.styles}`}
							{...audiobility}
						>{button.label}</Button>
					))}
				</div>
				<KbdGroup className='absolute bottom-0 w-full flex items-end justify-end px-20 py-10'>
					<NavKbd
						onClick={() => buttons[0].onClick()}
						keybind="Escape"
						icon='Esc'
					>
						{buttons[0].label}
					</NavKbd>
				</KbdGroup>
			</div>
		</div>
	)
}