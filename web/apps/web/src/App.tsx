import { toggleTheme } from '@workspace/ui/hooks/theme'
import { storage } from '@lenix/lenix'

import '@workspace/ui/globals.css'
import { Ipad } from './App.ipad'
import { Rank } from './App.rank'
import { Hud } from './hud'
import { TopScore } from './topscore'
import { Roster } from './roster'
import { Starting } from './App.start'

toggleTheme(storage.get<Storage, 'theme'>('theme') ?? 'dark')

export const DEV = true

export const App = () => (
	<>
		{DEV && (
			<img
				src="/ped.png"
				className="pointer-events-none absolute inset-0 -z-1 size-full object-cover" />
		)}
		<Hud />
		<Ipad />
		<Starting />
		<Rank />
		<TopScore />
		<Roster />
	</>
)
