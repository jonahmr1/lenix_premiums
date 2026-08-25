import atlasMap from '@workspace/ui/assets/ipad/map-atlas.png'
import satelliteMap from '@workspace/ui/assets/ipad/map-satellite.png'
import {
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch'
import type { Orientation } from '@/ipad/types'
import { useTheme } from '@workspace/ui/hooks/theme'

export const Spray = ({ orientation }: { orientation: Orientation }) => {
	const { theme } = useTheme()
	const map: Record<typeof theme, string> = {
		dark: satelliteMap,
		light: atlasMap
	}
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
					<div className='relative size-full rounded-b-2xl overflow-hidden [container-type:size]'>
						<div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${orientation === 'portrait' ? 'h-[100cqh] w-[100cqw] rotate-0' : 'h-[100cqw] w-[100cqh] -rotate-90'}`}>
							<img
								src={map[theme]}
								className='size-full object-cover'
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
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	)
}
