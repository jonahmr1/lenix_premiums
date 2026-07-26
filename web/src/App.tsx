import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { toggleTheme } from './lib/theme'
import { Home } from './routes/home'
import { MemoryRouter, Routes, Route } from 'react-router'

const theme = getStorage<Storage>('theme')
if (theme) toggleTheme(theme)

function App() {
	return (
		<MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
	)
}

export default App