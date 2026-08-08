import type { Competitive } from 'types'
import rankConfig, { weights, rankTiers } from 'config' with { type: 'json' }

export const calculatePlayerScore = (stats: Competitive.Player['Stats']) => {
	return Math.max(
		0,
		stats.wins * weights.win +
			stats.losses * weights.loss +
			stats.kills * weights.kill +
			stats.assists * weights.assist +
			stats.deaths * weights.death,
	)
}

export const getRankTier = (score: number) =>
	rankTiers.find(rank => score >= rank.minScore) ?? rankTiers[rankTiers.length - 1]

export const config = rankConfig
