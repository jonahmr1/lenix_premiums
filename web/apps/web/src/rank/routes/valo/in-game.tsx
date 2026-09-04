import avatar from '@workspace/ui/assets/rank/avatar.png'
import { Separator } from "@workspace/ui/components/separator"
import { User } from "lucide-react"
import { useEffect, useState } from "react"
import type { Competitive } from "types"
import { showTimer } from "@/rank/lib"
import { onNuiEmit } from "lenix/nui"
import { DEV } from "@/App"
import { rank } from 'config'

type TeamType = 'own' | 'opponent'

const Player = ({
	type, avatar, dead
}: {
	type: TeamType
	avatar: string
	dead: boolean
}) => (
	<img className={`h-full border ${dead && 'opacity-30'} ${type === 'own' ? 'border-blue-400' : 'border-red-400'}`} src={avatar} />
)

const PlayersLeft = ({ playersLeft }: { playersLeft: number }) => {
	return (
		<div className="flex items-center gap-0.5">
			<User size={8} strokeWidth={3} />
			<p className="text-fluid-2 pt-0.5">{playersLeft}</p>
		</div>
	)
}

export const InGame = () => {
	const [timer, setTimer] = useState<number>(0)
	const [teams, setTeams] = useState<Competitive.CasualMatch>()
	const [result, setResult] = useState<'win' | 'loss' | null>(null)

	useEffect(() => {
		if (DEV('rank')) {
			setTimer(10)
			setTeams({
				own: {
					roundsWon: 1,
					players: [
						{
							isDead: true,
							avatar,
							sessionId: 1
						},
						{
							isDead: false,
							avatar,
							sessionId: 1
						},
					]
				},
				opponent: {
					roundsWon: 1,
					players: [
						{
							isDead: false,
							avatar,
							sessionId: 1
						},
						{
							isDead: false,
							avatar,
							sessionId: 1
						},
					]
				},
			})
			return
		}

		const disposes = [
			onNuiEmit<Competitive.Events['newRound']>(
				'competitive:newRound', (mode, newTeams) => {
					const gameMode = rank.game_modes[mode]
					const delay = gameMode.pre_and_post_round_time
					
					if (teams) {
						if (teams.own.roundsWon === newTeams.own.roundsWon) {
							setResult('loss')
						} else setResult('win')
					}
					
					setTeams(newTeams)
					setTimer(delay)
					setTimeout(() => {
						setTimer(gameMode.round_time)
						setResult(null)
					}, delay * 1000)
				}
			),
			onNuiEmit<Competitive.Events['updateRound']>(
				'competitive:updateRound', (teams) => {
					setTeams(teams)
				}
			),
		]

		const interval = setInterval(() => setTimer(t => t && t - 1), 1000)

		return () => {
			disposes.forEach(dispose => dispose())
			clearInterval(interval)
		}
	}, [])

	if (!teams) return null

	const ownPlayersLeft = teams.own.players.filter(player => !player.isDead).length
	const opponentPlayersLeft = teams.opponent.players.filter(player => !player.isDead).length

	const Roundboard = () => (
		<div className="w-full h-xl flex justify-center">
			<div className="flex gap-0.5">
				{teams.own.players.map((player, i) => (
					<Player
						key={i}
						type='own'
						avatar={player.avatar ?? avatar}
						dead={player.isDead}
					/>
				))}
			</div>
			<div
				className="flex flex-col justify-between text-fluid-lg h-fit bg-linear-to-b from-background to-transparent"
			>
				<p className="px-4">
					{showTimer(timer)}
				</p>
				<Separator />
				<div className="flex w-full justify-evenly">
					<div className="flex flex-col items-center justify-center text-blue-500 -space-y-0.5">
						<p>{teams.own.roundsWon}</p>
						<PlayersLeft playersLeft={ownPlayersLeft} />
					</div>
					<Separator orientation='vertical' />
					<div className="flex flex-col items-center justify-center text-red-500 -space-y-0.5">
						<p>{teams.opponent.roundsWon}</p>
						<PlayersLeft playersLeft={opponentPlayersLeft} />
					</div>
				</div>
			</div>
			<div className="flex gap-0.5">
				{teams.opponent.players.map((player, i) => (
					<Player
						key={i}
						type='opponent'
						avatar={player.avatar ?? avatar}
						dead={player.isDead}
					/>
				))}
			</div>
		</div>
	)

	const Result = ({ result }: { result: Competitive.Performance['result'] }) => (
		<div className={`absolute-center w-2/3 h-1/5 flex items-center justify-center ${result === 'win' ? 'bg-deep-emerald-950/80 deep-50' : 'bg-deep-red-950/80 deep-50'}`}>
			<span className={`text-fluid-10 uppercase ${result === 'win' ? 'text-emerald-400' : 'text-red-500'}`}>{result === 'win' ? 'Victory' : 'Loss'}</span>
		</div>
	)

	return (
		<>
			<Roundboard />
			{result && <Result result="win" />}
		</>
	)
}
