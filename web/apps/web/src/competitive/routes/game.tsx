// import { DamageEffect } from "../modules/effect"
// import { Flashbang } from "../modules/flashbang"
// import { HitMarker } from "../modules/hit"
import { DirectionalIndicator } from "../modules/directional"
import { Hud } from "../modules/hud"
import { Ping } from "../modules/ping"

import { KillFeed } from "../modules/killfeed"
import { Roundboard } from "../modules/roundboard"

export const Game = () => {

	return (
		<>
			{/* <HitMarker /> */}
			{/* <DamageEffect /> */}
			{/* <Flashbang /> */}
			<Ping />
			<Hud />
			<DirectionalIndicator />
			<KillFeed />
			<Roundboard />
		</>
	)
}