import { toggleTheme } from "@workspace/ui/hooks/theme"
import { Rank } from "./rank/app"
import { getStorage } from "@lenix/lenix"

toggleTheme(getStorage<Storage, 'theme'>('theme') ?? 'dark')

export function App() {
  return (
		<>
			{/* <img
				src="/ped.png"
				className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
			/> */}
			{/* <Ipad /> */}
			<Rank />
		</>
  )
}
