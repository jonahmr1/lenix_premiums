import { Layout } from "@workspace/ui/elements/layout"
import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"
import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"
import { fetchNui, onKeyDown } from "lenix/nui"
import { toast } from "@workspace/ui/lib/utils"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { ArrowDown, ArrowUp } from "lucide-react"
import click from '@workspace/ui/assets/start/click.mp3'
import hover from '@workspace/ui/assets/start/hover.mp3'
import { useNavigate } from "react-router"
import { NavKbd } from '@workspace/ui/elements/kbd'
import type { Starting } from "types"


const backgrounds = [bg1, bg2, bg3, bg4]
const keys = ['ArrowUp', 'ArrowDown', 'Enter'] as const
const image = backgrounds[random(0, backgrounds.length - 1)]

const playAudio = (src: 'hover' | 'click') => {
	const audio = new Audio(src === 'hover' ? hover : click)
	audio.volume = src === 'hover' ? 0.1 : 1.0
	 audio.play()
}

export const Main = () => {
	/* TODO: based on last used */
	const [selected, setSelected] = useState(0)
	const nav = useNavigate()

	useEffect(() => {
		const disposes = keys.map(key => (
			onKeyDown(key, () => {
				if (key === 'Enter') {
					handleSubmit()
					return
				}
				handleNav(key)
			})
		))

		return () => disposes.forEach(dispose => dispose())
	}, [selected])
	
	const modes = [
		{
			label: 'Competitive',
			onClick: () => {
				fetchNui<Starting.Requests['selectMode']>('starting:selectMode', { mode: 'competitive' })
			}
		},
		{
			label: 'Outlaw',
			onClick: () => {
				fetchNui<Starting.Requests['selectMode']>('starting:selectMode', { mode: 'outlaw' })
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
				fetchNui<Starting.Requests['exitGame']>('starting:exitGame', {})
			},
			styles: 'text-red-700 hover:text-red-500 text-shadow-red-700'
		},
	]

	const disabledIndex = modes.findIndex(mod => mod.disabled)

	const handleSubmit = (index?: number) => {
		const selectedIndex = index ?? selected

		setSelected(selectedIndex)
		playAudio('click')
		modes[selectedIndex].onClick()
	}

	const handleNav = (key: typeof keys[number]) => {
		setSelected(prev =>
			key === 'ArrowDown' ? prev === (modes.length - 1)
			? 0
			: prev + 1 === disabledIndex
				? prev + disabledIndex
				: prev + 1
			: prev === 0
			? modes.length - 1
			: prev - 1 === 2
			? prev - 2
			: prev - 1
		)
		playAudio('hover')
	}
	
	return (
		<Layout className="relative h-screen overflow-hidden justify-start flex-row bg-linear-to-t from-black/50 to-transparent">
			<img
				src={image}
				className="absolute -z-1 size-full object-cover"
			/>
			<div className="w-1/3 h-full bg-linear-to-r from-black/50 to-transparent">
				<div className="w-full flex flex-col gap-5 items-start px-25 h-full justify-center perspective-2">
					{modes.map((button, i) => (
						<Button
							key={i}
							variant='default'
							onClick={() => handleSubmit(i)}
							onMouseEnter={() => playAudio('hover')}
							disabled={i === disabledIndex}
							className={`bg-transparent hover:bg-transparent text-shadow-xs text-shadow-white/50 uppercase drop-shadow-2xl hover:drop-shadow-white/50 duration-0 text-white/33 text-xl hover:text-white/66 cursor-pointer ${button.styles} ${selected === i && 'text-white text-shadow-current'}`}
						>{button.label}</Button>
					))}
				</div>
			</div>
			<KbdGroup className="flex size-full items-end justify-end px-20 py-10 text-sm gap-5">
				<NavKbd
					onClick={() => handleNav('ArrowUp')}
					icon={<ArrowUp />}>
					Previous
				</NavKbd>
				<NavKbd
					onClick={() => handleNav('ArrowDown')}
					icon={<ArrowDown />}>
					Next
				</NavKbd>
			</KbdGroup>
		</Layout>
	)
}
