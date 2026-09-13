import type { Vec2 } from 'lenix'
import { pixelPosition } from '../utils'
import { maps } from '../constants'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

export const Spray = () => {
	const mapVariant: keyof typeof maps = 'default'
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
		<div className='absolute'>
			<TransformWrapper
				initialScale={1}
				minScale={1}
				maxScale={4}
				centerOnInit={false}
				centerZoomedOut={false}
				limitToBounds={true}
				wheel={{ step: 0.001 }}
			>
				<TransformComponent wrapperClass='size-full'>
					<div className='relative'>
						<img src={maps[mapVariant]} className='size-full' />
						{zones.map(({ styles, zone }, i) => (
							<div
								key={i}
								className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${styles} opacity-80`}
								style={pixelPosition(zone, mapVariant)}
							/>
						))}
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	)
}
