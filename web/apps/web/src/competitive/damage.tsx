import { random } from '@lenix/lenix'
import high from '@workspace/ui/assets/competitive/high.png'
import low from '@workspace/ui/assets/competitive/low.png'

export const DamageEffect = () => {
	const bgs = [high, low]
	const effect = bgs[random(0, bgs.length - 1)]

	return (
		<img
			src={effect}
			className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
			style={{
				opacity: random(0, 100) / 100
			}}	
		/>
	)
}