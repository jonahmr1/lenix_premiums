import { waste } from '@lenix/lenix'
import { useEffect, useState } from 'react'
import low from '@workspace/ui/assets/competitive/damage/low.png'
import high from '@workspace/ui/assets/competitive/damage/high.png'
import heartbeat from '@workspace/ui/assets/competitive/damage/heartbeat.mp3'
import { Howl } from 'howler'
import { DEV } from '@/App'

const player = new Howl({
	src: heartbeat,
	volume: 0.05
})

export const DamageEffect = () => {
	const [strength, setStrength] = useState(0)

	useEffect(() => {
		if (DEV('competitive')) {
			setTimeout(async () => {
				for (const i of Array(100).keys()) {
					await waste(50)
					setStrength(i)
				}
				await waste(2000)

				for (const i of Array(100).keys()) {
					await waste(50)
					setStrength(99 - i)
				}
			})
		}
	}, [])

	useEffect(() => {
		player.rate(0.7 + strength * 0.011)
		if (strength > 0) {
			player.loop(true)

			if (!player.playing()) player.play()
		} else {
			player.stop()
		}
	}, [strength])

	return (
		<>
			<img
				src={low}
				className={`absolute size-full object-cover transition-opacity duration-400 ${strength < 50 ? 'opacity-100' : 'opacity-0'}`}
			/>
			<img
				src={high}
				className={`absolute size-full object-cover transition-opacity duration-2000 ${strength < 50 ? 'opacity-0' : 'opacity-100'}`}
			/>
		</>
	)
}