import type { Vec4 } from "lenix"
import { cam, entity } from "lenix/client"

const PED_COORDS: Vec4 = [0, 0, 0, 0]

const load = () => {
	entity.teleport(...PED_COORDS)
	const [dispose] = cam.create({
		coords: PED_COORDS,
		offset: [0, 0, 0, 0]
	})
	return dispose
}

export default [
	load()
]