import { StrictMode } from "react"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { router } from './router'
import './index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { Toaster } from "./components/ui/sonner"
import { StatesProvider } from "./provider"
import { storage } from "@lenix/lenix"

library.add(fas, far)

storage.set('theme', 'dark')

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark">
			<StatesProvider>
				<RouterProvider router={router} />
				<Toaster
					id='notify'
					position='top-center'
					offset={{ top: '10%' }}
					expand={false}
					toastOptions={{
						classNames: {
							default: 'bg-transparent! border-transparent! shadow-none! text-foreground! font-medium text-shadow-sm! text-v-1.5! text-center'
						}
					}}
				/>
			</StatesProvider>
		</ThemeProvider>
	</StrictMode>,
)