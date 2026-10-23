import { DamageIndicator } from './damage'
import { DirectionalIndicator } from './directional'
import { DamageEffect } from './effect'
import { Flashbang } from './flashbang'
import { HitMarker } from './hit'
import { Hud } from './hud'
import { KillFeed } from './killfeed'
import { Result } from './result'
import { Ping } from './ping'
import { Roundboard } from './roundboard'

export const Game = () => (
	<>
		<Hud />
		<HitMarker />
		<DamageEffect />
		<Ping />
		<Flashbang />
		<DirectionalIndicator />
		<DamageIndicator />
		<KillFeed />
		<Roundboard />
		<Result />
	</>
)
