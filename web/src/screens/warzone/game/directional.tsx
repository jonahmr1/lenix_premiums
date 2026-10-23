import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

export const DirectionalIndicator = () => {
	const [state, setState] = useState<{ img: string; degree: number; distance: number }>()

	useEffect(() => {
		let value = 0
		let direction = 1

		const distance = () => {
			if (value >= 100) direction = -1
			if (value <= 0) direction = 1
			return (value += direction)
		}

		const interval = setInterval(() => {
			const nextDistance = distance()
			setState(prev =>
				prev
					? {
							...prev,
							degree: prev.degree < 360 ? prev.degree + 1 : 0,
							distance: nextDistance,
						}
					: {
							img: 'https://docs-backend.fivem.net/weapons/WEAPON_GRENADE.png',
							degree: 0,
							distance: 100,
						},
			)
		}, 25)

		return () => clearInterval(interval)
	}, [])

	if (!state) return null

	return (
		<>
			<div
				className='absolute-center flex flex-col items-center gap-2'
				style={{
					rotate: `${state.degree}deg`,
					height: `${state.distance / 3}%`,
				}}
			>
				<FontAwesomeIcon icon={['fas', 'caret-up']} />
				<img
					src={state.img}
					className='w-1/3 brightness-200'
					style={{
						rotate: `${-90 + -state.degree}deg`,
					}}
				/>
			</div>
		</>
	)
}
