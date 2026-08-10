import type { Event, Request } from 'lenix'

export namespace Competitive {
	export interface Events {
		open: Event<'competitive:open', []>
		playerInvited: Event<'competitive:playerInvited', [string]>
	}

	export interface Requests {
		getProfile: Request<Player['Profile'], 'competitive:getProfile'>
		getLeaderboard: Request<Leaderboard, 'competitive:getLeaderboard'>
		party: {
			get: Request<Player['Party'], 'competitive:party:create'>
			setSize: Request<Player['Party'] | null, 'competitive:party:setSize', { size: number }>
		}
		getMatches: Request<Player['Match'][], 'competitive:getMatches'>
		getStats: Request<Player['Stats'], 'competitive:getStats'>
		getFriends: Request<Player['Profile'][], 'competitive:getFriends'>
		setStatus: Request<Player['Profile']['status'] | null, 'competitive:setStatus', { status: Player['Profile']['status'] }>
		getProfiles: Request<Player['Profile'][], 'competitive:getProfiles'>
		invitePlayer: Request<void, 'competitive:invitePlayer', { id: number }>
	}

	export interface APIs {
		getStats: (Pick<Competitive.Player['Stats'], 'kills' | 'assists' | 'deaths'> & { result: 'win' | 'loss' })[]
	}

	export interface Player {
		Profile: {
			profile_id: string
			name: string
			avatar: string | null
			status: 'online' | 'offline' | 'dnd'
		}
		Friend: Player['Profile']['profile_id']
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
			match_id: number
			map: string
			played_at: number
			result: Player['Performance']['result']
			delta: number
			stats: {
				kills: Player['Stats']['kills']
				deaths: Player['Stats']['deaths']
				assits: Player['Stats']['assists']
			}
		},
		Notification: {
			id: string
			type: 'party_invite'
			title: string
			description: string
			createdAt: number
			author: {
				avatar: Player['Profile']['avatar']
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
			profiles: (Competitive.Player['Profile'] & { ready: boolean })[]
			size: number
			leader: Competitive.Player['Profile']['profile_id']
		}
	}

	export type Leaderboard = {
		place: number
		score: number
		profile_id: Player['Profile']['profile_id']
		name: Player['Profile']['name']
		avatar: Player['Profile']['avatar']
	}[]
}
