import type { Competitive } from "types/index"

export const parties = new Map<number, Party>()

type IParty = Competitive.Player['Party']

export class Party implements IParty {
	profiles: IParty['profiles']
	leader: IParty['leader']
	size: IParty['size']

	constructor(leader: typeof this.profiles[number]) {
		this.profiles = [leader]
		this.leader = leader.profile_id
		this.size = 1
	}
}
