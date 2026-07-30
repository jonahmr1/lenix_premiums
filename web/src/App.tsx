import { useState } from "react"

function App() {
	const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const tabletBgClass =
    orientation === "portrait"
      ? "bg-[url('/portrait.jpg')]"
      : "bg-[url('/landscape.jpg')]"

	return (
		<div className="h-screen w-full flex items-center justify-center">
			<img src={'/ped.png'} className="absolute h-full object-cover pointer-events-none -z-1" />
			<div className={`bg-muted ${orientation === 'portrait' ? 'h-8/10 w-5/10' : 'h-5/10 w-8/10'} ${tabletBgClass}`}>

			</div>
		</div>
	)
}

export default App
