import type { Vec2, Vec3 } from 'lenix'
import { MAPS_IMAGES } from '@/constants'
import { asserts, entries } from '@lenix/lenix'

const mapsDimensions = new Map<
	keyof typeof MAPS_IMAGES,
	{
		width: number
		height: number
	}
>()

for (const [variant, map] of entries(MAPS_IMAGES)) {
	const img = new Image()
	img.src = map

	img.onload = () =>
		mapsDimensions.set(variant, {
			width: img.naturalWidth,
			height: img.naturalHeight,
		})
}

const calibration = [
	{
		world: [2599.4819, 2511.7891],
		pixel: [1534.14, 1339.58],
	},
	{
		world: [487.076, 6575.9873],
		pixel: [1052.99, 414.88],
	},
	{
		world: [-2693.6714, 2297.6426],
		pixel: [329.24, 1389.32],
	},
] as const

const calibrate = (axis: 0 | 1) => {
	const [p1, p2, p3] = calibration
	const det =
		p1.world[0] * (p2.world[1] - p3.world[1]) +
		p2.world[0] * (p3.world[1] - p1.world[1]) +
		p3.world[0] * (p1.world[1] - p2.world[1])

	const [x1, y1] = p1.world
	const [x2, y2] = p2.world
	const [x3, y3] = p3.world

	const z1 = p1.pixel[axis]
	const z2 = p2.pixel[axis]
	const z3 = p3.pixel[axis]

	const a = (z1 * (y2 - y3) + z2 * (y3 - y1) + z3 * (y1 - y2)) / det

	const b = (x1 * (z2 - z3) + x2 * (z3 - z1) + x3 * (z1 - z2)) / det

	const c = (x1 * (y2 * z3 - y3 * z2) + x2 * (y3 * z1 - y1 * z3) + x3 * (y1 * z2 - y2 * z1)) / det
	return [a, b, c] as const satisfies Vec3
}

const [a, b, c] = calibrate(0)
const [d, e, f] = calibrate(1)

export const pixelPosition = ([X, Y]: Vec2, map: keyof typeof MAPS_IMAGES) => {
	const pixelX = a * X + b * Y + c
	const pixelY = d * X + e * Y + f

	const dimensions = mapsDimensions.get(map)
	asserts(dimensions)

	return {
		left: `${(pixelX / dimensions.width) * 100}%`,
		top: `${(pixelY / dimensions.height) * 100}%`,
	}
}
