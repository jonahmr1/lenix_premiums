import { DEV } from "@/App"

export const HitMarker = () => {
	if (!DEV('competitive')) return null
	
	return (
		<div className='absolute-center'>
			<div className={`relative [&>div]:absolute [&>div]:space-y-px [&>div>div]:h-0.5 [&>div>div]:w-4 [&>div>div]:bg-red-800`}>
				<div className="-left-3.5 rotate-45 [&>div]:[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]">
					<div></div>
					<div></div>
				</div>
				<div className="left-3.5 -rotate-45 [&>div]:[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]">
					<div></div>
					<div></div>
				</div>
				<div className="left-3.5 top-7 rotate-45 [&>div]:[clip-path:polygon(0_0,100%_25%,100%_75%,0_100%)]">
					<div></div>
					<div></div>
				</div>
				<div className="-left-3.5 top-7 -rotate-45 [&>div]:[clip-path:polygon(0_25%,100%_0,100%_100%,0_75%)]">
					<div></div>
					<div></div>
				</div>
			</div>
		</div>
	)
}