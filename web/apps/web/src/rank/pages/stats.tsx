import { Badge } from '@workspace/elite/components/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/elite/components/tabs'
import { calculatePlayerScore, getRankTier } from '../lib'
import { Activity, BarChart3, Clock, Crosshair, History, Shield, Skull, Sparkles, Trophy } from 'lucide-react'
import type { Rank } from 'types'
import { useEffect, useState } from 'react'
import { Loading } from '@workspace/elite/elements/loading.js'
import { triggerNui } from 'lenix/nui'
import { useStats } from '../hooks/use-stats'

const copy = {
	title: 'Statistics',
	subtitle: 'Your ranked performance overview',
	tabs: {
		stats: 'My Stats',
		history: 'Match History',
	},
}

const Panel = ({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) => (
	<section className={`rounded-xl border border-foreground/10 bg-background/35 ${className}`}>{children}</section>
)

export const Stats = ({ profile }: { profile: Rank.Player['Profile'] }) => {
	const { stats } = useStats()
	const [matches, setMatches] = useState<Rank.Player['Match'][]>()

	useEffect(() => {
		triggerNui<Rank.Requests['getMatches']>('rank:getMatches', {}).then(setMatches)
	}, [])

	if (!matches || !stats) return <Loading className='h-full' />

	const score = calculatePlayerScore(stats)
	const rank = getRankTier(score)

	const summary = [
		{ label: 'Rank', value: rank.label, icon: Shield, className: rank.className },
		{ label: 'Score', value: score.toLocaleString(), icon: Trophy, className: 'text-primary' },
		{ label: 'Matches', value: matches.toLocaleString(), icon: Activity, className: 'text-foreground' },
		{ label: 'Win Rate', value: stats.winRate, icon: BarChart3, className: 'text-green-400' },
	]

	const details = [
		{ label: 'Wins', value: stats.wins.toLocaleString() },
		{ label: 'Losses', value: stats.losses.toLocaleString() },
		{ label: 'Kills', value: stats.kills.toLocaleString() },
		{ label: 'Deaths', value: stats.deaths.toLocaleString() },
		{ label: 'Assists', value: stats.assists.toLocaleString() },
		{ label: 'K/D Ratio', value: stats.killsDeathsRatio },
	]

	return (
		<div className='flex h-full min-h-0 w-full flex-col gap-[clamp(0.75rem,1.2vw,1.25rem)] overflow-hidden px-[clamp(0.5rem,0.9vw,1rem)] py-[clamp(0.6rem,0.9vw,1rem)] text-foreground'>
			<Panel className='p-[clamp(0.8rem,1.25vw,1.25rem)]'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div className='flex min-w-0 items-center gap-3 text-primary'>
						<BarChart3 className='size-[clamp(1.4rem,2vw,1.9rem)]' />
						<div className='min-w-0'>
							<h1 className='text-[clamp(1.05rem,1.5vw,1.45rem)] font-extrabold uppercase tracking-widest'>
								{copy.title}
							</h1>
							<p className='text-[clamp(0.65rem,0.8vw,0.8rem)] font-semibold text-muted-foreground'>{copy.subtitle}</p>
						</div>
					</div>
					<Badge variant='outline' className='gap-2 border-primary/30 bg-primary/10 px-3 py-2 text-primary'>
						<Sparkles className='size-4' />
						{profile.name}
					</Badge>
				</div>
			</Panel>

			<Tabs defaultValue='stats' className='min-h-0 flex-1 flex-col gap-3'>
				<TabsList className='h-9 w-fit shrink-0 border border-foreground/10 bg-background/35'>
					<TabsTrigger value='stats' className='h-full flex-none gap-2 px-3'>
						<BarChart3 className='size-4' />
						{copy.tabs.stats}
					</TabsTrigger>
					<TabsTrigger value='history' className='h-full flex-none gap-2 px-3'>
						<History className='size-4' />
						{copy.tabs.history}
					</TabsTrigger>
				</TabsList>

				<TabsContent value='stats' className='min-h-0 overflow-hidden'>
					<div className='grid h-full min-h-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-[clamp(0.75rem,1.2vw,1.25rem)]'>
						<Panel className='flex min-h-0 flex-col p-[clamp(0.8rem,1.1vw,1rem)]'>
							<div className='flex items-center gap-2 text-primary'>
								<Shield className='size-5 fill-primary/20' />
								<h2 className='text-xs font-bold uppercase tracking-widest'>Current Rank</h2>
							</div>
							<div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-center'>
								<div className='grid size-[clamp(5rem,7vw,6.5rem)] place-items-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/30 via-background to-primary/10'>
									<Trophy className='size-[clamp(2.5rem,3.5vw,3.25rem)] fill-primary/25 text-primary' />
								</div>
								<div>
									<div
										className={`text-[clamp(1.35rem,2vw,1.85rem)] font-extrabold uppercase tracking-widest ${rank.className}`}
									>
										{rank.label}
									</div>
									<div className='mt-1 text-[clamp(0.95rem,1.3vw,1.2rem)] font-bold text-primary'>
										{score.toLocaleString()} Score
									</div>
								</div>
								<div className='grid w-full grid-cols-2 gap-2'>
									<div className='rounded-lg border border-foreground/10 bg-foreground/[0.04] p-3'>
										<div className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>Win Rate</div>
										<div className='mt-1 text-lg font-extrabold text-green-400'>{stats.winRate}</div>
									</div>
									<div className='rounded-lg border border-foreground/10 bg-foreground/[0.04] p-3'>
										<div className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
											History Items
										</div>
										<div className='mt-1 text-lg font-extrabold text-foreground'>{matches.length}</div>
									</div>
								</div>
							</div>
						</Panel>

						<div className='grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-[clamp(0.75rem,1.2vw,1.25rem)]'>
							<div className='grid grid-cols-4 gap-[clamp(0.55rem,0.9vw,0.9rem)]'>
								{summary.map(item => {
									const Icon = item.icon

									return (
										<Panel key={item.label} className='p-[clamp(0.65rem,0.9vw,0.85rem)]'>
											<div className='flex items-center gap-2 text-muted-foreground'>
												<Icon className='size-4 text-primary' />
												<span className='text-[0.65rem] font-bold uppercase tracking-widest'>{item.label}</span>
											</div>
											<div
												className={`mt-2 truncate text-[clamp(1rem,1.35vw,1.25rem)] font-extrabold ${item.className}`}
											>
												{item.value}
											</div>
										</Panel>
									)
								})}
							</div>

							<Panel className='min-h-0 p-[clamp(0.75rem,1vw,1rem)]'>
								<div className='grid h-full grid-cols-4 grid-rows-2 gap-[clamp(0.55rem,0.9vw,0.9rem)]'>
									{details.map(item => (
										<div
											key={item.label}
											className='flex min-h-0 flex-col items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.04] p-[clamp(0.75rem,1.2vw,1.25rem)] text-center'
										>
											<div className='text-[clamp(0.78rem,1vw,1rem)] font-bold uppercase tracking-widest text-muted-foreground'>
												{item.label}
											</div>
											<div className='mt-3 max-w-full truncate text-[clamp(1.65rem,2.6vw,2.6rem)] font-extrabold leading-none text-foreground'>
												{item.value}
											</div>
										</div>
									))}
								</div>
							</Panel>
						</div>
					</div>
				</TabsContent>

				<TabsContent value='history' className='min-h-0 overflow-hidden'>
					<Panel className='flex h-full min-h-0 flex-col p-[clamp(0.75rem,1vw,1rem)]'>
						<div className='grid grid-cols-[7rem_minmax(8rem,1fr)_7rem_7rem_5rem_5rem_5rem_6rem] gap-3 px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground'>
							<span>Result</span>
							<span>Match</span>
							<span>Mode</span>
							<span>Duration</span>
							<span className='text-right'>Kills</span>
							<span className='text-right'>Deaths</span>
							<span className='text-right'>Assists</span>
							<span className='text-right'>Score</span>
						</div>
						<div className='min-h-0 flex-1 space-y-2 overflow-y-auto pr-1'>
							{matches.map(match => (
								<div
									key={match.match_id}
									className='grid grid-cols-[7rem_minmax(8rem,1fr)_7rem_7rem_5rem_5rem_5rem_6rem] items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.04] px-3 py-2 text-[clamp(0.68rem,0.78vw,0.82rem)]'
								>
									<Badge
										variant='outline'
										className={`w-fit px-2 py-1 uppercase ${match.result === 'win' ? 'border-green-400/30 bg-green-400/10 text-green-400' : 'border-destructive/30 bg-destructive/10 text-destructive'}`}
									>
										{match.result}
									</Badge>
									<span className='min-w-0'>
										<span className='block truncate font-bold text-foreground'>{match.map}</span>
										<span className='flex items-center gap-1 text-[0.65rem] font-semibold text-muted-foreground'>
											<Clock className='size-3' />
											{match.played_at}
										</span>
									</span>
									<span className='flex items-center justify-end gap-1 font-bold text-foreground'>
										<Crosshair className='size-3 text-primary' />
										{match.stats.kills}
									</span>
									<span className='flex items-center justify-end gap-1 font-bold text-foreground'>
										<Skull className='size-3 text-muted-foreground' />
										{match.stats.deaths}
									</span>
									<span className='text-right font-bold text-foreground'>{match.stats.assits}</span>
									<span
										className={`text-right font-extrabold ${match.delta > 0 ? 'text-green-400' : 'text-destructive'}`}
									>
										{match.delta > 0 ? '+' : ''}
										{match.delta}
									</span>
								</div>
							))}
						</div>
					</Panel>
				</TabsContent>
			</Tabs>
		</div>
	)
}
