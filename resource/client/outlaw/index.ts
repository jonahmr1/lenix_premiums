import './wall'
import emotes from './emotes'
import rank from './rank.interface'
import identities from './identities'

export const login = (logout: () => void) => {
	logout()
	const modules = [emotes, rank, identities]
	
	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose()
	}
}