import { MemoryRouter, Routes, Route } from 'react-router'
import { Toaster } from '@workspace/ui/components/sonner'
import { InGame as EliteInGame } from './rank/routes/elite/in-game'
import { Lobby as EliteLobby } from './rank/routes/elite/lobby'
import { InGame as ValoInGame } from './rank/routes/valo/in-game'
import { Lobby as ValoLobby } from './rank/routes/valo/lobby'

import '@workspace/ui/globals.css'
import '@workspace/elite/globals.css'
import '@workspace/valo/globals.css'

const VARIANT: keyof typeof VARIANTS = 'valo'
const VARIANTS = {
	elite: {
		home: <EliteLobby />,
		lobby: <EliteInGame />,
	},
	valo: {
		home: <ValoLobby />,
		lobby: <ValoInGame />,
	}
}

export const Rank = () => {
	return (
		<>
			<MemoryRouter>
				<div className={VARIANT}>
					<Routes>
						<Route path={'/*'} element={VARIANTS[VARIANT].home} />
						<Route path={'/in-game'} element={VARIANTS[VARIANT].lobby} />
					</Routes>
					<Toaster />
				</div>
			</MemoryRouter>
		</>
	)
}
