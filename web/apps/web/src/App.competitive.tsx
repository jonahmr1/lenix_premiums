import { DEV } from "./App"
import { DamageEffect } from "./competitive/damage"
import { Flashbang } from "./competitive/flashbang"
import { HitMarker } from "./competitive/hit"

export const Competitive = () => {
	if (!DEV('competitive')) return null

	return (
		<>
			<HitMarker />
			<DamageEffect />
			<Flashbang />
		</>
	)
}