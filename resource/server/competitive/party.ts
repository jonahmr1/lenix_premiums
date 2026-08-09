import type { Competitive } from "types/index"

export const parties = new Map<number, Party>()

export class Party {
	profiles: (Competitive.Player['Profile'] & { ready: boolean })[] = []
	leader: Competitive.Player['Profile']['profile_id']
	size: number = 1

	constructor(leader: Competitive.Player['Profile']) {
		this.profiles = [{ ...leader, ready: false }]
		this.leader = leader.profile_id
	}
}
