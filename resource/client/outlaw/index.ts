import './wall'
import emotes from './emotes'
import rank from './rank.interface'
import identities from './identities'
import radialmenu from './radialmenu'
import criminaltask from './criminaltask'

export const login = (logout: () => void) => {
	logout()
	const modules = [emotes, rank, identities, radialmenu, criminaltask]
	
	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose()
	}
}