import { waste } from '@lenix/lenix'
import { useEffect, useState } from 'react'
import { Howl } from 'howler'
import { cdn } from '@/lib'

const player = new Howl({
	src: cdn('assets/competitive/effect/heartbeat.mp3'),
	loop: true,
	volume: 0.5,
})

export const DamageEffect = () => {
	const [strength, setStrength] = useState(0)
	const active = strength > 0

	useEffect(() => {
		const timer = setTimeout(async () => {
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

		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		player.rate(0.7 + strength * 0.011)
	}, [strength])

	useEffect(() => {
		if (!active) return
		const id = player.play()

		return () => {
			player.stop(id)
		}
	}, [active])

	return (
		<>
			<img
				src={cdn('assets/competitive/effect/low.png')}
				className='absolute size-full object-cover'
				style={{ opacity: strength / 100 }}
			/>
			<img
				src={cdn('assets/competitive/effect/high.png')}
				className='absolute size-full object-cover transition-opacity duration-2000'
				style={{ opacity: strength < 50 ? 0 : (strength - 50) / 50 }}
			/>
		</>
	)
}
