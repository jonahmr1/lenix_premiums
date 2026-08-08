import { useState } from 'react'
import type { Competitive } from 'types'

export const useLeaderboard = () => {
	const [leaderboard, setLeaderboard] = useState<Competitive.Leaderboard>()
	return { leaderboard, setLeaderboard }
}
