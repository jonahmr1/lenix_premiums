import { Badge } from "@workspace/elite/components/badge"
import { calculatePlayerScore, getRankTier } from "../lib"
import { common, user } from "../data"
import type { PlayerStats } from "../types"
import { entries } from "@lenix/lenix"
import { Crown, Shield, Skull, Target, Trophy, Users } from "lucide-react"

const getWinRate = (stats: PlayerStats) => {
	const matches = stats.wins + stats.losses
	return matches ? `${((stats.wins / matches) * 100).toFixed(1)}%` : "0%"
}

const getKdRatio = (stats: PlayerStats) => stats.deaths ? (stats.kills / stats.deaths).toFixed(2) : stats.kills.toFixed(2)

export const Leaderboard = () => {
	const leaderboard = entries(common.users)
		.map(([userId, player]) => {
			const score = calculatePlayerScore(player.stats)
			const rank = getRankTier(score)

			return {
				userId,
				...player,
				score,
				rank,
				matches: player.stats.wins + player.stats.losses,
				winRate: getWinRate(player.stats),
				kdRatio: getKdRatio(player.stats),
			}
		})
		.sort((firstPlayer, secondPlayer) => secondPlayer.score - firstPlayer.score)
		.map((player, index) => ({
			...player,
			place: index + 1,
		}))

	const topPlayers = leaderboard.slice(0, 3)
	const currentPlayer = leaderboard.find(player => player.userId === user.id)
	const getAvatarStyle = (avatar: string) => ({ backgroundImage: `url(${avatar})` })

	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-[clamp(0.75rem,1.2vw,1.25rem)] overflow-hidden px-[clamp(0.5rem,0.9vw,1rem)] py-[clamp(0.6rem,0.9vw,1rem)] text-foreground">
			<section className="rounded-xl border border-foreground/10 bg-background/35 p-[clamp(0.8rem,1.25vw,1.25rem)]">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-3 text-primary">
						<Trophy className="size-[clamp(1.4rem,2vw,1.9rem)] fill-primary/20" />
						<div>
							<h1 className="text-[clamp(1.05rem,1.5vw,1.45rem)] font-extrabold uppercase tracking-widest">Leaderboard</h1>
							<p className="text-[clamp(0.65rem,0.8vw,0.8rem)] font-semibold text-muted-foreground">Global ranked player standings</p>
						</div>
					</div>
					{currentPlayer && (
						<Badge variant="outline" className="gap-2 border-primary/30 bg-primary/10 px-3 py-2 text-primary">
							<Crown className="size-4" />
							Your Place #{currentPlayer.place}
						</Badge>
					)}
				</div>
			</section>

			<section className="grid grid-cols-3 gap-[clamp(0.75rem,1.2vw,1.25rem)]">
				{topPlayers.map(player => (
					<div key={player.userId} className="min-w-0 rounded-xl border border-foreground/10 bg-background/35 p-[clamp(0.7rem,1vw,1rem)]">
						<div className="flex items-center justify-between gap-3">
							<div className="flex min-w-0 items-center gap-3">
								<span className="block size-[clamp(2rem,2.8vw,2.75rem)] shrink-0 rounded-full bg-background bg-cover bg-center" style={getAvatarStyle(player.avatar)} />
								<div className="min-w-0">
									<div className="truncate text-[clamp(0.8rem,1vw,1rem)] font-bold text-foreground">{player.name}</div>
									<div className={`text-[clamp(0.65rem,0.8vw,0.8rem)] font-bold uppercase ${player.rank.className}`}>{player.rank.label}</div>
								</div>
							</div>
							<div className="shrink-0 text-right">
								<div className="text-[clamp(1rem,1.4vw,1.35rem)] font-extrabold text-primary">#{player.place}</div>
								<div className="text-[clamp(0.65rem,0.8vw,0.8rem)] font-semibold text-muted-foreground">{player.score.toLocaleString()}</div>
							</div>
						</div>
					</div>
				))}
			</section>

			<section className="flex min-h-0 flex-1 flex-col rounded-xl border border-foreground/10 bg-background/35 p-[clamp(0.75rem,1vw,1rem)]">
				<div className="overflow-x-auto">
					<div className="min-w-[46rem]">
						<div className="grid grid-cols-[3rem_minmax(10rem,1fr)_8rem_7rem_6rem_6rem_5rem] gap-3 px-[clamp(0.5rem,0.8vw,0.75rem)] pb-2 text-[clamp(0.6rem,0.72vw,0.75rem)] font-bold uppercase tracking-widest text-muted-foreground">
							<span>#</span>
							<span>Player</span>
							<span>Rank</span>
							<span className="text-right">Score</span>
							<span className="text-right">Wins</span>
							<span className="text-right">Win Rate</span>
							<span className="text-right">K/D</span>
						</div>
						<div className="max-h-[min(48vh,28rem)] space-y-[clamp(0.25rem,0.45vw,0.45rem)] overflow-y-auto pr-1">
							{leaderboard.map(player => {
								const isCurrentPlayer = player.userId === user.id

								return (
									<div
										key={player.userId}
										className={`grid grid-cols-[3rem_minmax(10rem,1fr)_8rem_7rem_6rem_6rem_5rem] items-center gap-3 rounded-lg px-[clamp(0.5rem,0.8vw,0.75rem)] py-[clamp(0.45rem,0.7vw,0.65rem)] text-[clamp(0.68rem,0.78vw,0.82rem)] hover:bg-foreground/[0.04] ${isCurrentPlayer ? "border border-primary/30 bg-primary/15 text-primary" : ""}`}
									>
										<span className={`font-bold ${isCurrentPlayer ? "text-primary" : "text-muted-foreground"}`}>{player.place}</span>
										<span className="flex min-w-0 items-center gap-3">
											<span className="block size-[clamp(1.6rem,2.2vw,2rem)] shrink-0 rounded-full bg-background bg-cover bg-center" style={getAvatarStyle(player.avatar)} />
											<span className="min-w-0">
												<span className={`block truncate font-bold ${isCurrentPlayer ? "text-primary" : "text-foreground"}`}>{player.name}</span>
												<span className="flex items-center gap-2 text-[0.65rem] font-semibold text-muted-foreground">
													<Users className="size-3" />
													{player.matches.toLocaleString()} matches
												</span>
											</span>
										</span>
										<span className={`font-bold uppercase ${player.rank.className}`}>{player.rank.label}</span>
										<span className="text-right font-bold">{player.score.toLocaleString()}</span>
										<span className="text-right font-semibold">{player.stats.wins.toLocaleString()}</span>
										<span className="text-right font-semibold">{player.winRate}</span>
										<span className="text-right font-semibold">{player.kdRatio}</span>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-3 gap-[clamp(0.75rem,1.2vw,1.25rem)]">
				<div className="rounded-xl border border-foreground/10 bg-background/35 p-[clamp(0.75rem,1vw,1rem)]">
					<div className="flex items-center gap-2 text-primary">
						<Shield className="size-4" />
						<span className="text-xs font-bold uppercase tracking-widest">Players</span>
					</div>
					<div className="mt-2 text-xl font-extrabold">{leaderboard.length}</div>
				</div>
				<div className="rounded-xl border border-foreground/10 bg-background/35 p-[clamp(0.75rem,1vw,1rem)]">
					<div className="flex items-center gap-2 text-primary">
						<Target className="size-4" />
						<span className="text-xs font-bold uppercase tracking-widest">Best Score</span>
					</div>
					<div className="mt-2 text-xl font-extrabold">{leaderboard[0]?.score.toLocaleString() ?? 0}</div>
				</div>
				<div className="rounded-xl border border-foreground/10 bg-background/35 p-[clamp(0.75rem,1vw,1rem)]">
					<div className="flex items-center gap-2 text-primary">
						<Skull className="size-4" />
						<span className="text-xs font-bold uppercase tracking-widest">Top K/D</span>
					</div>
					<div className="mt-2 text-xl font-extrabold">
						{leaderboard.reduce((bestKd, player) => Math.max(bestKd, Number(player.kdRatio)), 0).toFixed(2)}
					</div>
				</div>
			</section>
		</div>
	)
}
