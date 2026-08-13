import { asserts } from "@lenix/lenix"
import type { Competitive } from "types/index"
import { getProfile } from "./modules"
import { getProfileId, getSourceByProfileId } from "./utils"
import { Config } from "common/config/competitive"
import { triggerClientCallback } from "@overextended/ox_lib/server"
import { palette } from "lenix"

type Party = Competitive.Player['Party']

export abstract class Parties {
	private static readonly parties = new Map<number, {
		profiles: Party['profiles']
		leader: Party['leader']
		size: Party['size']
	}>()
	private static readonly playersIgnoringInvites = new Map<number, Set<number>>()
	static #pendingInvites = new Map<number, Set<number>>()

	static async new(
		client: number
	): Promise<Party> {
		const profile = await getProfile(client)
		asserts(profile, `Failed to get profile for player<${client}>`)
	
		 this.parties.set(client, {
			profiles: [{ ...profile, ready: true }],
			leader: profile.profile_id,
			size: 1
		})

		const party = this.parties.get(client)
		asserts(party)
		
		return party
	}

	static async invite(client: number, invited: number, recursive?: true): Promise<void> {
		try {
			if (!recursive) {
				if (this.playersIgnoringInvites.get(invited)?.has(client)) return
			}

			asserts(client !== invited, `client<${client}> tried to invite himself`)
			const profile = await getProfile(client)
			asserts(profile, `Failed to get client<${client}> profile`)

			const party = this.partyByProfileId(profile.profile_id)
			asserts(party, `Failed to get client<${client}> party`)

			const invitedProfile = await getProfile(invited)
			asserts(invitedProfile, `Failed to get invited<${invited}> profile`)

			asserts(
        !party.profiles.some((profile) => profile.profile_id === invitedProfile.profile_id),
        `invited<${invited}> is already in client<${client}>'s party`
  		)

			const invites = this.#pendingInvites.get(client)
			if (!invites) {
				const newInvites = new Set<number>()
				this.#pendingInvites.set(client, newInvites.add(invited))
				return this.invite(client, invited, true)
			}

			if (invites.has(invited) && !recursive) return

			invites.add(invited)

			setTimeout(() => {
				invites.delete(invited)
			}, Config.invitesSpamPeriod * 1000);
		
			emitNet('lenix:server:competitive:getInvited', invited, client)
		} catch (e) {
			console.log(palette('red', String(e)))
		}
	}

	static async acceptInvite(client: number, inviter: number): Promise<Party> {
		try {
			const inviterInvites = this.#pendingInvites.get(inviter)
			asserts(inviterInvites?.has(client), 'No pending invite from this player')

			const inviterProfile = await getProfile(inviter)
			asserts(inviterProfile, `Failed to get inviter<${inviter}> profile`)

			const inviterParty = this.partyByProfileId(inviterProfile.profile_id)
			asserts(inviterParty, `Failed to get inviter<${inviter}> party`)
			asserts(inviterParty.profiles.length < inviterParty.size, 'Party is full')

			const profile = await getProfile(client)
			asserts(profile, `Failed to get client<${client}> profile`)

			const party = this.partyByProfileId(profile.profile_id)
			asserts(party, `Failed to get client<${client}> party`)

			asserts(party !== inviterParty, 'Client is already in this party')

			const profilesLeft = party.profiles.filter(self => self.profile_id !== profile.profile_id)
			party.profiles = profilesLeft

			// first profile to join the party after the leader ofc
			const newPartyLeader = party.profiles[0]?.profile_id

			if (newPartyLeader) {
				party.leader = newPartyLeader
				const newPartyLeaderSource = getSourceByProfileId(newPartyLeader)
				asserts(newPartyLeaderSource, `Failed to get the new leader<${newPartyLeader}>'s source`)

				const newParty = this.parties.set(newPartyLeaderSource, party).get(newPartyLeaderSource)
				asserts(newParty)
				
				profilesLeft.forEach(profile => {
					const src = getSourceByProfileId(profile.profile_id)
					asserts(src, `Failed to get profile_id<${profile.profile_id}>'s source`)
		
					triggerClientCallback('lenix:server:competitive:updateParty', src, newParty)
				})
			}
			this.parties.delete(client)

			inviterParty.profiles.push({ ...profile, ready: false })

			inviterParty.profiles.forEach(profile => {
				const src = getSourceByProfileId(profile.profile_id)
				asserts(src, `Failed to get profile_id<${profile.profile_id}>'s source`)

				triggerClientCallback('lenix:server:competitive:updateParty', src, inviterParty)
			})
			
			inviterInvites?.delete(client)
			return inviterParty
		} catch (e) {
			console.log(palette('red', String(e)))
			throw e
		}
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

	static partyByProfileId(profile_id: string) {
		return [...this.parties.values()].find(party =>
			party.profiles.some(profile => profile.profile_id === profile_id)
		)
	}

	static async setSize(client: number, size: number): Promise<Party> {
		const profile = await getProfile(client)
		asserts(profile, `Failed to get client<${client}> profile`)

		const party = this.partyByProfileId(profile.profile_id)
		asserts(party, `Could not find party for client<${client}>`)

		asserts(party.profiles.length < size, `client<${client}> tried to set party size into a value less than the current party profiles length`)
		asserts(party.leader === profile.profile_id, `client<${client}> tried to modify party size while he wasn't the leader`)

		party.size = size

		return party
	}

	static async updateReadiness(client: number, status: 'ready' | 'unready') {
		const profile = await getProfile(client)
		asserts(profile, `Failed to get client<${client}> profile`)

		const party = this.partyByProfileId(profile.profile_id)
		asserts(party, `Failed to get client<${client}> party`)

		const partyProfile = party.profiles.find(self => self.profile_id === profile.profile_id)
		asserts(partyProfile, `Failed to get client<${client}> partyProfile`)

		partyProfile.ready = status === 'ready' ? true : false
	}

	static async leaveParty(client: number) {
		const profile = await getProfile(client)
		asserts(profile, `Failed to get client<${client}> profile`)

		const party = this.partyByProfileId(profile.profile_id)
		asserts(party, `Failed to get client<${client}> party`)

		party.profiles = party.profiles.filter(self => self.profile_id !== profile.profile_id)
		party.profiles.forEach(profile => {
			const src = getSourceByProfileId(profile.profile_id)

			triggerClientCallback('lenix:server:competitive:updateParty', src, party)
		})
	}
}