import { Layout } from "@workspace/ui/elements/layout"
import { Button } from "@workspace/ui/components/button"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { ArrowDown, ArrowUp } from "lucide-react"
import { NavKbd } from '@workspace/ui/elements/kbd'
import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"
import { useEffect, useState } from "react"
import { fetchNui, onKeyDown, unFocus } from "lenix/nui"
import { audiobility, toast } from "@workspace/ui/lib/utils"
import { useNavigate } from "react-router"
import type { Starting } from "types"

const backgrounds = [bg1, bg2, bg3, bg4]
const image = backgrounds[random(0, backgrounds.length - 1)]
const keys = ['ArrowUp', 'ArrowDown', 'Enter'] as const

export const Menu = () => {
	/* TODO: based on last used */
	const [selected, setSelected] = useState(1)
	const nav = useNavigate()

	useEffect(() => {
		const disposes = [
			...keys.map(key => (
				onKeyDown(key, () => {
					if (key === 'Enter') {
						handleSubmit()
						return
					}
					handleNav(key)
				})
			)),
		]

		return () => disposes.forEach(dispose => dispose())
	}, [selected])
	
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
				fetchNui<Starting.Requests['exitGame']>('starting:exitGame', {})
			},
			styles: 'text-red-700 hover:text-red-500 text-shadow-red-700 hover:drop-shadow-red-500/50'
		},
	]

	const filteredIndexes = buttons.flatMap((mode, i) => mode.disabled ? [] : [i])
	
	const handleSubmit = (index?: number) => {
		const selectedIndex = index ?? selected

		setSelected(selectedIndex)
		audiobility.onMouseDown()
		buttons[selectedIndex].onClick()
	}

	const handleNav = (key: typeof keys[number]) => {
		const previousSelection = filteredIndexes[filteredIndexes.indexOf(selected) - 1] ?? filteredIndexes[filteredIndexes.length - 1]
		const nextSelection = filteredIndexes[filteredIndexes.indexOf(selected) + 1] ?? filteredIndexes[0]

		setSelected(key === 'ArrowUp' ? previousSelection : nextSelection)
		audiobility.onMouseEnter()
	}
	
	return (
		<Layout className="relative h-screen overflow-hidden justify-start flex-row bg-linear-to-t from-black/50 to-transparent">
			<img
				src={image}
				className="absolute -z-1 size-full object-cover"
			/>
			<div className="w-1/3 h-full bg-linear-to-r from-black/50 to-transparent">
				<div className="w-full flex flex-col gap-5 items-start px-25 h-full justify-center perspective-2">
					{buttons.map((button, i) => (
						<Button
							key={i}
							variant='default'
							onClick={() => handleSubmit(i)}
							disabled={!filteredIndexes.includes(i)}
							className={`bg-transparent hover:bg-transparent text-shadow-xs text-shadow-white/50 uppercase drop-shadow-2xl hover:drop-shadow-white/50 duration-0 text-white/33 text-xl hover:text-white/66 cursor-pointer ${button.styles} ${selected === i && 'text-white text-shadow-current'}`}
							{...audiobility}
						>{button.label}</Button>
					))}
				</div>
			</div>
			<KbdGroup className="flex size-full items-end justify-end px-20 py-10 text-sm gap-5">
				<NavKbd
					onClick={() => handleNav('ArrowUp')}
					icon={<ArrowUp />}
					disable='click'
				>
					Previous
				</NavKbd>
				<NavKbd
					onClick={() => handleNav('ArrowDown')}
					icon={<ArrowDown />}
					disable='click'
				>
					Next
				</NavKbd>
			</KbdGroup>
		</Layout>
	)
}