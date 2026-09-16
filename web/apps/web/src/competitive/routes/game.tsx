// import { DamageEffect } from "../modules/effect"
// import { Flashbang } from "../modules/flashbang"
// import { HitMarker } from "../modules/hit"
import { DamageIndicator } from "../modules/damage"
import { DirectionalIndicator } from "../modules/directional"
import { Hud } from "../modules/hud"
import { Ping } from "../modules/ping"

import { KillFeed } from "../modules/killfeed"

export const Game = () => {

	return (
		<>
			{/* <HitMarker /> */}
			{/* <DamageEffect /> */}
			{/* <Flashbang /> */}
			<Ping />
			<Hud />
			<DamageIndicator />
			<DirectionalIndicator />
			<KillFeed />
		</>
	)
}