import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { toggleTheme } from './lib/theme'
import { Home } from './routes/home'
import { MemoryRouter, Routes, Route } from 'react-router'
import ped from './assets/ped.png'
import { Header } from './components/header'
import { BackToBack } from './routes/back-to-back'
import { Leaderboard } from './routes/leaderboard'
import { BombPlant } from './routes/bomb-plant'
import { GroundBattle } from './routes/ground-battle'
import { CustomGame } from './routes/custom-game'
import { Play } from './routes/play'

const theme = getStorage<Storage>('theme')
if (theme) toggleTheme(theme)

function App() {
	return (
		<>
			<img src={ped} className="absolute h-full object-cover pointer-events-none -z-1" />
			<div className='backdrop-blur-lg'>
				<MemoryRouter>
					<Header />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/play" element={<Play />}>
							<Route path="back-to-back" element={<BackToBack />} />
							<Route path="leaderboard" element={<Leaderboard />} />
							<Route path="bomb-plant" element={<BombPlant />} />
							<Route path="ground-battle" element={<GroundBattle />} />
							<Route path="custom-game" element={<CustomGame />} />
						</Route>
					</Routes>
				</MemoryRouter>
			</div>
		</>
	)
}

export default App