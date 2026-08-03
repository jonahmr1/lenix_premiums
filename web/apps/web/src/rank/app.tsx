import { MemoryRouter, Routes, Route } from 'react-router'
import { Toaster } from "@workspace/elite/components/sonner"
import { Home } from './routes/lobby'
import { InGame } from './routes/in-game'

export const Rank = () => {
	return (
		<>
			<MemoryRouter>
				<div className='elite'>
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
