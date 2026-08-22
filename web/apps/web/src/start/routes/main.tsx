import { Layout } from "@workspace/ui/elements/layout"
import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"
import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"
import { onKeyDown } from "lenix/nui"
import { toast } from "@workspace/ui/lib/utils"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { ArrowDown, ArrowUp } from "lucide-react"
import click from '@workspace/ui/assets/start/click.mp3'
import hover from '@workspace/ui/assets/start/hover.mp3'
import { useNavigate } from "react-router"
import { NavKbd } from '@workspace/ui/elements/kbd'


const backgrounds = [bg1, bg2, bg3, bg4]
const keys = ['ArrowUp', 'ArrowDown', 'Enter'] as const
const image = backgrounds[random(0, backgrounds.length - 1)]

const playAudio = (src: 'hover' | 'click') => {
	const audio = new Audio(src === 'hover' ? hover : click)
	audio.volume = src === 'hover' ? 0.1 : 1.0
	void audio.play()
}

export const Main = () => {
	/* TODO: based on last used */
	const [selected, setSelected] = useState(0)
	const [disabled, setDisabled] = useState(false)
	const nav = useNavigate()
	
	const buttons = [
		{
			label: 'Competitive',
			onClick: () => toast.info('WinkyQx')
		},
		{
			label: 'Outlaw',
			onClick: () => toast.info('WinkyQx')
		},
		{
			label: 'Campaign',
			onClick: () => toast.info('WinkyQx')
		},
		{
			label: 'Options',
			onClick: () => toast.info('WinkyQx')
		},
		{
			label: 'Credit',
			onClick: () => nav('/credit')
		},
	]

	const handleSelection = (index?: number) => {
		index !== undefined && setSelected(index)
		playAudio('click')
		setDisabled(true)
	}

	const handleNav = (key: typeof keys[number]) => {
		setSelected(prev => key === 'ArrowDown' ? prev === (buttons.length - 1) ? 0 : prev + 1 : prev === 0 ? buttons.length - 1 : prev - 1)
		playAudio('hover')
	}

	useEffect(() => {
		const disposes = keys.map(key => (
			onKeyDown(key, () => {
				if (key === 'Enter') {
					handleSelection()
					return
				}
				handleNav(key)
			})
		))

		return () => disposes.forEach(dispose => dispose())
	}, [])
	
	return (
		<Layout className="relative h-screen overflow-hidden justify-start flex-row bg-linear-to-t from-black/50 to-transparent">
			<img
				src={image}
				className="absolute -z-1 size-full object-cover"
			/>
			<div className="w-1/3 flex flex-col gap-5 items-start px-25 h-full justify-center bg-linear-to-r from-black/50 to-transparent">
				{buttons.map((button, i) => (
					<Button
						key={i}
						disabled={disabled}
						variant='default'
						onClick={() => {
							handleSelection(i)
							button.onClick()
						}}
						onMouseEnter={() => playAudio('hover')}
						className={`bg-transparent hover:bg-transparent uppercase drop-shadow-2xl hover:drop-shadow-white/50 duration-0 text-white/33 text-lg hover:text-white/66 cursor-pointer outline- ${selected === i && 'text-white'}`}
					>{button.label}</Button>
				))}
			</div>
			<KbdGroup className="flex size-full items-end justify-end px-30 py-10 text-sm gap-5">
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