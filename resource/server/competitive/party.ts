import { asserts } from "@lenix/lenix"
import type { Competitive } from "types/index"
import { fetchProfile } from "./modules"
import { Config } from "common/config/competitive"
import { palette } from "lenix"


type Party = Competitive.Player['Party']


abstract class PartyRegistry {
	private static readonly parties = new Set<{
		profiles: Party['profiles']
		leader: Party['leader']
		roomAvailable: Party['roomAvailable']
		searching: Party['searching']
	}>()
	protected static readonly playersIgnoringInvites = new Map<number, Set<number>>()
	protected static pendingInvites = new Map<number, Set<number>>()

	protected static async getProfileFromParties(client: number) {
		const profile = this.getPartyByClient(client).profiles.find(profile => profile.sessionId === client)
		asserts(profile, `Failed to get client<${client}> profile`)

		return profile
	}

	protected static getPartyByClient(client: number) {
		const party = [...this.parties.values()].find(party =>
			party.profiles.some(profile => profile.sessionId === client)
		)
		asserts(party, `Failed to get client<${client}> party`)

		return party
	}

	protected static async new(
		client: number
	): Promise<Party> {
		const profile = await fetchProfile(client)

		this.parties.add({
			profiles: [{ ...profile, ready: true, sessionId: client }],
			leader: profile.sessionId,
			roomAvailable: 1,
			searching: false
		})

		return this.getPartyByClient(client)
	}

	protected static add(profile: Party['profiles'][number], inviterParty: Party) {
		inviterParty.profiles.push({ ...profile, ready: false })
	}

	protected static remove(client: number) {
		const party = this.getPartyByClient(client)
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
		party.searching = false

		return party
	}

	protected static refreshPartyProfiles(party: Party) {
		party.profiles.forEach(profile => {
			emitNet('lenix:server:competitive:updateParty', profile.sessionId, party)
		})
	}
}

export abstract class Parties extends PartyRegistry {
	static async setSize(client: number, size: number) {
		const profile = await this.getProfileFromParties(client)
		const party = this.getPartyByClient(client)

		asserts(party.profiles.length <= size, `client<${client}> tried to set party size<${size}> into a value less than the current party profiles length`)
		asserts(party.leader === profile.sessionId, `client<${client}> tried to modify party size while he wasn't the leader`)

		party.roomAvailable = size

		this.refreshPartyProfiles(party)
	}

	static async leaveParty(client: number) {
		const partyLeft = this.remove(client)
		const newParty = await this.new(client)

		this.refreshPartyProfiles(newParty)
		if (partyLeft) this.refreshPartyProfiles(partyLeft)
	}

	static async updateReadiness(client: number, status: boolean) {
		const profile = await this.getProfileFromParties(client)
		const party = this.getPartyByClient(client)

		profile.ready = status

		if (!status && party.searching) party.searching = false
		this.refreshPartyProfiles(party)
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

			const inviterParty = this.getPartyByClient(inviter)
			asserts(inviterParty.profiles.length < inviterParty.roomAvailable, `Party is full, player<${client}>`)

			const party = this.getPartyByClient(client)
			asserts(party !== inviterParty, 'Client is already in this party')

			const profile = await this.getProfileFromParties(client)
			const partyLeft = this.remove(client)
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

		const party = this.getPartyByClient(client)
		asserts(party.leader === client, `client<${client}> tried to kick a player while he wasn't the leader`)
		asserts(
			party.profiles.some(profile => profile.sessionId === kicked),
			`client<${client}> tried to kick player<${kicked}> who isn't in his party`
		)

		await this.leaveParty(kicked)
	}

	static updateGameSearch(client: number, status: boolean) {
		const party = this.getPartyByClient(client)
		asserts(client === party.leader, `client<${client}> tried to update game searching status while he wasn't the leader`)

		party.searching = status
		this.refreshPartyProfiles(party)
	}

	static async getParty(client: number) {
		try {
			return this.getPartyByClient(client)
		} catch (e) {
			console.log(palette('red', String(e)))
			return await Parties.new(client)
		}
	}

	static crash(client: number) {
		const partyLeft = this.remove(client)
		if (partyLeft) this.refreshPartyProfiles(partyLeft)
	}
}
