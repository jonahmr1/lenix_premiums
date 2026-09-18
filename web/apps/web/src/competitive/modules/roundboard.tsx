import { DEV } from "@/App"
import { random } from "@lenix/lenix"
import { useEffect, useState } from "react"
import { Progress } from '@workspace/ui/components/progress'
import { Layout } from "@/components/layout"
import { zeroed } from "@/lib"
import { MODES } from "../constants"

const target = MODES.team_deathmatch.scoreLimit

export const Roundboard = () => {
	const [state, setState] = useState<{ own: number, opponent: number }>()

	useEffect(() => {
		return DEV(() => {
			const interval = setInterval(() => {
				setState({
					own: random(0, target),
					opponent: random(0, target),
				})
			}, 1000)

			return () => clearInterval(interval)
		}, 'competitive')
	}, [])

	if (!state) return null

	const winning = state.own > state.opponent

	return (
		<Layout className="absolute top-0 right-1/2 translate-x-1/2 w-1/3">
			<p className="text-center font-number text-fluid-1.5 text-neutral-400 text-shadow-lg">08:40</p>
			<div className="flex items-center font-number gap-xs tracking-wider">
				<p className="bg-deep-brand text-brand px-sm perspective-left-20">{zeroed(state.own, 3)}</p>
				<Progress value={state.own} className="h-xs bg-deep-brand" barClassName="bg-brand" />
				<p className="bg-ring/50 text-foreground px-sm">{target}</p>
				<Progress value={state.opponent} className="rotate-180 h-xs bg-deep-opposite" barClassName="bg-opposite" />
				<p className="bg-deep-opposite text-opposite px-sm perspective-right-20">{zeroed(state.opponent, 3)}</p>
			</div>
			<p className={`text-fluid-1.5 uppercase font-barlow font-bold italic text-center text-shadow-lg ${winning ? 'text-brand' : 'text-opposite'}`}>{winning ? 'Winning' : 'Losing'}</p>
		</Layout>
	)
}