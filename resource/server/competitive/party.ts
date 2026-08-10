import { asserts } from "@lenix/lenix"
import type { Competitive } from "types/index"
import { getProfile } from "./modules"
import { getProfileId } from "./utils"
import { Config } from "common/config/competitive"

type Party = Competitive.Player['Party']

export abstract class Parties {
	private static readonly parties = new Map<number, {
		profiles: Party['profiles']
		leader: Party['leader']
		size: Party['size']
	}>()
	private static readonly playersIgnoringInvites = new Map<number, Set<number>>()

	static async new(
		client: number
	): Promise<Party> {
		const profile = await getProfile(client)
		asserts(profile, `Failed to get profile for player<${client}>`)
	
		 this.parties.set(source, {
			profiles: [{ ...profile, ready: true }],
			leader: profile.profile_id,
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

	static invite(client: number, invited: number) {
		if (this.playersIgnoringInvites.get(invited)?.has(client)) return
	
		emitNet('lenix:server:competitive:getInvited', invited, client)
	}

	static async acceptInvite(client: number, inviter: number): Promise<Party> {
		const inviterParty = this.parties.get(inviter)
		asserts(inviterParty, `Failed to get inviter<${inviter}> party`)

		const profile = await getProfile(client)
		asserts(profile, `Failed to get client<${client}> profile`)

		const party = this.parties.get(client)
		asserts(party, `Failed to get client<${client}> party`)

		asserts(party !== inviterParty, 'Client is already in this party')

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

	static ignoreInvites(client: number, inviter: number) {
		const player = this.playersIgnoringInvites.get(client)
		if (!player) {
			const newSet = new Set<number>()
			this.playersIgnoringInvites.set(client, newSet)
		}
		const newInstance = this.playersIgnoringInvites.get(client)
		asserts(newInstance)

		newInstance.add(inviter)

		setTimeout(() => {
			newInstance.delete(inviter)
			if (newInstance.size > 0) return

			this.playersIgnoringInvites.delete(client)
		}, Config.ignoreInvitesPeriod * 60_000)
	}
}