import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { toggleTheme } from './lib/theme'
import { MemoryRouter, Routes, Route } from 'react-router'
import ped from './assets/ped.png'
import { routes } from './routes/data'
import type { Route as IRoute} from './types'

const theme = getStorage<Storage>('theme')
if (theme) toggleTheme(theme)

const renderRoutes = (routes: IRoute[]) => routes.map(route => (
	<Route key={route.to} path={route.to} element={route.element}>
		{route.children && renderRoutes(route.children)}
	</Route>
))

function App() {
	return (
		<>
			<img src={ped} className="absolute h-full object-cover pointer-events-none -z-1" />
			<MemoryRouter>
				<div className='backdrop-blur-lg bg-background/80'>
					<Routes>{renderRoutes(routes)}</Routes>
				</div>
			</MemoryRouter>
		</>
	)
}

export default App