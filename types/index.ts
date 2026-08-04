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
			get: Request<Party, 'rank:party:get'>
			setSize: Request<Party, 'rank:party:setSize', { size: number }>
		}
		getMatches: Request<Player['Match'][], 'rank:getMatches'>
		getStats: Request<Player['Stats'], 'rank:getStats'>
	}

	export interface Player {
		Profile: {
			profile_id: number
			name: string
			avatar: string
			status: keyof typeof playerStatuses
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
			id: `match-${number}`
			mode: `${number}v${number}`
			map: Match['Map']
			playedAt: number
			result: Match['Result']
			duration: number
			scoreChange: number
			stats: {
				kills: number
				deaths: number
				assits: number
			}
		},
		Notification: {
			id: string
			type: 'party_invite'
			title: string
			description: string
			createdAt: number
			author: {
				avatar: string
			}
		}
	}

	export interface Match {
		Map: 'Downtown'
		Result: 'win'
	}

	export interface Party {
		profiles: Player['Profile'][]
	}

	export type Leaderboard = {
		place: number
		userId: number
		name: string
		avatar: string
		score: number
	}[]
}
