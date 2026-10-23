import { repeat } from '@lenix/lenix'
import type { Vec4 } from 'lenix'
import { cam, emitNui, entity } from 'lenix/client'
import type { Warzone } from 'types/index'

const PED_COORDS: Vec4 = [0, 0, 0, 0]

const load = () => {
	entity.teleport(...PED_COORDS)
	const [dispose, camHandle] = cam.create({
		coords: PED_COORDS,
		offset: [0, 0, 0, 0]
	})

	setImmediate(async () => {
		await repeat(() => IsCamRendering(camHandle) as unknown as number, 1, 1000);
		emitNui<Warzone.Events['open']>('warzone:open')
	})

	return () => dispose
}

export default () => [load()]
