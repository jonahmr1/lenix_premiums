import type { Event, Request } from 'lenix'
import type { playerStatuses } from '../resource/common/config'

export interface Storage {
	theme: 'dark' | 'light'
}

export namespace Rank {
	export interface Events {
		open: Event<'rank:open', []>
	}

	export interface Requests {
		getProfile: Request<Player['Profile'], 'rank:getProfile'>
		getLeaderboard: Request<Leaderboard, 'rank:getLeaderboard'>
		party: {
			get: Request<Player['Party'], 'rank:party:create'>
			setSize: Request<Player['Party'], 'rank:party:setSize', { size: number }>
		}
		getMatches: Request<Player['Match'][], 'rank:getMatches'>
		getStats: Request<Player['Stats'], 'rank:getStats'>
	}

	export interface APIs {
		getStats: (Pick<Rank.Player['Stats'], 'kills' | 'assists' | 'deaths'> & { result: 'win' | 'loss' })[]
	}

	export interface Player {
		Profile: {
			profile_id: string
			name: string
			avatar: string | null
			status: keyof Omit<(typeof playerStatuses), 'in_game'>
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
			profiles: Rank.Player['Profile'][]
			size: number
			leader: Rank.Player['Profile']['profile_id']
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
