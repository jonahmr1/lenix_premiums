import atlasMap from '@workspace/ui/assets/ipad/map-atlas.jpeg'
import satelliteMap from '@workspace/ui/assets/ipad/map-satellite.png'
import {
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch'
import type { Orientation } from '@/ipad/types'
import { useTheme } from '@workspace/ui/hooks/theme'
import type { Vec2 } from 'lenix'


export const Spray = ({ orientation }: { orientation: Orientation }) => {
	const { theme } = useTheme()
	const preset = theme === 'dark' ? 'satellite' : 'atlas'
	const map = preset === 'satellite' ? satelliteMap : atlasMap
	
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
			<TransformWrapper
				initialScale={1}
				minScale={1}
				maxScale={10}
				wheel={{ step: 0.01 }}
			>
				<TransformComponent
					wrapperClass='!size-full'
					contentClass='!size-full'
				>
					<img
						src={map}
						className='object-cover'
					/>
					{zones.map(({ styles, radius, zone }, i) => (
						<div
							key={i}
							className={`absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full ${styles} opacity-80`}
							style={{}}
						/>
					))}
				</TransformComponent>
			</TransformWrapper>
		</div>
	)
}
