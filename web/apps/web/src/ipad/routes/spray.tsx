import digitalMap from '@workspace/ui/assets/ipad/map-digital.png'
import satelliteMap from '@workspace/ui/assets/ipad/map-satellite.png'
import {
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch'

export const Spray = () => {
	const map = [digitalMap, satelliteMap]
	const zones: readonly {
		styles: React.ComponentProps<'div'>['className']
		zone: [number, number]
	}[] = [
		{
			styles: 'bg-yellow-500',
			zone: [50.0, 50.0]
		}
	]

	return (
		<div className='relative size-full overflow-hidden'>
			<TransformWrapper
				initialScale={1}
				minScale={1}
				maxScale={10}
				wheel={{ step: 0.01 }}
			>
				<TransformComponent
					wrapperClass='!size-full'
					contentClass='relative !size-full'
				>
					<img
						src={map[1]}
						className='size-full object-cover rounded-b-2xl'
					/>
					{zones.map(({ styles, zone }, i) => (
						<div
							key={i}
							className={`absolute size-3 rounded-full ${styles} opacity-80`}
							style={{
								top: `${zone[0]}%`,
								left: `${zone[1]}%`,
							}}
						/>
					))}
				</TransformComponent>
			</TransformWrapper>
		</div>
	)
}
