import { DEV } from "@/App"
import { useEffect, useState } from "react"

export const Ping = () => {
	const [state, setState] = useState<{
		top: number
		left: number
		color: string
		meter: number
	} | null>(null)

	useEffect(() => {
		DEV(() => setState({ top: 40, left: 60, color: 'blue', meter: 459 }), 'competitive')
	}, [])

	if (!state) return null

	return (
		<div
			className="absolute-center"
			style={{
				top: `${state.top}%`,
				left: `${state.left}%`
			}}
		>
			<p className="text-white text-fluid-1.5 text-shadow-md">{state.meter}m</p>
			<div
				className="size-2.5 rotate-45 rounded-xs opacity-75 ring"
				style={{
					backgroundColor: state.color,
				}}
			/>
		</div>
	)
}