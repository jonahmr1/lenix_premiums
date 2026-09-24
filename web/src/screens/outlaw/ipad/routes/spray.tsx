import type { Vec2 } from 'lenix'
import { pixelPosition } from '../utils'
import { MAPS_IMAGES } from '@/constants'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

export const Spray = () => {
	const mapVariant: keyof typeof MAPS_IMAGES = 'default'
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

	/* TODO: limit pinch to the map size only */
	return (
		<div className='absolute'>
			<TransformWrapper
				initialScale={1}
				minScale={0.8}
				maxScale={4}
				centerOnInit={false}
				centerZoomedOut={false}
				limitToBounds={false}
				wheel={{ step: 0.001 }}
			>
				<TransformComponent>
					<img src={MAPS_IMAGES[mapVariant]} className='size-full' />
					{zones.map(({ styles, zone }, i) => (
						<div
							key={i}
							className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${styles} opacity-80`}
							style={pixelPosition(zone, mapVariant)}
						/>
					))}
				</TransformComponent>
			</TransformWrapper>
		</div>
	)
}
