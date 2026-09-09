import { toggleTheme, useTheme } from '@workspace/ui/hooks/theme'
import { storage } from '@lenix/lenix'

import '@workspace/ui/globals.css'
import { Hud } from './hud'
import { TopScore } from './topscore'
import { Roster } from './roster'
import { Competitive } from './competitive/App'
import type { Storage } from './ipad/types'
import { Button } from '@workspace/ui/components/button'
import { Moon, Sun } from 'lucide-react'
import { Ipad } from './ipad/App'
import { Start } from './start/App'
import { Rank } from './rank/App'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas, far)
toggleTheme(storage.get<Storage, 'theme'>('theme') ?? 'dark')

const dev = 'start'
export const DEV = <T,>(cb: () => T, module: typeof dev = dev): T | undefined => import.meta.env.DEV && module === dev ? cb() : undefined

export const App = () => {
	const { theme, toggle } = useTheme()

	return (
		<>
			{DEV(() => (
				<>
					<img
						src={`${theme}.png`}
						className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
					/>
					<Button
						className='absolute bottom-5 left-5'
						onClick={toggle}
					>
						{theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
				</>
			))}
			<Hud />
			<Ipad />
			<Start />
			<Rank />
			<TopScore />
			<Roster />
			<Competitive />
		</>
	)
}
