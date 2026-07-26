import { getStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { toggleTheme } from './lib/theme'
import { Button } from './components/ui/button'

const theme = getStorage<Storage>('theme')
if (theme) toggleTheme(theme)

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button
				onClick={() => toggleTheme()}
			>Toggle</Button>
    </div>
  )
}

export default App