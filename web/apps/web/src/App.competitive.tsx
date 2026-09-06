import { DamageEffect } from "./competitive/damage"
import { Flashbang } from "./competitive/flashbang"
import { HitMarker } from "./competitive/hit"

export const Competitive = () => {

	return (
		<>
			<HitMarker />
			<DamageEffect />
			<Flashbang />
		</>
	)
}