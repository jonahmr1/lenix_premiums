import './wall'
import emotes from './emotes'
// import rank from './rank'
import identities from './identities'
import radialmenu from './radialmenu'
import criminaltask from './criminaltask'
import vehicles from './vehicles'
import robbery from './robbery'
import roster from './roster'
import elevators from './elevators'
import hud from './hud'
import safezones from './safezones'
// import topscore from './topscore'
import locker from './locker'
// import ipad from './ipad'

export const login = (logout: () => void) => {
	logout()
	const modules = [emotes, /* rank, */ identities, radialmenu, criminaltask, vehicles, robbery, roster, elevators, hud, safezones, /* topscore, */ locker, /* ipad */]
	
	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose()
	}
}