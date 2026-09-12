import map from '@workspace/ui/assets/ipad/map.jpeg'
import type { Orientation } from '@/ipad/types'
import type { Vec2 } from 'lenix'
import { pixelPosition } from '../utils'

export const Spray = ({ orientation }: { orientation: Orientation }) => {
	const zones: readonly {
		styles: string
		zone: Vec2
	}[] = [
		{
			styles: 'bg-blue-500',
			zone: [0, 0],
		},
		{
			styles: 'bg-red-500',
			zone: [118.5660, -1951.1333],
		},
	]

	return (
		<div className='relative size-full overflow-hidden'>
			<img src={map} className='size-full object-contain' />
			{zones.map(({ styles, zone }, i) => (
				<div
					key={i}
					className={`absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full ${styles} opacity-80`}
					style={{
						...pixelPosition(zone),
						height: 10,
						width: 10
					}} />
			))}
		</div>
	)
}
