import { asserts } from "@lenix/lenix"
import type { Competitive } from "types/index"
import { fetchProfile } from "./modules"
import { Config } from "common/config/competitive"
import { palette } from "lenix"
import { Matches } from "./match"


type Party = Competitive.Player['Party']


abstract class PartyRegistry {
	private static readonly parties = new Set<Party>()
	protected static readonly playersIgnoringInvites = new Map<number, Set<number>>()
	protected static readonly pendingInvites = new Map<number, Set<number>>()

	static getProfileFromParties(client: number, from?: Party) {
		const party = from ?? this.getPartyByClient(client)
		const profile = party.profiles.find(profile => profile.sessionId === client)
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
			leader: client,
			roomAvailable: 1,
			status: 'idle',
			gameMode: 'back_to_back'
		})

		return this.getPartyByClient(client)
	}

	protected static add(profile: Party['profiles'][number], inviterParty: Party) {
		inviterParty.profiles.push({ ...profile, ready: false })
	}

	protected static remove(client: number, from?: Party) {
		const party = from ?? this.getPartyByClient(client)
		const profilesLeft = party.profiles.filter(profile => profile.sessionId !== client)

		if (!profilesLeft.length) {
			this.parties.delete(party)
			return null
		}

		if (party.leader === client) {
			const newPartyLeader = profilesLeft?.[0]?.sessionId
			asserts(newPartyLeader, `Failed to find new party leader for the leader<${client}>`)

			party.leader = newPartyLeader
		}

		party.profiles = profilesLeft
		party.status = 'idle'

		return party
	}

	protected static refreshPartyProfiles(party: Party) {
		party.profiles.forEach(profile => {
			emitNet('lenix:server:competitive:updateParty', profile.sessionId, party)
		})
	}
}

export abstract class Parties extends PartyRegistry {
	private static searchingParty: Party | null = null

	static invite(client: number, invited: number, recursive?: true): void {
		try {
			if (!recursive) {
				if (this.playersIgnoringInvites.get(invited)?.has(client)) return
			}

			const party = this.getPartyByClient(client)
			asserts(party.status === 'idle', `client<${client}> tried to invite client<${invited}> while not in idle mode`)
			asserts(client !== invited, `client<${client}> tried to invite himself`)

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

			const profile = this.getProfileFromParties(client, party)
			invites.add(invited)

			setTimeout(() => {
				invites.delete(invited)
			}, Config.invites_spam_period * 1000);

			emitNet('lenix:server:competitive:getInvited', invited, profile satisfies Competitive.Player['GamerProfile'])
		} catch (e) {
			console.log(palette('red', String(e)))
		}
	}

