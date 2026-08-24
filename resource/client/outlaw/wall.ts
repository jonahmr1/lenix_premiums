import type { Vec3 } from 'lenix'

const PREVIEW_DISTANCE = 10.0
const PREVIEW_WIDTH = 1.0
const PREVIEW_HEIGHT = 1.0
const PREVIEW_OFFSET = 0.005

type WallCorners = {
	topLeft: Vec3
	topRight: Vec3
	bottomRight: Vec3
	bottomLeft: Vec3
}

const add = (left: Vec3, right: Vec3): Vec3 => [
	left[0] + right[0],
	left[1] + right[1],
	left[2] + right[2],
]

const subtract = (left: Vec3, right: Vec3): Vec3 => [
	left[0] - right[0],
	left[1] - right[1],
	left[2] - right[2],
]

const multiply = (value: Vec3, multiplier: number): Vec3 => [
	value[0] * multiplier,
	value[1] * multiplier,
	value[2] * multiplier,
]

const dot = (left: Vec3, right: Vec3) =>
	left[0] * right[0] + left[1] * right[1] + left[2] * right[2]

const cross = (left: Vec3, right: Vec3): Vec3 => [
	left[1] * right[2] - left[2] * right[1],
	left[2] * right[0] - left[0] * right[2],
	left[0] * right[1] - left[1] * right[0],
]

const normalize = (value: Vec3): Vec3 => {
	const length = Math.hypot(value[0], value[1], value[2])
	if (length === 0) return [0, 0, 0]

	return multiply(value, 1 / length)
}

const cameraDirection = (rotation: Vec3): Vec3 => {
	const pitch = rotation[0] * Math.PI / 180
	const yaw = rotation[2] * Math.PI / 180
	const horizontal = Math.abs(Math.cos(pitch))

	return normalize([
		-Math.sin(yaw) * horizontal,
		Math.cos(yaw) * horizontal,
		Math.sin(pitch),
	])
}

const getWallCorners = (): WallCorners | undefined => {
	const camera = GetGameplayCamCoord() as Vec3
	const direction = cameraDirection(GetGameplayCamRot(2) as Vec3)
	const end = add(camera, multiply(direction, PREVIEW_DISTANCE))

	const shapeTest = StartShapeTestRay(
		camera[0], camera[1], camera[2],
		end[0], end[1], end[2],
		1 | 16,
		PlayerPedId(),
		0,
	)

	const [, hit, hitCoords, surfaceNormal] = GetShapeTestResult(shapeTest) as [
		number,
		boolean,
		Vec3,
		Vec3,
		number,
	]

	if (!hit || !hitCoords || !surfaceNormal) return

	const normal = normalize(surfaceNormal)
	if (normal[0] === 0 && normal[1] === 0 && normal[2] === 0) return

	const worldUp: Vec3 = [0, 0, 1]
	let up = normalize(subtract(worldUp, multiply(normal, dot(worldUp, normal))))

	if (up[0] === 0 && up[1] === 0 && up[2] === 0) {
		up = normalize(subtract([1, 0, 0], multiply(normal, normal[0])))
	}

	const right = normalize(cross(up, normal))
	const center = add(hitCoords, multiply(normal, PREVIEW_OFFSET))
	const halfWidth = PREVIEW_WIDTH / 2
	const halfHeight = PREVIEW_HEIGHT / 2

	return {
		topLeft: add(add(center, multiply(right, -halfWidth)), multiply(up, halfHeight)),
		topRight: add(add(center, multiply(right, halfWidth)), multiply(up, halfHeight)),
		bottomRight: add(add(center, multiply(right, halfWidth)), multiply(up, -halfHeight)),
		bottomLeft: add(add(center, multiply(right, -halfWidth)), multiply(up, -halfHeight)),
	}
}

const drawOutline = (corners: WallCorners) => {
	const points: Vec3[] = [
		corners.topLeft,
		corners.topRight,
		corners.bottomRight,
		corners.bottomLeft,
	]

	for (let index = 0; index < points.length; index++) {
		const from = points[index]!
		const to = points[(index + 1) % points.length]!

		DrawLine(
			from[0], from[1], from[2],
			to[0], to[1], to[2],
			255, 255, 255, 220,
		)
	}
}

let previewEnabled = false
let previewTick: number | undefined

const stopPreview = () => {
	previewEnabled = false

	if (previewTick !== undefined) {
		clearTick(previewTick)
		previewTick = undefined
	}
}

const togglePreview = () => {
	if (previewEnabled) {
		stopPreview()
		return
	}

	previewEnabled = true
	previewTick = setTick(() => {
		const corners = getWallCorners()
		if (corners) drawOutline(corners)
	})
}

RegisterCommand('outlaw_wall_preview', togglePreview, false)

on('onResourceStop', (resourceName: string) => {
	if (resourceName === GetCurrentResourceName()) stopPreview()
})
