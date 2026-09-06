import { waste } from '@lenix/lenix'
import { useEffect, useState } from 'react'
import low from '@workspace/ui/assets/competitive/damage/low.png'
import high from '@workspace/ui/assets/competitive/damage/high.png'
import heartbeat from '@workspace/ui/assets/competitive/damage/heartbeat.mp3'
import { Howl } from 'howler'

const player = new Howl({
	src: heartbeat,
	volume: 0.05
})

export const DamageEffect = () => {
	const [strength, setStrength] = useState(0)
	const [effect, setEffect] = useState({ img: low })

	useEffect(() => {
		// setTimeout(async () => {
		// 	for (const i of Array(100).keys()) {
		// 		await waste(50)
		// 		setStrength(i)
		// 	}
		// 	await waste(2000)

		// 	for (const i of Array(100).keys()) {
		// 		await waste(50)
		// 		setStrength(99 - i)
		// 	}
		// })
	}, [])

	useEffect(() => {
		setEffect({ img: strength < 50 ? low : high })

		player.rate(0.7 + strength * 0.011)
		if (strength > 0) {
			player.loop(true)

			if (!player.playing()) player.play()
		} else {
			player.stop()
		}
	}, [strength])

	return (
		<img
			src={effect.img}
			className="pointer-events-none absolute -z-1 size-full object-cover"
			style={{
				opacity: strength / 100
			}}
		/>
	)
}