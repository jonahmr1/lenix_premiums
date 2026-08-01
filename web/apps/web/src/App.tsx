import { Rank } from "./rank/app"

export function App() {
  return (
		<>
			<img
				src="/ped.png"
				className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
			/>
			{/* <Ipad /> */}
			<Rank />
		</>
  )
}
