import { asserts } from "@lenix/lenix"
import type { Competitive } from "types/index"
import { fetchProfile } from "./modules"
import { Config } from "common/config/competitive"
import { triggerClientCallback } from "@overextended/ox_lib/server"
import { palette } from "lenix"


type Party = Competitive.Player['Party']


export abstract class Parties {
	private static readonly parties = new Set<{
		profiles: Party['profiles']
		leader: Party['leader']
		roomAvailable: Party['roomAvailable']
	}>()
	private static readonly playersIgnoringInvites = new Map<number, Set<number>>()
	static #pendingInvites = new Map<number, Set<number>>()


	static getProfileFromParties(client: number) {
		const profile = this.getPartyByClient(client)?.profiles.find(profile => profile.sessionId === client)
		asserts(profile)

		return profile
	}

	static getPartyByClient(client: number) {
		const party = [...this.parties.values()].find(party =>
			party.profiles.some(profile => profile.sessionId === client)
		)
		asserts(party, `Failed to get client<${client}> party`)

		return party
	}

	static async setSize(client: number, size: number): Promise<Party> {
		const profile = await fetchProfile(client)
		asserts(profile, `Failed to get client<${client}> profile`)

		const party = this.getPartyByClient(client)

		asserts(party.profiles.length < size, `client<${client}> tried to set party size into a value less than the current party profiles length`)
		asserts(party.leader === profile.sessionId, `client<${client}> tried to modify party size while he wasn't the leader`)

		party.roomAvailable = size

		return party
	}

	static async new(
		client: number
	): Promise<Party> {
		const profile = await fetchProfile(client)

		this.parties.add({
			profiles: [{ ...profile, ready: true, sessionId: client }],
			leader: profile.sessionId,
			roomAvailable: 1
		})

		const party = this.getPartyByClient(client)

		return party
	}

	static join(profile: Party['profiles'][number], inviterParty: Party) {
		// add and set him unready
		inviterParty.profiles.push({ ...profile, ready: false })

		inviterParty.profiles.forEach(profile => {
			triggerClientCallback('lenix:server:competitive:updateParty', profile.sessionId, inviterParty)
		})
	}

	static remove(client: number, party: Party) {
		const profilesLeft = party.profiles.filter(profile => profile.sessionId !== client)

		if (!profilesLeft.length) {
			this.parties.delete(party)
			return
		}

		if (party.leader === client) {
			// first profile to join the party after the leader ofc
			const newPartyLeader = profilesLeft?.[0]?.sessionId
			asserts(newPartyLeader, `Failed to find new party leader for the leader<${client}>`)

			party.leader = newPartyLeader
		}

		party.profiles = profilesLeft
		profilesLeft.forEach(profile => {
			triggerClientCallback('lenix:server:competitive:updateParty', profile.sessionId, party)
		})
	}

	static async leaveParty(client: number) {
		const party = this.getPartyByClient(client)
		this.remove(client, party)

		return this.new(client)
	}

	static async updateReadiness(client: number, status: 'ready' | 'unready') {
		const profile = await fetchProfile(client)
		const party = this.getPartyByClient(client)

		const partyProfile = party.profiles.find(self => self.profile_id === profile.profile_id)
		asserts(partyProfile, `Failed to get client<${client}> partyProfile`)

		partyProfile.ready = status === 'ready' ? true : false
	}

	static async invite(client: number, invited: number, recursive?: true): Promise<void> {
		try {
			if (!recursive) {
				if (this.playersIgnoringInvites.get(invited)?.has(client)) return
			}

			asserts(client !== invited, `client<${client}> tried to invite himself`)
			const party = this.getPartyByClient(client)

			asserts(
				!party.profiles.some((profile) => profile.sessionId === invited),
				`invited<${invited}> is already in client<${client}>'s party`
			)

			const invites = this.#pendingInvites.get(client)
			if (!invites) {
				const newInvites = new Set<number>()
				this.#pendingInvites.set(client, newInvites.add(invited))
				return this.invite(client, invited, true)
			}

			if (invites.has(invited) && !recursive) return

			const profile = this.getProfileFromParties(client)
			invites.add(invited)

			setTimeout(() => {
				invites.delete(invited)
			}, Config.invitesSpamPeriod * 1000);

			emitNet('lenix:server:competitive:getInvited', invited, profile)
		} catch (e) {
			console.log(palette('red', String(e)))
		}
	}

	static async acceptInvite(client: number, inviter: number): Promise<Party> {
		try {
			const inviterInvites = this.#pendingInvites.get(inviter)
			asserts(inviterInvites?.has(client), 'No pending invite from this player')

			const inviterParty = this.getPartyByClient(inviter)
			asserts(inviterParty.profiles.length < inviterParty.roomAvailable, 'Party is full')

			const party = this.getPartyByClient(client)
			asserts(party !== inviterParty, 'Client is already in this party')

			const profile = this.getProfileFromParties(client)
			this.remove(client, party)
			this.join(profile, inviterParty)

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
}