	static acceptInvite(client: number, inviter: number) {
		try {
			const inviterInvites = this.pendingInvites.get(inviter)
			asserts(inviterInvites?.has(client), `No pending invite from this player<${inviter}>`)

			const inviterParty = this.getPartyByClient(inviter)
			asserts(inviterParty.profiles.length < inviterParty.roomAvailable, `Party is full, player<${client}>`)
			asserts(inviterParty.status === 'idle', `client<${client}> accepted client<${inviter}>'s invite while client<${inviter}>'s party not in idle mode`)

			const party = this.getPartyByClient(client)
			asserts(party.status === 'idle', `client<${client}> accepted client<${inviter}>'s invite while his party not in idle mode`)
			asserts(party !== inviterParty, 'Client is already in this party')

			const profile = this.getProfileFromParties(client, party)
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
		}, Config.ignore_invites_period * 60_000)
	}

	static setSize(client: number, size: number) {
		const party = this.getPartyByClient(client)
		asserts(party.status === 'idle', `client<${client}> tried to set party size while not in idle mode`)

		const profile = this.getProfileFromParties(client, party)

		asserts(party.profiles.length <= size, `client<${client}> tried to set party size<${size}> into a value less than the current party profiles length`)
		asserts(party.leader === profile.sessionId, `client<${client}> tried to modify party size while he wasn't the leader`)

		party.roomAvailable = size

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

	static async leaveParty(client: number) {
		const party = this.getPartyByClient(client)
		asserts(party.status === 'idle', `client<${client}> tried to leave a party while not in idle mode`)

		const partyLeft = this.remove(client)
		const newParty = await this.new(client)

		this.refreshPartyProfiles(newParty)
		if (partyLeft) this.refreshPartyProfiles(partyLeft)
	}

	static async updateReadiness(client: number, status: boolean) {
		const party = this.getPartyByClient(client)
		asserts(party.status !== 'found', `client<${client}> tried to update readiness while a match was found`)
		const profile = this.getProfileFromParties(client)

		if (!status) this.updateGameSearch(party.leader, 'idle')

		profile.ready = status
	}

	static async kick(client: number, kicked: number) {
		asserts(client !== kicked, `client<${client}> tried to kick himself`)

		const party = this.getPartyByClient(client)
		asserts(party.status === 'idle', `client<${client}> tried to kick client<${kicked}> while not in idle mode`)

		asserts(party.leader === client, `client<${client}> tried to kick a player while he wasn't the leader`)
		asserts(
			party.profiles.some(profile => profile.sessionId === kicked),
			`client<${client}> tried to kick player<${kicked}> who isn't in his party`
		)

		await this.leaveParty(kicked)
	}


	static updateGameSearch(client: number, status: Party['status']) {
		asserts(status !== 'found')

		const party = this.getPartyByClient(client)
		asserts(client === party.leader, `client<${client}> tried to update game searching status while he wasn't the leader`)
		asserts(party.status !== 'found', `client<${client}> tried to update game searching status while the party already found a match`)

		party.profiles.forEach(profile => asserts(profile.ready, `client<${profile.sessionId}> wasn't ready to search a match`))
		party.status = status
		this.refreshPartyProfiles(party)

		if (status === 'idle' && this.searchingParty === party) this.searchingParty = null
		if (status !== 'searching') return


		const partyInQueue = this.searchingParty
		if (!partyInQueue) {
			this.searchingParty = party
			return
		}
		asserts(partyInQueue !== party, `Duplicated party in queue with client<${client}> entries tried to self-find a match`)

		this.searchingParty = null

		partyInQueue.status = 'found'
		party.status = 'found'

		partyInQueue.profiles.forEach(profile => profile.status = 'in_game')
		party.profiles.forEach(profile => profile.status = 'in_game')

		this.refreshPartyProfiles(partyInQueue)
		this.refreshPartyProfiles(party)

		Matches.start([partyInQueue, party])
	}

	static async transferLeadership(client: number, leader: number) {
		const party = this.getPartyByClient(client)
		asserts(party.status === 'idle', `client<${client}> tried to transfer leadership while not in idle mode`)

		const profile = this.getProfileFromParties(client, party)
		asserts(party.leader === profile.sessionId, `client<${client}> to transfer leadership while he wasn't the leader`)
		asserts(client !== leader, `client<${client}> tried to give himself leadership while he already was`)
		asserts(this.getProfileFromParties(leader, party), `client<${client}> tried to give leadership to client<${leader}> that wasn't in the same party`)

		party.leader = leader
		this.refreshPartyProfiles(party)
	}

	static updateGameMode(client: number, mode: Party['gameMode']) {
		const party = this.getPartyByClient(client)
		asserts(party.leader === client, `client<${client}> tried to update party game mode while he wasn't the leader`)
		asserts(party.status === 'idle', `client<${client}> tried to update party game mode while search for a match`)
		asserts(party.gameMode !== mode, `client<${client}> tried to update party game mode to the same current game mode`)
		asserts(
			Config.game_modes[mode].min_players_per_team <= party.roomAvailable,
			`client<${client}> tried to update party game mode while the mode allow >= than the currect room available`
		)

		party.gameMode = mode
		this.refreshPartyProfiles(party)
	}

	static crash(client: number) {
		const party = this.getPartyByClient(client)
		const partyLeft = this.remove(client, party)
		if (partyLeft) {
			this.updateGameSearch(partyLeft.leader, 'idle')
			this.refreshPartyProfiles(partyLeft)
		} else if (this.searchingParty === party) this.searchingParty = null
	}
}
