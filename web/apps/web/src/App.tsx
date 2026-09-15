import { toggleTheme, useTheme } from '@workspace/ui/hooks/theme'
import { storage } from '@lenix/lenix'

import '@workspace/ui/globals.css'
import { Hud } from './outlaw/hud'
import { Roster } from './outlaw/roster'
import type { Storage } from './ipad/types'
import { Button } from '@workspace/ui/components/button'
import { Moon, Sun } from 'lucide-react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router'
import { Toaster } from '@workspace/ui/components/sonner'
import { Starting } from './start/routes/start'
import { Credit } from './start/routes/credit'
import { Lobby } from './competitive/routes/lobby'
import { Game } from './competitive/routes/game'
import { useEffect } from 'react'
import { Pause } from './start/routes/pause'
import { focus, onNuiEmit } from 'lenix/nui'
import type { Start } from 'types'
import { NotFound } from './404'
import { Options } from './start/routes/options'

library.add(fas, far)
toggleTheme(storage.get<Storage, 'theme'>('theme') ?? 'dark')

const dev = true
export const DEV = <T,>(cb: () => T, module: typeof dev = dev): T | undefined => import.meta.env.DEV && /* module ===  */dev ? cb() : undefined

const Router = () => {
	const nav = useNavigate()

	useEffect(() => {
		DEV(() => nav('/competitive/lobby'))

		const disposes = [
			onNuiEmit<Start.Events['modeSelection']>('start:modeSelection', () => {
				nav('/start')
				focus()
			}),
			onNuiEmit<Start.Events['pause']>('start:pause', () => {
				nav('/start/pause')
				focus()
			})
		]

		return () => {
			for (const dispose of disposes) dispose()
		}
	}, [])

	return (
		<Routes>
			<Route path='/*' element={<NotFound />} />
			<Route path='/start/starting' element={<Starting />} />
			<Route path='/start/credit' element={<Credit />} />
			<Route path='/start/pause' element={<Pause />} />
			<Route path='/start/options' element={<Options />} />
			<Route path='/competitive/lobby' element={<Lobby />} />
			<Route path='/competitive/game' element={<Game />} />
			<Route path='/outlaw' element={<>
				<Hud />
				<Roster />
				{/* <TopScore /> */}
			</>} />
		</Routes>
	)
}

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
						className='absolute bottom-5 left-5 z-1 hiddenx'
						onClick={toggle}
					>
						{theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
				</>
			))}
			<MemoryRouter>
				<Router />
				<Toaster />
			</MemoryRouter>
			{/* <Ipad /> */}
			{/* <Rank /> */}
		</>
	)
}
