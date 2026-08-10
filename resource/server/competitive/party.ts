import { asserts } from "@lenix/lenix"
import type { Competitive } from "types/index"
import { getProfile } from "./modules"
import { getProfileId } from "./utils"

type Party = Competitive.Player['Party']

export abstract class Parties {
	private static parties = new Map<number, {
		profiles: Party['profiles']
		leader: Party['leader']
		size: Party['size']
	}>()

	static new(
		leader: Omit<Party['profiles'][number], 'ready'>,
		source: number
	): Party {
		 this.parties.set(source, {
			profiles: [{ ...leader, ready: true }],
			leader: leader.profile_id,
			size: 1
		})

		const party = this.parties.get(source)
		asserts(party)
		
		return party
	}

	static setSize(client: number, size: number): Party {
		const party = this.parties.get(client)
		asserts(party, `Could not find party for client<${client}>`)

		party.size = size

		return party
	}

	static async acceptInvite(client: number, inviter: number): Promise<Party> {
		const inviterParty = this.parties.get(inviter)
		asserts(inviterParty, `Failed to get inviter<${inviter}> party`)

		const profile = await getProfile(client)
		asserts(profile, `Failed to get client<${client}> profile`)

		const party = this.parties.get(client)
		asserts(party, `Failed to get client<${client}> party`)

		const profilesLeft = party.profiles.filter(self => self.profile_id !== profile.profile_id)
		party.profiles = profilesLeft

		const newPartyLeader = party.profiles[0]?.profile_id
		if (newPartyLeader) {
			party.leader = newPartyLeader
			const newPartyLeaderSource = getPlayers().find(player => getProfileId(Number(player)) === newPartyLeader)
			asserts(newPartyLeaderSource, `Failed to get the new leader<${newPartyLeader}>'s source`)
			
			this.parties.set(Number(newPartyLeaderSource), party)
		}
		this.parties.delete(client)

		inviterParty.profiles.push({ ...profile, ready: false })

		return inviterParty
	}
}