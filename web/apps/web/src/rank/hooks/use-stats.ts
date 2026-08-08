import { useState } from "react"
import type { Competitive } from "types"

export const useStats = () => {
	const [stats, setStats] = useState<Competitive.Player['Stats']>()
	return { stats, setStats }
}