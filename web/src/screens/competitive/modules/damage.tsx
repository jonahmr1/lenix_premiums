import { useEffect, useState } from "react"
import indicator from '@workspace/ui/assets/competitive/damage/damage-indicator.png'

export const DamageIndicator = () => {
	const [state, setState] = useState<number>()

	useEffect(() => {
		const interval = setInterval(() => {
			setState(prev => prev ? prev < 360 ? prev + 1 : 0 : 1)
		}, 25)

		return () => clearInterval(interval)
	}, [])

	if (!state) return null

	return <>
		<div
			className="absolute-center h-2/3 w-1/3 place-items-center"
			style={{
				rotate: `${state}deg`
			}}
		>
			<img
				src={indicator}
				className="w-1/2"
			/>
		</div>
	</>
}