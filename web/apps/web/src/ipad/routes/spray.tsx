import atlasMap from '@workspace/ui/assets/ipad/map-atlas.png'
import satelliteMap from '@workspace/ui/assets/ipad/map-satellite.png'
import {
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch'
import type { Orientation } from '@/ipad/types'
import { useTheme } from '@workspace/ui/hooks/theme'

type Vec2 = readonly [number, number]
type MapPreset = 'atlas' | 'satellite'

const calibration = {
	world: [
		[-4000, -4000],
		[8000, 6000],
	],
	atlas: {
		size: [3072, 3936],
		image: [
			[0, 3936],
			[3072, 0],
		],
	},
	satellite: {
		size: [2048, 2048],
		image: [
			[0, 2048],
			[2048, 0],
		],
	},
} as const

const worldToMap = (world: Vec2, preset: MapPreset): Vec2 => {
	const worldStart = calibration.world[0]
	const worldEnd = calibration.world[1]
	const image = calibration[preset]
	const imageStart = image.image[0]
	const imageEnd = image.image[1]

	const scale: Vec2 = [
		(imageEnd[0] - imageStart[0]) / (worldEnd[0] - worldStart[0]),
		(imageEnd[1] - imageStart[1]) / (worldEnd[1] - worldStart[1]),
	]

	const pixel: Vec2 = [
		imageStart[0] + (world[0] - worldStart[0]) * scale[0],
		imageStart[1] + (world[1] - worldStart[1]) * scale[1],
	]

	return [
		(pixel[0] / image.size[0]) * 100,
		(pixel[1] / image.size[1]) * 100,
	]
}

export const Spray = ({ orientation }: { orientation: Orientation }) => {
	const { theme } = useTheme()
	const preset: MapPreset = theme === 'dark' ? 'satellite' : 'atlas'
	const map = preset === 'satellite' ? satelliteMap : atlasMap
	const zones: readonly {
		styles: React.ComponentProps<'div'>['className']
		zone: Vec2
	}[] = [
		{
			styles: 'bg-yellow-500',
			zone: [50.0, 50.0]
		}
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
					<div className='relative size-full rounded-b-2xl overflow-hidden @container-size'>
						<div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${orientation === 'portrait' ? 'h-[100cqh] w-[100cqw] rotate-0' : 'h-[100cqw] w-[100cqh] -rotate-90'}`}>
							<img
								src={map}
								className='size-full object-cover'
							/>
							{zones.map(({ styles, zone }, i) => {
								const position = worldToMap(zone, preset)
								return (
									<div
										key={i}
										className={`absolute size-3 rounded-full ${styles} opacity-80`}
										style={{
											top: `${position[1]}%`,
											left: `${position[0]}%`,
										}}
									/>
								)
							})}
						</div>
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	)
}
