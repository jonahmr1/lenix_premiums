import { Layout } from "@workspace/ui/elements/layout"
import avatar from '@workspace/ui/assets/rank/avatar.png'
import { Separator } from "@workspace/ui/components/separator"
import { Users } from "lucide-react"

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

export const InGame = () => {
	const teams = {
		own: [
			{
				isDead: true,
				avatar
			},
			{
				isDead: false,
				avatar
			},
		],
		opponent: [
			{
				isDead: false,
				avatar
			},
			{
				isDead: false,
				avatar
			},
		],
	}

  const ownPlayersLeft = teams.own.filter(player => !player.isDead).length
  const opponentPlayersLeft = teams.opponent.filter(player => !player.isDead).length

	return (
		<Layout className="h-screen bg-muted justify-start font-medium">
			<div className="w-full h-1/13 flex justify-center">
				<div className="flex gap-xs">
					{teams.own.map(player => (
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
					<p className="px-4">1:45</p>
					<Separator />
					<div className="flex w-full justify-evenly">
						<div className="flex flex-col items-center justify-center text-blue-500 -space-y-0.5">
							<p>1</p>
							<PlayersLeft playersLeft={ownPlayersLeft} />
						</div>
						<Separator orientation='vertical' />
						<div className="flex flex-col items-center justify-center text-red-500 -space-y-0.5">
							<p>3</p>
							<PlayersLeft playersLeft={opponentPlayersLeft} />
						</div>
					</div>
				</div>
				<div className="flex gap-xs">
					{teams.opponent.map(player => (
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
