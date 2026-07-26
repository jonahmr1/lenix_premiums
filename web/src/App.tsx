import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { toggleTheme } from './lib/theme'
import { Home } from './routes/home'
import { MemoryRouter, Routes, Route } from 'react-router'
import ped from './assets/ped.png'
import { Header } from './components/header'

const theme = getStorage<Storage>('theme')
if (theme) toggleTheme(theme)

function App() {
	return (
		<>
			<img src={ped} className="absolute h-full object-cover pointer-events-none -z-1" />
			<div className='backdrop-blur-sm'>
				<Header />
				<MemoryRouter>
					<Routes>
						<Route path="/" element={<Home />} />
					</Routes>
				</MemoryRouter>
			</div>
		</>
	)
}

export default App