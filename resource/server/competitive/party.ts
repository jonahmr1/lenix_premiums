import { asserts } from "@lenix/lenix"
import type { Competitive } from "types/index"
import { fetchProfile } from "./modules"
import { Config } from "common/config/competitive"
import { palette } from "lenix"


type Party = Competitive.Player['Party']


abstract class Something {
	private static readonly parties = new Set<{
		profiles: Party['profiles']
		leader: Party['leader']
		roomAvailable: Party['roomAvailable']
	}>()
	protected static readonly playersIgnoringInvites = new Map<number, Set<number>>()
	protected static pendingInvites = new Map<number, Set<number>>()

	static async getProfileFromParties(client: number) {
		const profile = (await this.getPartyByClient(client)).profiles.find(profile => profile.sessionId === client)
		asserts(profile, `Failed to get client<${client}> profile`)

		return profile
	}

	static async getPartyByClient(client: number, fallToCreate?: boolean /* create new party if not found */) {
		let party = [...this.parties.values()].find(party =>
			party.profiles.some(profile => profile.sessionId === client)
		)
		if (fallToCreate && !party) {
			party = await Parties.new(client)
		}
		asserts(party, `Failed to get client<${client}> party`)

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

		return this.getPartyByClient(client)
	}

	static add(profile: Party['profiles'][number], inviterParty: Party) {
		// add and set him unready
		inviterParty.profiles.push({ ...profile, ready: false })
	}

	static remove(client: number, party: Party) {
		const profilesLeft = party.profiles.filter(profile => profile.sessionId !== client)

		if (!profilesLeft.length) {
			this.parties.delete(party)
			return null
		}

		if (party.leader === client) {
			// first profile to join the party after the leader ofc
			const newPartyLeader = profilesLeft?.[0]?.sessionId
			asserts(newPartyLeader, `Failed to find new party leader for the leader<${client}>`)

			party.leader = newPartyLeader
		}

		party.profiles = profilesLeft
		return party
	}

	static refreshPartyProfiles(party: Party) {
		party.profiles.forEach(profile => {
			emitNet('lenix:server:competitive:updateParty', profile.sessionId, party)
		})
	}
}

export abstract class Parties extends Something {
	static async setSize(client: number, size: number) {
		const profile = await this.getProfileFromParties(client)
		const party = await this.getPartyByClient(client)

		asserts(party.profiles.length <= size, `client<${client}> tried to set party size<${size}> into a value less than the current party profiles length`)
		asserts(party.leader === profile.sessionId, `client<${client}> tried to modify party size while he wasn't the leader`)

		party.roomAvailable = size

		this.refreshPartyProfiles(party)
	}

	static async leaveParty(client: number) {
		const party = await this.getPartyByClient(client)
		const partyLeft = this.remove(client, party)
		const newParty = await this.new(client)

		this.refreshPartyProfiles(newParty)
		if (partyLeft) this.refreshPartyProfiles(partyLeft)
	}

	static async updateReadiness(client: number, status: 'ready' | 'unready') {
		const profile = await this.getProfileFromParties(client)
		const party = await this.getPartyByClient(client)

		const partyProfile = party.profiles.find(self => self.profile_id === profile.profile_id)
		asserts(partyProfile, `Failed to get client<${client}> partyProfile`)

		partyProfile.ready = status === 'ready' ? true : false

		this.refreshPartyProfiles(party)
	}

	static async invite(client: number, invited: number, recursive?: true): Promise<void> { try { if (!recursive) {
				if (this.playersIgnoringInvites.get(invited)?.has(client)) return
			}

			asserts(client !== invited, `client<${client}> tried to invite himself`)
			const party = await this.getPartyByClient(client)

			asserts(
				!party.profiles.some((profile) => profile.sessionId === invited),
				`invited<${invited}> is already in client<${client}>'s party`
			)

			const invites = this.pendingInvites.get(client)
			if (!invites) {
				const newInvites = new Set<number>()
				this.pendingInvites.set(client, newInvites)
				return this.invite(client, invited, true)
			}

			if (invites.has(invited) && !recursive) return

			const profile = await this.getProfileFromParties(client)
			invites.add(invited)

			setTimeout(() => {
				invites.delete(invited)
			}, Config.invitesSpamPeriod * 1000);

			emitNet('lenix:server:competitive:getInvited', invited, profile)
		} catch (e) {
			console.log(palette('red', String(e)))
		}
	}

	static async acceptInvite(client: number, inviter: number) {
		try {
			const inviterInvites = this.pendingInvites.get(inviter)
			asserts(inviterInvites?.has(client), `No pending invite from this player<${inviter}>`)

			const inviterParty = await this.getPartyByClient(inviter)
			asserts(inviterParty.profiles.length < inviterParty.roomAvailable, `Party is full, player<${client}>`)

			const party = await this.getPartyByClient(client)
			asserts(party !== inviterParty, 'Client is already in this party')

			const profile = await this.getProfileFromParties(client)
			const partyLeft = this.remove(client, party)
			this.add(profile, inviterParty)

			inviterInvites?.delete(client)
			
			this.refreshPartyProfiles(inviterParty)
			if (partyLeft) this.refreshPartyProfiles(partyLeft)
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

	static async kick(client: number, kicked: number) {
		asserts(client !== kicked, `client<${client}> tried to kick himself`)

		const party = await this.getPartyByClient(client)
		asserts(party.leader === client, `client<${client}> tried to kick a player while he wasn't the leader`)
		asserts(
			party.profiles.some(profile => profile.sessionId === kicked),
			`client<${client}> tried to kick player<${kicked}> who isn't in his party`
		)

		await this.leaveParty(kicked)
	}
}
