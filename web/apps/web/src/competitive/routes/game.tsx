// import { DamageEffect } from "../modules/effect"
// import { HitMarker } from "../modules/hit"
import { Hud } from "../modules/hud"

import { KillFeed } from "../modules/killfeed"
import { Roundboard } from "../modules/roundboard"

export const Game = () => {

	return (
		<>
			{/* <HitMarker /> */}
			{/* <DamageEffect /> */}
			<Hud />
			<KillFeed />
			<Roundboard />
		</>
	)
}