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
		return DEV(() => {
			const interval = setInterval(() => {
				setState(prev => prev ? (
					prev.left < 100 && prev.top === 0
						? { ...prev, left: prev.left + 1, meter: prev.meter + 1 }
						: prev.left === 100 && prev.top < 100
							? { ...prev, top: prev.top + 1, meter: prev.meter + 1 }
							: prev.top === 100 && prev.left > 0
								? { ...prev, left: prev.left - 1, meter: prev.meter + 1 }
								: prev.top > 0
									? { ...prev, top: prev.top - 1, meter: prev.meter + 1 }
									: { ...prev, left: prev.left + 1, meter: prev.meter + 1 }
				) : {
					top: 0, left: 0, color: 'blue', meter: 0
				})
			}, 50)
			return () => clearInterval(interval)
		}, 'competitive')
	}, [])

	if (!state) return null

	return (
		<div
			className="absolute-center"
			style={{
				top: `${Math.min(95, Math.max(5, state.top))}%`,
				left: `${Math.min(95, Math.max(5, state.left))}%`
			}}
		>
			<p className="text-white text-fluid-1.5 text-shadow-md">{state.meter}m</p>
			<div
				className="size-2.5 rotate-45 rounded-xs opacity-75 ring-neutral-50 ring"
				style={{
					backgroundColor: state.color,
				}}
			/>
		</div>
	)
}