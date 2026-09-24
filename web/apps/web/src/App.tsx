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
import { Lobby } from './competitive/routes/lobby'
import { Game } from './competitive/routes/game'
import { useEffect } from 'react'
import { focusNui, onNuiEmit } from 'lenix/nui'
import type { Start } from 'types'
import { NotFound } from './404'
import { Settings } from './settings'
import { Mode } from './competitive/routes/mode'
import { Starting } from './start'
import { Credit } from './credit'
import { Pause } from './pause'
import { StatesProvider } from './provider'

library.add(fas, far)
toggleTheme(storage.get<Storage, 'theme'>('theme') ?? 'dark')

const dev = false
export const DEV = <T,>(cb: () => T, _module: typeof dev | any = dev): T | undefined => import.meta.env.DEV && /* module ===  */dev ? cb() : undefined

const Router = () => {
	const nav = useNavigate()

	useEffect(() => {
		DEV(() => nav('/'))

		const disposes = [
			onNuiEmit<Start.Events['modeSelection']>('start:modeSelection', () => {
				nav('/start')
				focusNui()
			}),
			onNuiEmit<Start.Events['pause']>('start:pause', () => {
				nav('/pause')
				focusNui()
			})
		]

		return () => {
			for (const dispose of disposes) dispose()
		}
	}, [])

	return (
		<Routes>
			<Route path='/*' element={<NotFound />} />
			<Route path='/start' element={<Starting />} />
			<Route path='/credit' element={<Credit />} />
			<Route path='/pause' element={<Pause />} />
			<Route path='/settings' element={<Settings />} />

			<Route path='/competitive/lobby' element={<Lobby />} />
			<Route path='/competitive/lobby/mode' element={<Mode />} />
			<Route path='/competitive/game' element={<Game />} />

			<Route path='/outlaw' element={<>
				<Hud />
				<Roster />
				{/* <Ipad /> */}
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
						src={`lobby.png`}
						className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
					/>
					<Button
						className='absolute bottom-5 left-5 z-1 hidden'
						onClick={toggle}
					>
						{theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
				</>
			))}
			<MemoryRouter>
				<StatesProvider>
					<Router />
					<Toaster
						id='notify'
						position='top-center'
						offset={{ top: '10%' }}
						expand={false}
						toastOptions={{
							classNames: {
								default: 'bg-transparent! border-transparent! shadow-none! text-foreground! font-semibold text-shadow-sm! text-fluid-2! justify-center'
							}
						}}
					/>
				</StatesProvider>
			</MemoryRouter>
			{/* <Rank /> */}
		</>
	)
}
