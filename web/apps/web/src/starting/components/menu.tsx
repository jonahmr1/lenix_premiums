import { Button } from "@workspace/ui/components/button"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { ArrowDown, ArrowUp } from "lucide-react"
import { NavKbd } from '@workspace/ui/elements/kbd'
import { useEffect, useState } from "react"
import { onKeyDown } from "lenix/nui"
import { audiobility } from "@workspace/ui/lib/utils"

const keys = ['ArrowUp', 'ArrowDown', 'Enter'] as const

export const Menu = ({ buttons, kbds }: {
	buttons: {
		label: string
		onClick: () => void
		disabled?: boolean
		styles?: React.ComponentProps<'button'>['className']
	}[]
	kbds?: {
		onClick: () => void
		label: string
		disable: 'hover' | 'click'
		icon: React.ReactNode
	}[]
}) => {
	const filteredIndexes = buttons.flatMap((mode, i) => mode.disabled ? [] : [i])
	/* TODO: based on last used */
	const [selected, setSelected] = useState(filteredIndexes[0])

	useEffect(() => {
		const disposes = [
			...keys.map(key => (
				onKeyDown(key, () => {
					switch(key) {
						case 'Enter': handleSubmit()
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
		<div className="flex size-full">
			<div className="w-1/3 h-full bg-linear-to-r from-black/50 to-transparent">
				<div className="w-full flex flex-col gap-5 items-start px-25 h-full justify-center">
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
			<KbdGroup className="flex size-full items-end justify-end px-20 py-10 text-sm gap-3">
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
				{kbds?.map((kbd, i) => (
					<NavKbd
						key={i}
						onClick={kbd.onClick}
						icon={kbd.icon}
						disable={kbd.disable}
					>
						{kbd.label}
					</NavKbd>
				))}
			</KbdGroup>
		</div>
	)
}