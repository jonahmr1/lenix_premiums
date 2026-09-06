import { MemoryRouter, Routes, Route, useNavigate } from 'react-router'
import { Toaster } from '@workspace/ui/components/sonner'
import { InGame as EliteInGame } from './rank/routes/elite/in-game'
import { Lobby as EliteLobby } from './rank/routes/elite/lobby'
import { InGame as ValoInGame } from './rank/routes/valo/in-game'
import { Lobby as ValoLobby } from './rank/routes/valo/lobby'
import { Loading as ValoLoading } from './rank/routes/valo/loading'

import '@workspace/elite/globals.css'
import '@workspace/valo/globals.css'
import { useEffect } from 'react'
import type { Competitive } from 'types'
import { onNuiEmit } from 'lenix/nui'
import { DEV } from './App'


const VARIANT: keyof typeof VARIANTS = 'valo'
const VARIANTS = {
	elite: {
		lobby: <EliteLobby />,
		in_game: <EliteInGame />,
		loading: <ValoLoading />,
	},
	valo: {
		lobby: <ValoLobby />,
		in_game: <ValoInGame />,
		loading: <ValoLoading />,
	}
}

const RankRoutes = () => {
	const navigate = useNavigate()
	
	useEffect(() => {
		DEV(() => navigate('/in-game'), 'rank')
		
		const dispose = onNuiEmit<Competitive.Events['updateStage']>('competitive:updateStage', stage => {
			navigate(
				stage === 'lobby' ? '/' :
				stage === 'loading' ? '/loading' :
				stage === 'in-game' ? '/in-game' :
				'/'
			)
		})

		return dispose
	}, [])

	return (
		<div className={VARIANT}>
			<Routes>
				<Route path={'/*'} element={VARIANTS[VARIANT].lobby} />
				<Route path={'/in-game'} element={VARIANTS[VARIANT].in_game} />
				<Route path={'/loading'} element={VARIANTS[VARIANT].loading} />
			</Routes>
			<Toaster />
		</div>
	)
}

export const Rank = () => (
	<MemoryRouter>
		<RankRoutes />
	</MemoryRouter>
)
