import { asserts } from "@lenix/lenix"
import type { Vec3, Vec4 } from "lenix"

export const getProfileId = (client: number) => GetPlayerIdentifierByType(client.toString(), 'license')

export const fullName = (table: string) => `lenix_competitive_${table}` as const

export const getSpawnPoints = (area: Vec3[], length: number): Vec4[] => {
	asserts(area.length === 4, `Expected exactly 4 staging-area corners`)
	asserts(length > 0, `Expected at least one player`)

	const padding = 0.15
	const [frontLeft, frontRight, backRight, backLeft] = area
	asserts(frontLeft && frontRight && backRight && backLeft)

	const left: Vec3 = [
		(frontLeft[0] + backLeft[0]) / 2,
		(frontLeft[1] + backLeft[1]) / 2,
		(frontLeft[2] + backLeft[2]) / 2,
	]

	const right: Vec3 = [
		(frontRight[0] + backRight[0]) / 2,
		(frontRight[1] + backRight[1]) / 2,
		(frontRight[2] + backRight[2]) / 2,
	]

	const frontCenter: Vec3 = [
		(frontLeft[0] + frontRight[0]) / 2,
		(frontLeft[1] + frontRight[1]) / 2,
		(frontLeft[2] + frontRight[2]) / 2,
	]

	const backCenter: Vec3 = [
		(backLeft[0] + backRight[0]) / 2,
		(backLeft[1] + backRight[1]) / 2,
		(backLeft[2] + backRight[2]) / 2,
	]

	const heading = (
		Math.atan2(
			frontCenter[0] - backCenter[0],
			frontCenter[1] - backCenter[1]
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
