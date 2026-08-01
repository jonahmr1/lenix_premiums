import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { MemoryRouter, Routes, Route } from 'react-router'
import { toggleTheme } from './lib'
import { Toaster } from "@workspace/elite/components/sonner"
import { Home } from './routes/lobby'
import { InGame } from './routes/in-game'

toggleTheme(getStorage<Storage, 'theme'>('theme') ?? 'dark')

export const Rank = () => {
	return (
		<>
			<MemoryRouter>
				<div className='bg-background/99 elite'>
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
