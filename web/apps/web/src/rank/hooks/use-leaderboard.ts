import { useState } from "react"
import type { Rank } from "types"

export const useLeaderboard = () => {
	const [leaderboard, setLeaderboard] = useState<Rank.Leaderboard>()
	return { leaderboard, setLeaderboard }
}