// import { DamageIndicator } from "./modules/damage"
// import { DirectionalIndicator } from "./modules/directional"
// import { DamageEffect } from "./modules/effect"
// import { Flashbang } from "./modules/flashbang"
// import { HitMarker } from "./modules/hit"
import { Hud } from "./modules/hud"
import { KillFeed } from "./modules/killfeed"
// import { Result } from "./modules/result"
// import { Result } from "./modules/result"
// import { Ping } from "./modules/ping"
import { Roundboard } from "./modules/roundboard"

export const Game = () => (
	<>
		{/* <HitMarker /> */}
		{/* <DamageEffect /> */}
		{/* <Ping /> */}
		{/* <Flashbang /> */}
		{/* <DirectionalIndicator /> */}
		{/* <DamageIndicator /> */}
		<Hud />
		<KillFeed />
		<Roundboard />
		{/* <Result /> */}
	</>
)