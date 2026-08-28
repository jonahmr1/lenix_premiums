import './wall'
import emotes from './emotes'
import rank from './rank.interface'

export const login = (logout: () => void) => {
	logout()
	const modules = [emotes, rank]
	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose()
	}
}