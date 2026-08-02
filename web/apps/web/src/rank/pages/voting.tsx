import rungunImage from "@workspace/elite/assets/rungun.png"
import { Badge } from "@workspace/elite/components/badge"
import { Clock, Map, Vote } from "lucide-react"

const voting = {
	timeLeft: "00:24",
	votedPlayers: 4,
	totalPlayers: 10,
	maps: [
		{
			name: "Downtown",
			image: rungunImage,
			votes: 4,
		},
		{
			name: "Vinewood",
			image: rungunImage,
			votes: 3,
		},
		{
			name: "Sandy Shores",
			image: rungunImage,
			votes: 2,
		},
		{
			name: "Docks",
			image: rungunImage,
			votes: 1,
		},
	],
}

const totalVotes = voting.maps.reduce((total, map) => total + map.votes, 0)

const getVotePercent = (votes: number) => totalVotes ? Math.round((votes / totalVotes) * 100) : 0

export const Voting = () => {
	const voteProgress = Math.round((voting.votedPlayers / voting.totalPlayers) * 100)

	return (
		<div className="flex h-screen min-h-0 w-full flex-col gap-[clamp(1rem,1.8vw,2rem)] overflow-hidden px-[clamp(1.5rem,3vw,4rem)] py-[clamp(0.6rem,0.9vw,1rem)] text-foreground">
			<div className="flex items-center justify-between rounded-xl border border-foreground/10 bg-background/35 px-[clamp(0.9rem,1.25vw,1.25rem)] py-[clamp(0.75rem,1vw,1rem)]">
				<div className="flex items-center gap-3 text-primary">
					<Vote className="size-[clamp(1.4rem,2vw,1.9rem)]" />
					<div>
						<h1 className="text-[clamp(1.05rem,1.5vw,1.45rem)] font-extrabold uppercase tracking-widest">Map Vote</h1>
						<p className="text-[clamp(0.65rem,0.8vw,0.8rem)] font-semibold text-muted-foreground">Choose the next arena</p>
					</div>
				</div>
				<Badge variant="outline" className="gap-2 border-primary/30 bg-primary/10 px-3 py-2 text-primary">
					<Clock className="size-4" />
					{voting.timeLeft}
				</Badge>
			</div>

			<div className="grid min-h-[clamp(22rem,58vh,34rem)] grid-cols-4 gap-[clamp(1rem,1.8vw,2rem)]">
				{voting.maps.map(map => {
					const percent = getVotePercent(map.votes)

					return (
						<button
							key={map.name}
							className="group cursor-pointer flex min-h-0 flex-col overflow-hidden rounded-xl border border-foreground/10 bg-background/35 text-left transition-colors hover:border-primary/50"
						>
							<div className="relative min-h-0 flex-1 overflow-hidden">
								<img src={map.image} alt="" className="h-full w-full object-cover opacity-70 transition-transform group-hover:scale-105" />
								<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
								<div className="absolute left-4 top-4 flex items-center gap-2 text-primary">
									<Map className="size-4" />
									<span className="text-xs font-bold uppercase tracking-widest">Map</span>
								</div>
								<div className="absolute inset-x-4 bottom-4">
									<h2 className="truncate text-[clamp(1.1rem,1.6vw,1.5rem)] font-extrabold uppercase tracking-widest">{map.name}</h2>
									<div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10">
										<div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
									</div>
								</div>
							</div>
							<div className="border-t border-foreground/10 bg-foreground/[0.04]">
								<div className="p-4">
									<div className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">Votes</div>
									<div className="mt-1 text-2xl font-extrabold">{map.votes}</div>
								</div>
							</div>
						</button>
					)
				})}
			</div>

			<div className="mt-[clamp(0.5rem,1vw,1rem)] rounded-xl border border-foreground/10 bg-background/35 px-[clamp(1rem,1.5vw,1.5rem)] py-[clamp(0.8rem,1.1vw,1rem)]">
				<div className="flex items-center justify-center gap-4">
					<Clock className="size-5 text-muted-foreground" />
					<div className="text-[clamp(1rem,1.4vw,1.3rem)] font-extrabold text-primary">{voting.timeLeft}</div>
					<div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
						{voting.votedPlayers}/{voting.totalPlayers} players have voted
					</div>
				</div>
				<div className="mx-auto mt-4 h-2 max-w-3xl overflow-hidden rounded-full bg-foreground/10">
					<div className="h-full rounded-full bg-primary" style={{ width: `${voteProgress}%` }} />
				</div>
			</div>
		</div>
	)
}
