import { useState } from "react"
import type { Rank } from "types"

export const useStats = () => {
	const [stats, setStats] = useState<Rank.Player['Stats']>()
	return { stats, setStats }
}