import atlasMap from '@workspace/ui/assets/ipad/map-atlas.png'
import satelliteMap from '@workspace/ui/assets/ipad/map-satellite.png'
import {
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch'

export const Spray = () => {
	const map = [atlasMap, satelliteMap]
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
					<div className='absolute left-1/2 top-1/2 h-[100vw] w-[100vh] -translate-x-1/2 -translate-y-1/2 landscape:-rotate-90 active:cursor-grabbing'>
						<img
							src={map[0]}
							className='size-full rounded-b-2xl object-contain'
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
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	)
}
