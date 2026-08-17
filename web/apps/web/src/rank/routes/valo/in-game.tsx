import { Layout } from "@workspace/ui/elements/layout"
import avatar from '@workspace/ui/assets/rank/avatar.png'
import { Separator } from "@workspace/ui/components/separator"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"
import { DEV } from "@/App.rank"
import type { Competitive } from "types"
import { config, showTimer } from "@/rank/lib"

type TeamType = 'own' | 'opponent'

const Player = ({
	type, avatar, dead
}: {
	type: TeamType
	avatar: string
	dead: boolean
}) => (
	<img className={`h-2/3 border ${dead && 'opacity-10'} ${type === 'own' ? 'border-blue-400' : 'border-red-400'}`} src={avatar} />
)

const PlayersLeft = ({ playersLeft }: { playersLeft: number }) => {
	return (
		<div className="flex items-center gap-0.5">
			<Users size={8} strokeWidth={3} />
			<p className="text-fluid-xs pt-0.5">{playersLeft}</p>
		</div>
	)
}

const RoundBoard = ({ time }: { time: number }) => {
	const [timer, setTimer] = useState<number>(time)
	const [teams, setTeams] = useState<Competitive.Round>()

	useEffect(() => {
		if (DEV) {
			setTeams({
				own: {
					roundsWon: 1,
					players: [
						{
							isDead: true,
							avatar
						},
						{
							isDead: false,
							avatar
						},
					]
				},
				opponent: {
					roundsWon: 3,
					players: [
						{
							isDead: false,
							avatar
						},
						{
							isDead: false,
							avatar
						},
					]
				},
			})
			
			const interval = setInterval(() => setTimer(t => t - 1), 1000)

			return () => clearInterval(interval)
		}
	}, [])

	if (!teams) return

  const ownPlayersLeft = teams.own.players.filter(player => !player.isDead).length
  const opponentPlayersLeft = teams.opponent.players.filter(player => !player.isDead).length

	return (
		<Layout className="h-screen bg-muted justify-start font-medium">
			<div className="w-full h-1/13 flex justify-center">
				<div className="flex gap-xs">
					{teams.own.players.map(player => (
						<Player {...{
							type: 'own',
							avatar: player.avatar,
							dead: player.isDead
						}} />
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
				<div className="flex gap-xs">
					{teams.opponent.players.map(player => (
						<Player {...{
							type: 'own',
							avatar: player.avatar,
							dead: player.isDead
						}} />
					))}
				</div>
			</div>
		</Layout>
	)
}

export const InGame = () => {
	const [roundTime, setRoundTime] = useState<number>()

	useEffect(() => {
		const mode = 'back_to_back'
		if (DEV) {
			setRoundTime(config.game_modes[mode].round_time)
			return
		}
	}, [])

	if (!roundTime) return

	return (
		<RoundBoard time={roundTime} />
	)
}
