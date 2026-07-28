import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { toggleTheme } from './lib/theme'
import { MemoryRouter, Routes, Route } from 'react-router'
import ped from './assets/ped.png'
import { Home } from './routes/lobby'
import { InGame } from './routes/in-game'

const theme = getStorage<Storage>('theme')
if (theme) toggleTheme(theme)

function App() {
	return (
		<>
			<img src={ped} className="absolute h-full object-cover pointer-events-none -z-1" />
			<MemoryRouter>
				<div className='backdrop-blur-lg bg-background/80'>
					<Routes>
						<Route path={'/:tab'} element={<Home />} />
						<Route path={'/in-game'} element={<InGame />} />
					</Routes>
				</div>
			</MemoryRouter>
		</>
	)
}

export default App