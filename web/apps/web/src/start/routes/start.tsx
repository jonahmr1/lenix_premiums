import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"
import { fetchNui, fetchNuiServer, onKeyDown, unFocus } from "lenix/nui"
import type { Start } from "types"
import { useNavigate } from "react-router"
import { audiobility, toast } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { NavKbd } from "@/components/kbd"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

const backgrounds = [bg1, bg2, bg3, bg4]
const image = backgrounds[random(0, backgrounds.length - 1)]
const keys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'] as const

export const Starting = () => {
	const nav = useNavigate()

	const buttons = [
		{
			label: 'Competitive',
			onClick: () => {
				fetchNui<Start.Requests['selectMode']>('start:selectMode', { mode: 'competitive' })
				nav('/')
				unFocus()
			},
			disabled: true
		},
		{
			label: 'Outlaw',
			onClick: () => {
				fetchNui<Start.Requests['selectMode']>('start:selectMode', { mode: 'outlaw' })
				nav('/')
				unFocus()
			}
		},
		{
			label: 'Campaign',
			onClick: () => { },
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
			label: 'Quit',
			onClick: () => {
				fetchNuiServer<Start.Requests['exitGame']>('start:exitGame', {})
			},
			styles: 'text-red-700 hover:text-red-500 text-shadow-red-700 hover:drop-shadow-red-500/50'
		},
	]

	const filteredIndexes = buttons.flatMap((mode, i) => mode.disabled ? [] : [i])
	const [selected, setSelected] = useState(filteredIndexes[0])

	useEffect(() => {
		const disposes = [
			...keys.map(key => (
				onKeyDown(key, () => {
					switch (key) {
						case 'Enter': handleSubmit()
							break

						case 'Escape': buttons[5].onClick()
							break

						case 'ArrowDown': handleNav(key)
							break

						case 'ArrowUp': handleNav(key)
							break

						default:
					}
				})
			)),
		]

		return () => disposes.forEach(dispose => dispose())
	}, [selected])
	
	const handleSubmit = (index?: number) => {
		const selectedIndex = index ?? selected

		setSelected(selectedIndex)
		index === undefined && audiobility.onMouseDown()
		buttons[selectedIndex].onClick()
	}

	const handleNav = (key: typeof keys[number]) => {
		const previousSelection = filteredIndexes[filteredIndexes.indexOf(selected) - 1] ?? filteredIndexes[filteredIndexes.length - 1]
		const nextSelection = filteredIndexes[filteredIndexes.indexOf(selected) + 1] ?? filteredIndexes[0]

		setSelected(key === 'ArrowUp' ? previousSelection : nextSelection)
		audiobility.onMouseEnter()
	}

	return (
		<div className="relative h-screen p-0 overflow-hidden justify-start flex-row bg-linear-to-t from-neutral-950/50 to-transparent">
			<img
				src={image}
				className="absolute -z-1 size-full object-cover"
			/>
			<div
				className='absolute size-full -z-1 bg-linear-to-r from-black/50 to-transparent'
			/>
			<div className="flex flex-col size-full justify-between">
				<div className="w-1/3 flex flex-col gap-5 items-start px-25 h-full justify-center">
					{buttons.map((button, i) => (
						<Button
							key={i}
							variant='default'
							onClick={() => handleSubmit(i)}
							disabled={!filteredIndexes.includes(i)}
							className={`bg-transparent hover:bg-transparent uppercase drop-shadow-2xl hover:drop-shadow-white/50 duration-0 text-white/33 text-xl hover:text-white/66 cursor-pointer ${button.styles} ${selected === i && 'text-white text-shadow-current'}`}
							{...audiobility}
						>{button.label}</Button>
					))}
				</div>
				<KbdGroup className='absolute bottom-0 w-full flex items-end justify-between px-20 py-10'>
					<div className='flex'>
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
					</div>
					<NavKbd
						onClick={() => buttons[5].onClick()}
						icon='Esc'
						disable='click'
					>
						Quit
					</NavKbd>
				</KbdGroup>
			</div>
		</div>
	)
}