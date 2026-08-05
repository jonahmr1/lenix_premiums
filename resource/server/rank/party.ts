import type { Rank } from "types/index"

export const parties = new Map<number, Party>()

export class Party {
	profiles: Rank.Player['Profile'][] = []
	leader: Rank.Player['Profile']['profile_id']
	size: number = 1

	constructor(leader: Rank.Player['Profile']) {
		this.profiles = [leader]
		this.leader = leader.profile_id
	}
}
