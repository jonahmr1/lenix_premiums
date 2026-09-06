import { random } from "@lenix/lenix"
import { useEffect, useState } from "react"
import impact from '@workspace/ui/assets/competitive/bullet-impact.wav'
import { DEV } from "@/App"

const player = new Howl({
	src: impact,
	volume: 0.1
})

export const HitMarker = () => {
	const [state, setVariant] = useState<{ id: number, variant: 'kill' | 'hit'}>()

	useEffect(() => {
		if (!DEV('competitive')) return
		const interval = setInterval(() => {
			const variant = (['kill', 'hit'] as const)[random(0, 1)]
			if (variant === 'kill') player.play()
			setVariant(prev => ({ variant, id: (prev?.id ?? 1) + 1}))
		}, 100)

		return () => clearInterval(interval)
	}, [])

	if (!state) return

	return (
		<>
			{state.variant === 'kill' ? (
				<div
					key={state.id}
					className='
						absolute left-1/2 top-1/2 -translate-x-2 -translate-y-2.5
						[&>div]:absolute [&>div]:space-y-px [&>div>div]:h-0.5 [&>div>div]:w-4 [&>div>div]:bg-red-800
					'
				>
					<div className="-left-2 rotate-45 animate-hit-tl [&>div]:[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]">
						<div />
						<div />
					</div>
					<div className="left-2 -rotate-45 animate-hit-tr [&>div]:[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]">
						<div />
						<div />
					</div>
					<div className="left-2 top-4 rotate-45 animate-hit-br [&>div]:[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]">
						<div />
						<div />
					</div>
					<div className="-left-2 top-4 -rotate-45 animate-hit-bl [&>div]:[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]">
						<div />
						<div />
					</div>
				</div>
			) : state.variant === 'hit' && (
				<div
					key={state.id}
					className='
						absolute left-1/2 top-1/2 -translate-x-1 -translate-y-1.75 [--hit-offset:2px]
						[&>div]:absolute [&>div]:space-y-px [&>div>div]:h-0.5 [&>div>div]:w-2 [&>div>div]:bg-white/60
					'
				>
					<div className="-left-1.5 rotate-45 animate-hit-tl [&>div]:[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]">
						<div />
					</div>
					<div className="left-1.5 -rotate-45 animate-hit-tr [&>div]:[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]">
						<div />
					</div>
					<div className="left-1.5 top-3 rotate-45 animate-hit-br [&>div]:[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]">
						<div />
					</div>
					<div className="-left-1.5 top-3 -rotate-45 animate-hit-bl [&>div]:[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]">
						<div />
					</div>
				</div>
			)}
		</>
	)
}
