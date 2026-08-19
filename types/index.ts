import type { Event, Request } from 'lenix'
import type { Public } from './public'

export namespace Competitive {
	export interface Events {
		open: Event<'competitive:open', []>
		playerInvited: Event<'competitive:playerInvited', [GamerProfile]>
		updateParty: Event<'competitive:updateParty', [Party]>
		updateStage: Event<'competitive:updateStage', [Stage]>
		newRound: Event<'competitive:newRound', [Party['gameMode'], CasualMatch]>
		updateRound: Event<'competitive:updateRound', [CasualMatch]>
	}

	export interface Requests {
		getProfile: Request<Profile, 'competitive:getProfile'>
		getGamerProfile: Request<GamerProfile, 'competitive:getGamerProfile'>
		getLeaderboard: Request<Leaderboard, 'competitive:getLeaderboard'>
		getParty: Request<Party, 'competitive:getParty'>
		setPartySize: Request<null, 'competitive:setPartySize', { size: number }>
		party: {
			getStats: Request<Record<string, Stats>, 'competitive:party:getStats', { profiles: string[] }>
		}
		getMatches: Request<Player['Match'][], 'competitive:getMatches'>
		getStats: Request<Stats, 'competitive:getStats'>
		getFriends: Request<Profile[], 'competitive:getFriends'>
		setStatus: Request<true, 'competitive:setStatus', { status: GamerProfile['status'] }>
		getProfiles: Request<Profile[], 'competitive:getProfiles'>
		invitePlayer: Request<null, 'competitive:invitePlayer', { invited: number }>
		acceptInvite: Request<null, 'competitive:acceptInvite', { inviter: number }>
		ignoreInvites: Request<null, 'competitive:ignoreInvites', { inviter: number }>
		updateReadiness: Request<null, 'competitive:updateReadiness', { status: boolean }>
		leaveParty: Request<null, 'competitive:leaveParty'>
		kickProfile: Request<null, 'competitive:kickProfile', { profile: number }>
		updateMatchmaking: Request<null, 'competitive:updateMatchmaking', { status: Party['status'] }>
		transferLeadership: Request<null, 'competitive:transferPartyLeadership', { leader: number }>
		updatePartyGameMode: Request<null, 'competitive:updatePartyGameMode', { mode: Party['gameMode'] }>
	}

	export interface APIs {
		getStats: (Pick<Stats, 'kills' | 'assists' | 'deaths'> & { result: 'win' | 'loss' })[]
		getProfilesStats: Record<string, APIs['getStats'][number]>
		prepareForMatch: boolean
	}

	export interface Player {
		Friend: GamerProfile['profile_id']
		Match: {
			result: Performance['result']
			delta: number
			stats: {
				kills: Stats['kills']
				deaths: Stats['deaths']
				assits: Stats['assists']
			}
		} & Match
	}

	export type Stats = {
		kills: number
		deaths: number
		assists: number
		wins: number
		losses: number
		winRate: number
		killsDeathsRatio: number
		matches: number
	}

	export interface Notification {
		id: string
		type: 'party_invite'
		title: string
		description: string
		createdAt: number
		author: {
			avatar: GamerProfile['avatar']
		}
	}
	export interface Performance {
		match_id: number
		profile_id: string
		result: 'win' | 'loss'
		kills: number
		deaths: number
		assists: number
	}

	export type GamerProfile = Omit<Profile, 'status'> & {
		ready: boolean
		sessionId: number
		status: Profile['status'] | 'in_game'
	}

	export type Profile = {
		profile_id: string
		name: string
		avatar: string | null
		status: 'online' | 'offline' | 'dnd'
	}

	export type Party = {
		profiles: GamerProfile[]
		leader: GamerProfile['sessionId']
		roomAvailable: number
		status: 'searching' | 'idle' | 'found'
		gameMode: Match['mode']
	}

	export type Match = {
		bucket: number
		mode: GameMode
		map: GameMap
		playedAt: number
		currentRound: number
		teams: {
			roundsWon: number
			players: {
				isDead: boolean
				avatar: string | null
				sessionId: number
			}[]
		}[]
		parties: {
			party: Party
			lastStatus: Record<string,GamerProfile['status'] >
		}[]
	}

	export type Leaderboard = {
		place: number
		score: number
		profile_id: GamerProfile['profile_id']
		name: GamerProfile['name']
		avatar: GamerProfile['avatar']
	}[]

	export type GameModes = Public['public/config.competitive.json']['game_modes']
	export type GameMaps = Public['public/config.competitive.json']['game_maps']
	export type GameMode = keyof GameModes
	export type GameMap = keyof GameMaps

	export type Stage = 'lobby' | 'loading' | 'in-game'

	export type CasualMatch = Record<'own' | 'opponent', {
		players: {
			isDead: boolean,
			avatar: Profile['avatar']
		}[]
	}>
}
