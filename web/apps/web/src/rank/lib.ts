import type { Competitive } from 'types'
import rankConfig, { rank } from 'config' with { type: 'json' }
import { entries } from '@lenix/lenix'

const { score_weights, rank_tiers } = rank

export const calculatePlayerScore = (stats: Competitive.Stats) => {
	return Math.max(
		0,
		stats.wins * score_weights.win +
		stats.losses * score_weights.loss +
		stats.kills * score_weights.kill +
		stats.assists * score_weights.assist +
		stats.deaths * score_weights.death,
	)
}

export const getRankTier = (score: number) =>
	rank_tiers.find(rank => score >= rank.min_score) ?? rank_tiers[rank_tiers.length - 1]

export const getMaxPvp = () => entries(rank.game_modes).reduce((maxFound, [, currentMode]) =>
	Math.max(maxFound, currentMode.min_players_per_team), 1
)

export const showTimer = (timer: number) => `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`
