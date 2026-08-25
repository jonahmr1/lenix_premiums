import type { Vec3 } from 'lenix'

const PREVIEW_DISTANCE = 10.0
const PREVIEW_WIDTH = 1.0
const PREVIEW_HEIGHT = 1.0
const PREVIEW_OFFSET = 0.005
const PREVIEW_IMAGE = 'https://lenix.dev/icon.png'
const PREVIEW_TEXTURE_DICTIONARY = 'lenix_outlaw_preview_d'
const PREVIEW_TEXTURE_NAME = 'lenix_outlaw_preview'

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

	let normal = normalize(surfaceNormal)
	if (normal[0] === 0 && normal[1] === 0 && normal[2] === 0) return

	const toCamera = normalize(subtract(camera, hitCoords))
	if (dot(normal, toCamera) < 0) normal = multiply(normal, -1)

	const worldUp: Vec3 = [0, 0, 1]
	let up = normalize(subtract(worldUp, multiply(normal, dot(worldUp, normal))))

	if (up[0] === 0 && up[1] === 0 && up[2] === 0) {
		up = normalize(subtract([1, 0, 0], multiply(normal, normal[0])))
	}

	const right = normalize(cross(normal, up))
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
			0, 255, 0, 255,
		)
	}
}

const drawImage = (corners: WallCorners) => {
	DrawSpritePoly(
		corners.topLeft[0], corners.topLeft[1], corners.topLeft[2],
		corners.topRight[0], corners.topRight[1], corners.topRight[2],
		corners.bottomRight[0], corners.bottomRight[1], corners.bottomRight[2],
		255, 255, 255, 255,
		PREVIEW_TEXTURE_DICTIONARY,
		PREVIEW_TEXTURE_NAME,
		0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0,
	)

	DrawSpritePoly(
		corners.topLeft[0], corners.topLeft[1], corners.topLeft[2],
		corners.bottomRight[0], corners.bottomRight[1], corners.bottomRight[2],
		corners.bottomLeft[0], corners.bottomLeft[1], corners.bottomLeft[2],
		255, 255, 255, 255,
		PREVIEW_TEXTURE_DICTIONARY,
		PREVIEW_TEXTURE_NAME,
		0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
	)
}

let previewEnabled = false
let previewTick: number | undefined
let previewDui: any
let previewTextureReady = false
const sprayedWalls: WallCorners[] = []

const createPreviewTexture = () => {
	console.log(`[outlaw:spray] creating DUI: ${PREVIEW_IMAGE}`)
	previewDui = CreateDui(PREVIEW_IMAGE, 512, 512)
	previewTextureReady = false
}

const destroyPreviewTexture = () => {
	if (previewDui) {
		DestroyDui(previewDui)
		previewDui = undefined
	}

	previewTextureReady = false
}

const ensurePreviewTexture = () => {
	if (previewTextureReady || !previewDui || !IsDuiAvailable(previewDui)) return

	const duiHandle = GetDuiHandle(previewDui)
	if (!duiHandle) return

	const txd = CreateRuntimeTxd(PREVIEW_TEXTURE_DICTIONARY)
	CreateRuntimeTextureFromDuiHandle(txd, PREVIEW_TEXTURE_NAME, duiHandle)
	previewTextureReady = true
	console.log(`[outlaw:spray] texture ready: ${PREVIEW_TEXTURE_DICTIONARY}/${PREVIEW_TEXTURE_NAME}`)
}

const stopPreview = () => {
	previewEnabled = false
	destroyPreviewTexture()

	if (previewTick !== undefined) {
		clearTick(previewTick)
		previewTick = undefined
	}
}

const togglePreview = () => {
	if (previewEnabled) {
		stopPreview()
		console.log('[outlaw:spray] stopped')
		return
	}

	previewEnabled = true
	console.log('[outlaw:spray] started')
	createPreviewTexture()
	previewTick = setTick(() => {
		ensurePreviewTexture()

		if (previewTextureReady) {
			for (const wall of sprayedWalls) drawImage(wall)
		}

		const clicked = IsControlJustPressed(0, 24)
		const corners = getWallCorners()

		if (clicked) {
			console.log(`[outlaw:spray] click | wall=${Boolean(corners)} | texture=${previewTextureReady}`)
			if (corners) sprayedWalls.push(corners)
		}

		if (!corners) return

		if (previewTextureReady) drawImage(corners)

		drawOutline(corners)
	})
}

RegisterCommand('spray', togglePreview, false)

on('onResourceStop', (resourceName: string) => {
	if (resourceName === GetCurrentResourceName()) stopPreview()
})
