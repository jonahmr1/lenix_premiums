import { toggleTheme, useTheme } from '@workspace/ui/hooks/theme'
import { storage } from '@lenix/lenix'

import '@workspace/ui/globals.css'
import { Ipad } from './App.ipad'
import { Rank } from './App.rank'
import { Hud } from './hud'
import { TopScore } from './topscore'
import { Roster } from './roster'
import { Starting } from './App.start'
import { Competitive } from './App.competitive'
import type { Storage } from './ipad/types'

toggleTheme(storage.get<Storage, 'theme'>('theme') ?? 'dark')

const dev = 'competitive'
export const DEV = (cb: () => void, module: typeof dev = dev) => import.meta.env.DEV && module !== dev && cb()

export const App = () => {
	const { theme } = useTheme()

	return (
		<>
			{DEV(dev) && (
				<img
					src={`${theme}.png`}
					className="pointer-events-none absolute inset-0 -z-1 size-full object-cover" />
			)}
			<Hud />
			<Ipad />
			<Starting />
			<Rank />
			<TopScore />
			<Roster />
			<Competitive />
		</>
	)
}
