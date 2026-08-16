import type { Competitive } from 'types'
import rankConfig, { score_weights, rankTiers } from 'config' with { type: 'json' }
import { entries } from '@lenix/lenix'

export const calculatePlayerScore = (stats: Competitive.Player['Stats']) => {
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
	rankTiers.find(rank => score >= rank.minScore) ?? rankTiers[rankTiers.length - 1]

export const getMaxPvp = () => entries(config.game_modes).reduce((maxFound, [, currentMode]) =>
	Math.max(maxFound, currentMode.minPlayersPerTeam), 1
)

export const config = rankConfig
