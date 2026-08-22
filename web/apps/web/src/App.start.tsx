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
import { Toaster } from "@workspace/ui/components/sonner"
	
const backgrounds = [bg1, bg2, bg3, bg4]
const buttons = ['Outlaw', 'Competitive', 'Compaign', 'Options', 'Credit']
const keys = ['ArrowUp', 'ArrowDown', 'Enter'] as const
const image = backgrounds[random(0, backgrounds.length - 1)]

export const StartingMenu = () => {
	/* TODO: based on last used */
	const [selected, setSelected] = useState(0)

	const handleSelection = (index?: number) => {
		index !== undefined && setSelected(index)
		toast.info(`WinkyQx ${index}`)
	}

	useEffect(() => {
		const disposes = keys.map(key => (
			onKeyDown(key, () => {
				if (key === 'Enter') {
					handleSelection()
					return
				}
				const nextKey = key === 'ArrowDown' ? selected === (buttons.length - 1) ? 0 : selected + 1 : selected === 0 ? buttons.length - 1 : selected - 1
				console.log(true)
			
				setSelected(nextKey)
			})
		))

		return () => disposes.forEach(dispose => dispose())
	}, [selected])

	return (
		<Layout className="relative h-screen overflow-hidden justify-start flex-row">
			<img
				src={image}
				className="absolute -z-1 size-full object-cover"
			/>
			<div className="w-1/3 flex flex-col gap-5 items-start px-25 h-full justify-center bg-linear-to-r from-black/75 to-transparent">
				{buttons.map((btn, i) => (
					<Button
						key={i}
						disabled={false}
						variant='default'
						onClick={() => handleSelection(i)}
						className={`bg-transparent hover:bg-transparent drop-shadow-2xl hover:drop-shadow-white/50 duration-0 text-white/33 text-xl hover:text-white/66 cursor-pointer ${selected === i && 'text-white'}`}
					>{btn}</Button>
				))}
			</div>
			<div className="flex items-end size-full justify-end px-30 py-10">
				
			</div>
			<Toaster />
		</Layout>
	)
}
