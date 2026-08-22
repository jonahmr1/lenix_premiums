import { Layout } from "@workspace/ui/elements/layout"
import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"
import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"
import { onKeyDown } from "lenix/nui"
	
const backgrounds = [bg1, bg2, bg3, bg4]
const buttons = ['Outlaw', 'Competitive', 'Compaign', 'Options', 'Credit']
const keys = ['ArrowUp', 'ArrowDown'] as const

export const StartingMenu = () => {
	/* TODO: based on last used */
	const [selected, setSelected] = useState(0)

	useEffect(() => {
		const disposes = keys.map(key => (
			onKeyDown(key, () => {
				const nextKey = key === 'ArrowDown' ? selected === (buttons.length - 1) ? 0 : selected + 1 : selected === 0 ? buttons.length - 1 : selected - 1
				console.log(true)
			
				setSelected(nextKey)
			})
		))

		return () => disposes.forEach(dispose => dispose())
	}, [selected])

	return (
		<Layout className="relative h-screen overflow-hidden items-start">
			<img
				src={backgrounds[random(0, backgrounds.length - 1)]}
				className="absolute -z-1 object-cover"
			/>
			<div className="w-1/3 flex flex-col gap-5 items-start px-25 h-full justify-center bg-linear-to-r from-black/75 to-transparent">
				{buttons.map((btn, i) => (
					<Button
						key={i}
						disabled={false}
						variant='default'
						className={`bg-transparent hover:bg-transparent text-white/33 text-xl hover:text-white/66 cursor-pointer ${selected === i && 'text-white'}`}
					>{btn}</Button>
				))}
			</div>
		</Layout>
	)
}
