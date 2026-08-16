import { MemoryRouter, Routes, Route, useNavigate } from 'react-router'
import { Toaster } from '@workspace/ui/components/sonner'
import { InGame as EliteInGame } from './rank/routes/elite/in-game'
import { Lobby as EliteLobby } from './rank/routes/elite/lobby'
import { InGame as ValoInGame } from './rank/routes/valo/in-game'
import { Lobby as ValoLobby } from './rank/routes/valo/lobby'

import '@workspace/ui/globals.css'
import '@workspace/elite/globals.css'
import '@workspace/valo/globals.css'
import { useEffect } from 'react'
import type { Competitive } from 'types'
import { onNuiEmit } from 'lenix/nui'

export const DEV = true

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

const RankRoutes = () => {
	const navigate = useNavigate()
	
	useEffect(() => {
		if (DEV) {
			navigate('/in-game')
			return
		}
		const dispose = onNuiEmit<Competitive.Events['updateStage']>('competitive:updateStage', stage => {
			navigate(
				stage === 'lobby' ? '/' :
				stage === 'in-game' ? '/in-game' :
				'/'
			)
		})

		return dispose
	}, [])

	return (
		<div className={VARIANT}>
			<Routes>
				<Route path={'/*'} element={VARIANTS[VARIANT].home} />
				<Route path={'/in-game'} element={VARIANTS[VARIANT].lobby} />
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
