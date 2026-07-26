import { setStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { asserts } from 'lenix'

export const toggleTheme = (theme: Storage['theme'] = document.documentElement.classList.contains('dark') ? 'light' : 'dark') => {
	asserts(theme, `Expected theme to be 'dark' | 'light', got ${theme}`)
	const html = document.documentElement

	if (theme === 'dark') html.classList.add(theme)
	else html.classList.remove('dark');

	setStorage<Storage>('theme', theme)
}