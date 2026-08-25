import { asserts, storage } from '@lenix/lenix'
import { useState } from 'react'

interface Storage {
	theme: 'dark' | 'light'
}

const getTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

export const toggleTheme = (theme: Storage['theme'] = getTheme() === 'dark' ? 'light' : 'dark') => {
	asserts(theme, `Expected theme to be 'dark' | 'light', got ${theme}`)

	const html = document.documentElement

	if (theme === 'dark') html.classList.add(theme)
	else html.classList.remove('dark')

	storage.set<Storage>('theme', theme)
}

export const useTheme = () => {
	const [theme, setTheme] = useState<Storage['theme']>(getTheme)

	const toggle = () => {
		const nextTheme = theme === 'dark' ? 'light' : 'dark'

		toggleTheme(nextTheme)
		setTheme(nextTheme)
	}

	return { theme, toggle }
}
