import { DEV } from "@/App"
import { useEffect, useState } from "react"

const segments = 6
const maxHealth = 100
const segmentHealth = maxHealth / segments

export const Hud = () => {
	const [state, setState] = useState<{ health: number }>()

	useEffect(() => {
		DEV(() => setState({ health: 25 }), 'competitive')
	}, [])

	if (!state) return null

	return (
		<div className="absolute bottom-1/20 left-1/20">
			<div className="flex items-end text-white">
				<p className="leading-tight text-fluid-2">{state.health}</p>
				<p className="text-fluid-1.5 text-white/70">/{maxHealth}</p>
			</div>
			<div className="flex gap-px">
				{[...Array(segments).keys()].map(index => (
					<div key={index} className="w-7 h-4 bg-white/25 rounded-xs overflow-hidden">
						<div
							className="bg-white h-full rounded-xs"
							style={{
								width: `${Math.min(
									maxHealth,
									Math.max(0, ((state.health - index * segmentHealth) / segmentHealth) * maxHealth),
								)}%`
							}}
						/>
					</div>
				))}
			</div>
		</div>
	)
}