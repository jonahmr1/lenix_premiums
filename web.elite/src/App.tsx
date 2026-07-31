import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { toggleTheme } from './lib/theme'
import { MemoryRouter, Routes, Route } from 'react-router'
import { Home } from './routes/lobby'
import { InGame } from './routes/in-game'
import { Toaster } from './components/ui/sonner'

toggleTheme(getStorage<Storage>('theme') ?? 'dark')

function App() {
	return (
		<>
			<MemoryRouter>
				<div className='bg-background/99'>
					<Routes>
						<Route path={'/*'} element={<Home />} />
						<Route path={'/in-game'} element={<InGame />} />
					</Routes>
					<Toaster />
				</div>
			</MemoryRouter>
		</>
	)
}

export default App
