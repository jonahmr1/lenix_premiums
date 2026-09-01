import map from '@workspace/ui/assets/ipad/map.jpeg'
import type { Orientation } from '@/ipad/types'
import type { Vec2 } from 'lenix'

export const Spray = ({ orientation }: { orientation: Orientation }) => {
	const zones: readonly {
		styles: React.ComponentProps<'div'>['className']
		zone: Vec2
		radius: number
	}[] = [
		{
			styles: 'bg-black',
			zone: [0, 0],
			radius: 150,
		},
		{
			styles: 'bg-red-500',
			zone: [118.5660, -1951.1333],
			radius: 150,
		},
		{
			styles: 'bg-blue-500',
			zone: [2599.4819, 2511.7891],
			radius: 150,
		},
		{
			styles: 'bg-green-500',
			zone: [487.0760, 6575.9873],
			radius: 150,
		},
		{
			styles: 'bg-purple-500',
			zone: [-2693.6714, 2297.6426],
			radius: 150,
		},
	]

	return (
		<div className='size-full overflow-hidden'>
			<img src={map} className='h-full object-contain' />
			{zones.map(({ styles, radius, zone }, i) => (
				<div
					key={i}
					className={`absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full ${styles} opacity-80`}
					style={{}}
				/>
			))}
		</div>
	)
}
