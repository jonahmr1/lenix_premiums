import { repeat } from '@lenix/lenix'
import type { Vec2, Vec4 } from 'lenix'
import { cam, emitNui, entity, onEvent, pool } from 'lenix/client'
import type { Warzone } from 'types/index'

const PED_COORDS: Vec4 = [-2279.71, 3177.63, 32.80, 240.4]
const CAM_OFFSET: Vec4 = [3.619, -1.95, 0.69, -180]
const CAM_ROTATION: Vec2 = [-8.8, 0]

const load = () => {
	let disposeCamera: ReturnType<typeof cam.create>[0] | undefined

	const dispose = onEvent('ox:playerLoaded', () => {
		entity.teleport(...PED_COORDS)

		const [dispose, camHandle] = cam.create({
			coords: PED_COORDS,
			offset: CAM_OFFSET,
			rotation: CAM_ROTATION
		})

		disposeCamera = dispose

		setImmediate(async () => {
			await repeat(
				() => IsCamRendering(camHandle) as unknown as number,
				1,
				1000
			)

			emitNui<Warzone.Events['open']>('warzone:open')
		})
	})

	return () => {
		dispose()
		disposeCamera?.()
	}
}

export default () => [
	load(),

	// TODO: enable in game
	pool(HideHudAndRadarThisFrame)
]
