import { toggleTheme } from '@workspace/ui/hooks/theme'
import { storage } from '@lenix/lenix'
import { Starting } from './App.start'

import '@workspace/ui/globals.css'

toggleTheme(storage.get<Storage, 'theme'>('theme') ?? 'dark')

export function App() {
	return (
		<>
			{/* <img
				src="/ped.png"
				className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
			/> */}
			{/* <Ipad /> */}
			{/* <Rank /> */}
			<Starting />
		</>
	)
}
