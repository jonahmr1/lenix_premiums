import { asserts } from "@lenix/lenix"
import type { Vec3, Vec4 } from "lenix"

export const getProfileId = (client: number) => GetPlayerIdentifierByType(client.toString(), 'license')

export const fullName = (table: string) => `lenix_competitive_${table}` as const

const WALL_OBJECT_LENGTH = 2.5

const getWallMidpoint = (start: Vec3, end: Vec3): Vec3 => [
	(start[0] + end[0]) / 2,
	(start[1] + end[1]) / 2,
	(start[2] + end[2]) / 2,
]

export const getWallPoints = (area: Vec3[]): Vec4[] => {
	asserts(area.length === 4, `Expected exactly 4 staging-area corners`)

	return area.flatMap((start, index) => {
		const end = area[(index + 1) % area.length]
		asserts(end, `Failed to find staging-area wall endpoint`)

		const heading = (
			Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI + 90 + 360
		) % 360
		const length = Math.hypot(end[0] - start[0], end[1] - start[1])
		const objects = Math.max(1, Math.ceil(length / WALL_OBJECT_LENGTH))

		return Array.from({ length: objects }, (_, objectIndex): Vec4 => {
			const progress = (objectIndex + 0.5) / objects

			return [
				start[0] + (end[0] - start[0]) * progress,
				start[1] + (end[1] - start[1]) * progress,
				start[2] + (end[2] - start[2]) * progress,
				heading,
			]
		})
	})
}

export const getSpawnPoints = (area: Vec3[], length: number): Vec4[] => {
	asserts(length > 0, `Expected at least one player`)
	asserts(area.length === 4, `Expected exactly 4 staging-area corners`)

	const wallMidpoints = area.map((start, index) => {
		const end = area[(index + 1) % area.length]
		asserts(end, `Failed to find staging-area wall endpoint`)

		return getWallMidpoint(start, end)
	})
	const [front, right, back, left] = wallMidpoints
	asserts(front && right && back && left)

	const padding = 0.15

	const heading = (
		Math.atan2(
			front[0] - back[0],
			front[1] - back[1]
		) * 180 / Math.PI + 360
	) % 360

	return Array.from({ length }, (_, index) => {
		const progress = length === 1
			? 0.5
			: padding + (1 - padding * 2) * index / (length - 1)

		return [
			left[0] + (right[0] - left[0]) * progress,
			left[1] + (right[1] - left[1]) * progress,
			left[2] + (right[2] - left[2]) * progress,
			heading,
		]
	})
}
