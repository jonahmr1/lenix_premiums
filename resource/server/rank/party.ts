import type { Rank } from "types/index"

type IParty = Rank.Player['Party']

export const parties = new Map<number, Party>()

export class Party implements IParty {
	accessor profiles: Rank.Player['Profile'][] = []
	accessor size: number = 1
	accessor leader: Rank.Player['Profile']['profile_id']

	constructor(leader: Rank.Player['Profile']) {
		this.leader = leader.profile_id
		this.profiles.push(leader)
	}
}