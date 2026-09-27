import { waste } from '@lenix/lenix'
import { useEffect, useState } from 'react'
import low from '@/assets/competitive/effect/low.png'
import high from '@/assets/competitive/effect/high.png'
import heartbeat from '@/assets/competitive/effect/heartbeat.mp3'
import { Howl } from 'howler'

const player = new Howl({
	src: heartbeat,
	volume: 0.5
})

export const DamageEffect = () => {
	const [strength, setStrength] = useState(0)

	useEffect(() => {
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
			<img src={low} className="absolute size-full object-cover" style={{ opacity: strength / 100 }} />
			<img
				src={high}
				className="absolute size-full object-cover transition-opacity duration-2000"
				style={{ opacity: strength < 50 ? 0 : (strength - 50) / 50 }}
			/>
		</>
	)
}