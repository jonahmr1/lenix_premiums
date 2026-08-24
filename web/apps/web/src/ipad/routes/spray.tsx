import digitalMap from '@workspace/ui/assets/ipad/map-digital.png'
import satelliteMap from '@workspace/ui/assets/ipad/map-satellite.png'
import { useState } from 'react'

export const Spray = () => {
	const [zoom, setZoom] = useState(1)

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
	const handleZoom = (event: React.WheelEvent) => {
		console.log(zoom)
		setZoom(value =>
			Math.min(18, Math.max(1, value - event.deltaY * 0.001))
		)
	}

	return (
		<div
			className='relative size-full'
			style={{
				transform: `scale(${zoom})`
			}}
		>
			<img
				src={map[1]}
				className='size-full object-cover'
				onWheel={handleZoom}
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
	)
}
