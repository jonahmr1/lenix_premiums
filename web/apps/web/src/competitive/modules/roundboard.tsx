import { DEV } from "@/App"
import { random } from "@lenix/lenix"
import { useEffect, useState } from "react"
import { Progress } from '@workspace/ui/components/progress'
import { Layout } from "@/components/layout"
import { zeroed } from "@/lib"
import { MODES } from "../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const target = MODES.team_deathmatch.scoreLimit

export const Roundboard = () => {
	const [state, setState] = useState<{ own: number, opponent: number }>()

	useEffect(() => {
		DEV(() => {
			setState({
				own: random(0, target),
				opponent: random(0, target),
			})
		}, 'competitive')
	}, [])

	if (!state) return null

	return (
		<Layout className="absolute top-0 right-1/2 translate-x-1/2 w-1/3 flex items-center gap-xs font-number tracking-wider">
			<div className="bg-deep-brand text-brand px-sm">{zeroed(state.own, 3)}</div>
			<Progress value={state.own} className="h-xs bg-deep-brand" barClassName="bg-brand" />
			<div className="bg-ring/50 text-foreground px-sm">
				<span>{target}</span>
				<FontAwesomeIcon className={`absolute -top-1/3 right-1/2 translate-x-1/2 text-xs ${state.own > state.opponent && 'text-brand'}`} icon={['fas', 'crown']} />
			</div>
			<Progress value={state.opponent} className="rotate-180 h-xs" />
			<div className="bg-foreground text-background px-sm">{zeroed(state.opponent, 3)}</div>
		</Layout>
	)
}