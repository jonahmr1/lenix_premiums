import './wall'
import emotes from './emotes'
import rank from './rank'
import identities from './identities'
import radialmenu from './radialmenu'
import criminaltask from './criminaltask'
import rent from './rent'
import robbery from './robbery'
import roster from './roster'
import elevators from './elevators'
import hud from './hud'
import safezones from './safezones'
import topscore from './topscore'

export const login = (logout: () => void) => {
	logout()
	const modules = [emotes, rank, identities, radialmenu, criminaltask, rent, robbery, roster, elevators, hud, safezones, topscore]
	
	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose()
	}
}