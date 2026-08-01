import { Badge } from "@workspace/elite/components/badge"
import { Button } from "@workspace/elite/components/button"
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@workspace/elite/components/context-menu"
import { Separator } from "@workspace/elite/components/separator"
import { ToggleGroup, ToggleGroupItem } from "@workspace/elite/components/toggle-group"
import { PvP_AMOUNT, rankTiers } from "../constants"
import { common, user } from "../data"
import { entries } from "@lenix/lenix"
import {
	ChevronRight,
	Crown,
	Info,
	LineChart,
	PackageOpen,
	Shield,
	Target,
	Trophy,
	User,
	UserPlus,
	Users,
} from "lucide-react"
import { useNavigate } from "react-router"
import { useState } from "react"
import { calculatePlayerScore, getRankTier } from "../lib"

const modeIcons = [User, Users, Users, Users]

const Panel = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
	<section className={`rounded-xl border border-foreground/10 ${className}`}>
		{children}
	</section>
)

const SectionTitle = ({ icon, children }: React.PropsWithChildren<{ icon: React.ReactNode }>) => (
	<div className="flex items-center gap-[clamp(0.4rem,0.7vw,0.75rem)] text-primary">
		{icon}
		<h2 className="text-[clamp(0.65rem,0.75vw,0.8rem)] font-bold uppercase tracking-widest">{children}</h2>
	</div>
)
export const Play = ({ onOpenFriendsDrawer }: {
	onOpenFriendsDrawer?: () => void
}) => {
	const nav = useNavigate()

	const pvpOptions = entries(PvP_AMOUNT)
	const player = common.users[user.id]

	const leaderboard = entries(common.users)
		.map(([userId, { name, avatar, stats }]) => ({
			userId,
			name,
			avatar,
			score: calculatePlayerScore(stats),
		}))
		.sort((a, b) => b.score - a.score)
		.map((player, index) => ({
			...player,
			place: index + 1,
		}));

	const teamMembers = [
		{
			name: player.name,
			avatar: player.avatar,
			score: leaderboard.find(data => data.userId === user.id)?.score || -1
		},
		{
			name: common.users['nour'].name,
			avatar: common.users['nour'].avatar,
			score: leaderboard.find(data => data.userId === 'nour')?.score,
		}
	]

	const [partySize, setPartySize] = useState<string>(teamMembers.length.toString())

	const topLeaderboard = leaderboard.slice(0, 5)
	const currentPlayerLeaderboardRow = leaderboard.find(data => data.userId === user.id)
	const visibleLeaderboard = currentPlayerLeaderboardRow && !topLeaderboard.some(data => data.userId === user.id)
		? [...topLeaderboard, currentPlayerLeaderboardRow]
		: leaderboard.slice(0, 6)
	const playerStats = player.stats
	const currentPlayerScore = calculatePlayerScore(playerStats)
	const currentRank = getRankTier(currentPlayerScore)
	const currentRankIndex = rankTiers.findIndex(rank => rank.label === currentRank.label)
	const nextRank = currentRankIndex > 0 ? rankTiers[currentRankIndex - 1] : undefined
	const rankMinScore = currentRank.minScore
	const nextRankMinScore = nextRank?.minScore ?? currentPlayerScore
	const rankProgress = nextRank
		? Math.min(100, Math.max(0, ((currentPlayerScore - rankMinScore) / (nextRankMinScore - rankMinScore)) * 100))
		: 100
	const stats = [
		{ label: "Matches", value: playerStats.wins + playerStats.losses },
		{ label: "Wins", value: playerStats.wins },
		{ label: "Win Rate", value: `${((playerStats.wins / (playerStats.wins + playerStats.losses)) * 100).toFixed(1)}%` },
		{ label: "Kills", value: playerStats.kills },
		{ label: "Deaths", value: playerStats.deaths },
		{ label: "K/D Ratio", value: (playerStats.kills / playerStats.deaths).toFixed(2) },
	]

	return (
		<div className="grid h-full w-full grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)_minmax(0,1.35fr)] grid-rows-[minmax(0,3fr)_minmax(0,2fr)_auto] gap-[clamp(1rem,1.5vw,1.5rem)] overflow-hidden px-[clamp(0.5rem,0.9vw,1rem)] py-[clamp(0.6rem,0.9vw,1rem)] text-foreground">
			<Panel className="col-start-1 row-start-1 flex min-h-0 flex-col p-[clamp(0.75rem,1vw,1rem)]">
				<SectionTitle icon={<Shield className="size-5 fill-primary/20" />}>Current Rank</SectionTitle>
				<div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(0.5rem,0.8vw,0.75rem)] text-center">
					<div className="relative grid size-[clamp(5.5rem,8vw,7rem)] place-items-center">
						<div className="relative grid size-[clamp(4.5rem,6.25vw,5.75rem)] place-items-center rounded-[1.1rem] border border-primary/30 bg-gradient-to-br from-primary/30 via-background to-primary/10">
							<Crown className="size-[clamp(2.5rem,3.5vw,3.25rem)] fill-primary/30 text-primary" />
						</div>
					</div>
					<div>
						<h1 className={`text-[clamp(1.3rem,1.9vw,1.75rem)] font-extrabold uppercase tracking-widest ${currentRank.className}`}>{currentRank.label}</h1>
						<p className="mt-0.5 text-[clamp(1rem,1.35vw,1.25rem)] font-bold text-primary">{currentPlayerScore.toLocaleString()} Score</p>
					</div>
					<div className="w-full">
						<div className="h-2.5 overflow-hidden rounded-full bg-foreground/10">
							<div className="h-full rounded-full bg-gradient-to-r from-primary to-yellow-200" style={{ width: `${rankProgress}%` }} />
						</div>
						<div className="mt-2 flex justify-between text-xs font-semibold text-muted-foreground">
							<span>{rankMinScore.toLocaleString()} Score</span>
							<span>{nextRankMinScore.toLocaleString()} Score</span>
						</div>
					</div>
					<p className="text-xs text-muted-foreground">
						{nextRank ? (
							<>Next Rank: <span className={`font-bold ${nextRank.className}`}>{nextRank.label}</span></>
						) : (
							<span className="font-bold text-primary">Highest Rank</span>
						)}
					</p>
				</div>
			</Panel>

			<Panel className="col-start-1 row-start-2 grid min-h-0 p-[clamp(0.75rem,1vw,1rem)]">
				<div className="grid h-full place-items-center rounded-lg border border-dashed border-foreground/10 bg-foreground/[0.02] px-4 text-center">
					<div className="flex flex-col items-center gap-2">
						<PackageOpen className="size-[clamp(1.6rem,2.4vw,2.25rem)] text-primary/80" />
						<div>
							<h3 className="text-[clamp(0.75rem,0.9vw,0.9rem)] font-bold uppercase tracking-widest text-primary">Future Feature</h3>
							<p className="mt-1 text-[clamp(0.65rem,0.75vw,0.75rem)] font-semibold text-muted-foreground">This panel is reserved for upcoming content.</p>
						</div>
					</div>
				</div>
			</Panel>

			<Panel className="relative col-start-2 row-span-2 row-start-1 flex min-h-0 flex-col p-[clamp(0.9rem,1.2vw,1.25rem)]">
				<div className="absolute inset-x-0 -top-1/10 h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.22),transparent_65%)]" />
				<div className="relative flex justify-end">
					<Info className="size-5 text-muted-foreground" />
				</div>

				<div className="relative flex min-h-0 flex-1 flex-col">
					<div className="flex min-h-0 flex-1 flex-col">
						<div className="flex min-h-0 flex-1 flex-col justify-center">
							<div className="mb-[clamp(0.5rem,0.9vw,0.9rem)] text-center">
								<Target className="mx-auto mb-1.5 size-[clamp(1.7rem,2.4vw,2.1rem)] text-primary" />
								<h1 className="text-[clamp(1.35rem,2vw,1.8rem)] font-extrabold uppercase tracking-widest text-primary">Search Match</h1>
								<p className="mt-0.5 text-[clamp(0.75rem,0.95vw,0.9rem)] font-semibold text-muted-foreground">Compete and climb the ranks</p>
							</div>
							<div className="mx-auto mb-[clamp(0.55rem,0.9vw,0.9rem)] w-[min(78%,28rem)] overflow-hidden rounded-lg border border-foreground/10 bg-background/35">
								{teamMembers.map((teamPlayer, index) => {
									const isLeader = 'Lenix' === teamPlayer.name

									return (
										<ContextMenu key={teamPlayer.name}>
											<ContextMenuTrigger asChild>
												<div className="grid cursor-context-menu grid-cols-[1.4rem_minmax(0,1fr)_minmax(5.75rem,auto)_3rem] items-center gap-2 border-b border-foreground/5 px-[clamp(0.45rem,0.8vw,0.75rem)] py-[clamp(0.3rem,0.45vw,0.42rem)] text-[clamp(0.62rem,0.72vw,0.7rem)] last:border-b-0">
													<span>{index + 1}</span>
													<span className="flex min-w-0 items-center gap-2 font-semibold">
														{typeof teamPlayer.avatar === 'string' && teamPlayer.avatar.startsWith('/') ? (
															<img src={teamPlayer.avatar} alt="" className="size-4 shrink-0 rounded-full bg-background object-cover" />
														) : (
															<span className="grid size-4 shrink-0 place-items-center rounded-full bg-foreground/10 text-[0.6rem]">
																<img src={teamPlayer.avatar} />
															</span>
														)}
														<span className="truncate">{teamPlayer.name}</span>
													</span>
													<span className="flex justify-end">
														{isLeader && <Crown className="size-4 text-primary" />}
													</span>
												</div>
											</ContextMenuTrigger>
											<ContextMenuContent className="bg-popover/70">
												<ContextMenuItem disabled={isLeader} onClick={() => {/* TODO */ }}>
													Set As Leader
												</ContextMenuItem>
												<ContextMenuSeparator />
												<ContextMenuItem variant="destructive" disabled={teamPlayer.name === player.name} onClick={() => {/* TODO */ }}>
													Kick Player
												</ContextMenuItem>
											</ContextMenuContent>
										</ContextMenu>
									)
								})}
							</div>
						</div>

						<div className="mt-auto">
							<h3 className="mb-2 text-[clamp(0.65rem,0.75vw,0.75rem)] font-bold uppercase tracking-widest text-primary">Party Size</h3>
							<ToggleGroup
								className="grid w-full gap-[clamp(0.45rem,0.8vw,0.75rem)]"
								style={{ gridTemplateColumns: `repeat(${pvpOptions.length}, minmax(0, 1fr))` }}
								type="single"
								value={partySize}
								onValueChange={value => value && setPartySize(value)}
							>
								{pvpOptions.map(([pvpAmount], index) => {
									const Icon = modeIcons[index] ?? Users
									const size = index + 1

									return (
										<ToggleGroupItem
											key={pvpAmount}
											value={pvpAmount.toString()}
											className="h-[clamp(3.8rem,6vw,4.75rem)] flex-col gap-1 rounded-lg border border-foreground/10 bg-foreground/[0.04] text-[clamp(0.78rem,0.95vw,0.9rem)] data-[state=on]:border-primary data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
											disabled={teamMembers.length > pvpAmount}
										>
											<Icon className="size-[clamp(1.25rem,1.8vw,1.5rem)]" />
											<span>{size}v{size}</span>
										</ToggleGroupItem>
									)
								})}
							</ToggleGroup>
						</div>
					</div>

					<Separator className="my-[clamp(0.65rem,1vw,1rem)] bg-foreground/10" />

					<div className="mt-auto">
						<Button variant="ghost" className="w-full gap-2 bg-foreground/[0.06] px-[clamp(0.75rem,1.1vw,1rem)] text-primary" onClick={onOpenFriendsDrawer}>
							<UserPlus /> Invite Players
						</Button>
					</div>
					<div className="mt-[clamp(0.75rem,1.2vw,1.25rem)]">
						<Button className="h-[clamp(2.1rem,3vw,2.75rem)] w-full border-primary rounded-lg bg-primary/50 text-[clamp(0.95rem,1.25vw,1.15rem)] font-bold text-foreground hover:from-yellow-700 hover:to-primary">
							Find Match <ChevronRight className="text-primary size-6" />
						</Button>
					</div>
				</div>
			</Panel>

			<Panel className="col-start-3 row-start-1 flex min-h-0 flex-col p-[clamp(0.75rem,1vw,1rem)]">
				<div className="mb-3 flex items-center justify-between">
					<SectionTitle icon={<Trophy className="size-5 fill-primary/20" />}>Leaderboard</SectionTitle>
				</div>
				<div className="grid grid-cols-[1.8rem_minmax(0,1fr)_minmax(6.5rem,auto)_3.8rem] gap-2 px-[clamp(0.45rem,0.8vw,0.75rem)] pb-1.5 text-[clamp(0.62rem,0.72vw,0.72rem)] font-bold uppercase tracking-widest text-muted-foreground">
					<span>#</span>
					<span>Player</span>
					<span>Rank</span>
					<span className="text-right">Score</span>
				</div>
				<div className="min-h-0 flex-1 space-y-[clamp(0.2rem,0.35vw,0.35rem)] overflow-hidden">
					{visibleLeaderboard.map(player => {
						const isCurrentPlayer = player.userId === user.id

						return (
							<div
								key={player.userId}
								className={`grid grid-cols-[1.8rem_minmax(0,1fr)_minmax(6.5rem,auto)_3.8rem] items-center gap-2 rounded-md px-[clamp(0.45rem,0.8vw,0.75rem)] py-[clamp(0.2rem,0.35vw,0.35rem)] text-[clamp(0.62rem,0.72vw,0.72rem)] hover:bg-foreground/[0.04] ${isCurrentPlayer ? 'border border-primary/30 bg-primary/15 text-primary' : ''}`}
							>
								<span className={`font-bold ${isCurrentPlayer ? 'text-primary' : 'text-muted-foreground'}`}>{player.place}</span>
								<span className={`flex min-w-0 items-center gap-3 font-semibold ${isCurrentPlayer ? 'font-bold text-primary' : ''}`}>
									<span className="grid size-6 shrink-0 place-items-center rounded-full bg-foreground/10 text-[0.65rem]">
										<img src={player.avatar} alt="" className="size-6 shrink-0 rounded-full bg-background object-cover" />
									</span>
									<span className="truncate">{player.name}</span>
								</span>
								<span className={isCurrentPlayer ? 'font-bold text-primary' : getRankTier(player.score).className}>{getRankTier(player.score).label}</span>
								<span className="text-right font-semibold">{player.score.toLocaleString()}</span>
							</div>
						)
					})}
				</div>
				<Button variant="ghost" size="sm" className="mx-auto mt-auto flex text-muted-foreground" onClick={() => nav('/leaderboard')}>
					View Full Leaderboard <ChevronRight className="text-primary" />
				</Button>
			</Panel>

			<Panel className="col-start-3 row-start-2 flex min-h-0 flex-col p-[clamp(0.55rem,0.8vw,0.75rem)]">
				<div className="mb-1.5">
					<SectionTitle icon={<LineChart className="size-5 text-primary" />}>Your Stats</SectionTitle>
				</div>
				<div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-[clamp(0.55rem,0.9vw,0.9rem)]">
					{stats.map(stat => (
						<div key={stat.label} className="flex min-h-0 flex-col items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.04] p-[clamp(0.45rem,0.75vw,0.7rem)] text-center">
							<p className="text-[clamp(0.6rem,0.72vw,0.72rem)] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
							<p className="mt-[clamp(0.25rem,0.45vw,0.45rem)] text-[clamp(1.05rem,1.4vw,1.3rem)] font-bold text-foreground">{stat.value}</p>
						</div>
					))}
				</div>
				<Button variant="ghost" size="xs" className="mx-auto mt-1.5 flex text-muted-foreground" onClick={() => nav('/stats')}>
					Detailed Statistics <ChevronRight className="text-primary" />
				</Button>
			</Panel>

			<div className="col-span-3 row-start-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
				<Badge variant="outline" className="gap-2 border-foreground/10 bg-background/25 px-3 py-2 text-xs normal-case">
					<span className="size-2 rounded-full bg-green-500" /> 5,210 Players Online
				</Badge>
				<Badge variant="outline" className="border-foreground/10 bg-background/25 px-3 py-2 text-xs normal-case">
					All Play Time: 14h 22m
				</Badge>
			</div>
		</div>
	)
}
