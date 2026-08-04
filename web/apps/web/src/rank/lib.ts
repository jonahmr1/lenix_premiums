import { rankTiers, weights } from "config";
import type { Rank } from "types";

export const calculatePlayerScore = (stats: Rank.Player['Stats']) => {

	return Math.max(0,
		(stats.wins * weights.win) +
		(stats.losses * weights.loss) +
		(stats.kills * weights.kill) +
		(stats.assits * weights.assist) +
		(stats.deaths * weights.death)
	);
};

export const getRankTier = (score: number) => rankTiers.find(rank => score >= rank.minScore) ?? rankTiers[rankTiers.length - 1]
