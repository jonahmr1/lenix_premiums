import type { Event, Request } from 'lenix'
import type { Public } from './public'

export namespace Competitive {
	export interface Events {
		open: Event<'competitive:open', []>
		playerInvited: Event<'competitive:playerInvited', [Player['GamerProfile']]>
		updateParty: Event<'competitive:updateParty', [Player['Party']]>
		updateStage: Event<'competitive:updateStage', [Stage]>
		newRound: Event<'competitive:newRound', [Player['Party']['gameMode'], RoundTeams]>
		updateRound: Event<'competitive:updateRound', [RoundTeams]>
	}

	export interface Requests {
		getProfile: Request<Player['Profile'], 'competitive:getProfile'>
		getGamerProfile: Request<Player['GamerProfile'], 'competitive:getGamerProfile'>
		getLeaderboard: Request<Leaderboard, 'competitive:getLeaderboard'>
		getParty: Request<Player['Party'], 'competitive:getParty'>
		setPartySize: Request<null, 'competitive:setPartySize', { size: number }>
		party: {
			getStats: Request<Record<string, Player['Stats']>, 'competitive:party:getStats', { profiles: string[] }>
		}
		getMatches: Request<Player['Match'][], 'competitive:getMatches'>
		getStats: Request<Player['Stats'], 'competitive:getStats'>
		getFriends: Request<Player['Profile'][], 'competitive:getFriends'>
		setStatus: Request<true, 'competitive:setStatus', { status: Player['GamerProfile']['status'] }>
		getProfiles: Request<Player['Profile'][], 'competitive:getProfiles'>
		invitePlayer: Request<null, 'competitive:invitePlayer', { invited: number }>
		acceptInvite: Request<null, 'competitive:acceptInvite', { inviter: number }>
		ignoreInvites: Request<null, 'competitive:ignoreInvites', { inviter: number }>
		updateReadiness: Request<null, 'competitive:updateReadiness', { status: boolean }>
		leaveParty: Request<null, 'competitive:leaveParty'>
		kickProfile: Request<null, 'competitive:kickProfile', { profile: number }>
		updateGameSearch: Request<null, 'competitive:updateGameSearch', { status: Player['Party']['status'] }>
		transferLeadership: Request<null, 'competitive:transferPartyLeadership', { leader: number }>
		updatePartyGameMode: Request<null, 'competitive:updatePartyGameMode', { mode: Player['Party']['gameMode'] }>
	}

	export interface APIs {
		getStats: (Pick<Competitive.Player['Stats'], 'kills' | 'assists' | 'deaths'> & { result: 'win' | 'loss' })[]
		getProfilesStats: Record<string, APIs['getStats'][number]>
		prepareForMatch: boolean
	}

	export interface Player {
		Profile: {
			profile_id: string
			name: string
			avatar: string | null
			status: 'online' | 'offline' | 'dnd'
		}
		GamerProfile: Omit<Player['Profile'], 'status'> & {
			ready: boolean
			sessionId: number
			status: Player['Profile']['status'] | 'in_game'
		}
		Friend: Player['GamerProfile']['profile_id']
		Stats: {
			kills: number
			deaths: number
			assists: number
			wins: number
			losses: number
			winRate: number
			killsDeathsRatio: number
			matches: number
		}
		Match: {
			result: Player['Performance']['result']
			delta: number
			stats: {
				kills: Player['Stats']['kills']
				deaths: Player['Stats']['deaths']
				assits: Player['Stats']['assists']
			}
		} & Match
		Notification: {
			id: string
			type: 'party_invite'
			title: string
			description: string
			createdAt: number
			author: {
				avatar: Player['GamerProfile']['avatar']
			}
		}
		Performance: {
			match_id: number
			profile_id: string
			result: 'win' | 'loss'
			kills: number
			deaths: number
			assists: number
		}
		Party: {
			profiles: Competitive.Player['GamerProfile'][]
			leader: Competitive.Player['GamerProfile']['sessionId']
			roomAvailable: number
			status: 'searching' | 'idle' | 'found'
			gameMode: keyof GameModes
		}
	}

	export type Match = {
		match_id: number
		map: string
		played_at: number
	}

	export type Leaderboard = {
		place: number
		score: number
		profile_id: Player['GamerProfile']['profile_id']
		name: Player['GamerProfile']['name']
		avatar: Player['GamerProfile']['avatar']
	}[]

	export type GameModes = Public['public/config.competitive.json']['game_modes']

	export type Stage = 'lobby' | 'loading' | 'in-game'

	export type RoundTeams = Record<'own' | 'opponent', {
		roundsWon: number
		players: {
			isDead: boolean,
			avatar: Player['Profile']['avatar']
		}[]
	}>
}
