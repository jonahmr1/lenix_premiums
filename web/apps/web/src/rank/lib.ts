import { setStorage } from '@lenix/lenix'
import type { Storage } from 'types'
import { asserts } from 'lenix'
import { rankTiers, weights } from "./constants";
import type { PlayerStats } from "./types";

export const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light'

export const toggleTheme = (theme: Storage['theme'] = getTheme() === 'dark' ? 'light' : 'dark') => {
	asserts(theme, `Expected theme to be 'dark' | 'light', got ${theme}`)
	const html = document.documentElement

	if (theme === 'dark') html.classList.add(theme)
	else html.classList.remove('dark');

	setStorage<Storage>('theme', theme)
}

export const calculatePlayerScore = (stats: PlayerStats) => {

	return Math.max(0,
		(stats.wins * weights.win) +
		(stats.losses * weights.loss) +
		(stats.kills * weights.kill) +
		(stats.assits * weights.assist) +
		(stats.deaths * weights.death)
	);
};

export const getRankTier = (score: number) => rankTiers.find(rank => score >= rank.minScore) ?? rankTiers[rankTiers.length - 1]
