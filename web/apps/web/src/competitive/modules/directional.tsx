import { DEV } from "@/App"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

export const DirectionalIndicator = () => {
	const [state, setState] = useState<{ img: string, degree: number }>()

	useEffect(() => {
		return DEV(() => {
			const interval = setInterval(() => {
				setState(prev => prev ? {
					...prev,
					degree: prev.degree < 360 ? prev.degree + 1 : 0
				} : {
					img: 'https://docs-backend.fivem.net/weapons/WEAPON_GRENADE.png',
					degree: 0
				})
			}, 25)
			
				return () => clearInterval(interval)
		}, 'competitive')
	}, [])

	if (!state) return null

	return <>
		<div
			className="absolute-center flex flex-col items-center gap-2 h-4/5"
			style={{
				rotate: `${state.degree}deg`
			}}
		>
			<FontAwesomeIcon icon={['fas', 'caret-up']} />
			<img
				src={state.img}
				className="w-1/3 brightness-200"
				style={{
					rotate: `${-90 + -state.degree}deg`
				}}
			/>
		</div>
	</>
}