import { random } from "@lenix/lenix"
import { useEffect, useState } from "react"
import { Progress } from '@/components/ui/progress'
import { Layout } from "@/components/layout"
import { formatTime, timestamp, zeroed } from "@/lib"
import { WARZONE_MODES } from "@/constants"
import { useTimer } from 'react-timer-hook'
import type { MatchScore } from "@/types"

const target = WARZONE_MODES.team_deathmatch.scoreLimit
const duration = WARZONE_MODES.team_deathmatch.duration

export const Roundboard = () => {
	const [state, setState] = useState<MatchScore>()
	const timer = useTimer({ expiryTimestamp: timestamp(duration) })

	useEffect(() => {
		const interval = setInterval(() => {
			setState({
				own: random(0, target),
				opponent: random(0, target),
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	if (!state) return null

	const winning = state.own > state.opponent

	return (
		<Layout className="absolute top-0 right-1/2 translate-x-1/2 w-1/3 mx-0!">
			<p className={`text-center text-v-1 text-foreground text-shadow-lg uppercase font-black tracking-normal ${timer.isRunning ? 'font-number' : 'font-sans'}`}>
				{timer.isRunning ? formatTime(timer.totalSeconds * 1000) : 'Overtime'}
			</p>
			<div className="flex items-center font-number gap-w-0.5 tracking-wider">
				<p className="bg-chart-5 text-chart-1 px-w-0.5 perspective-left-20 glow-sm">{zeroed(state.own, 3)}</p>
				<Progress value={state.own} className="h-h-0.5 bg-chart-5 **:data-[slot=progress-indicator]:bg-chart-2" />
				<p className="bg-muted text-foreground px-w-0.5">{target}</p>
				<Progress value={state.opponent} className="rotate-180 h-h-0.5 bg-deep-destructive **:data-[slot=progress-indicator]:bg-opposite"  />
				<p className="bg-deep-destructive text-opposite px-w-0.5 perspective-right-20 glow-sm">{zeroed(state.opponent, 3)}</p>
			</div>
			<p className={`text-v-1 uppercase font-sans font-bold italic text-center text-shadow-lg glow-sm ${winning ? 'text-chart-3' : 'text-opposite'}`}>
				{winning ? 'Winning' : 'Losing'}
			</p>
		</Layout>
	)
}