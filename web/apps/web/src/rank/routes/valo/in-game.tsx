import { Layout } from "@workspace/ui/elements/layout"
import avatar from '@workspace/ui/assets/rank/avatar.png'
import { Separator } from "@workspace/ui/components/separator"
import { Users } from "lucide-react"

type TeamType = 'teammate' | 'opponent'

export const InGame = () => {
	const Team = ({
		type, dead
	}: {
		type: TeamType
		dead: boolean
	}) => (
		<img className={`h-2/3 border ${dead && 'opacity-10'} ${type === 'teammate' ? 'border-blue-400' : 'border-red-400'}`} src={avatar} />
	)
	const PlayerLeft = () => {
		return (
			<div className="flex items-center gap-0.5">
				<Users size={8} strokeWidth={3} />
				<p className="text-fluid-xs pt-0.5">9</p>
			</div>
		)
	}
	return (
		<Layout className="h-screen bg-muted justify-start font-medium">
			<div className="w-full h-1/13 flex justify-center">
				<div className="flex gap-xs">
					<Team type="teammate" dead={true} />
					<Team type="teammate" dead={false} />
					<Team type="teammate" dead={false} />
					<Team type="teammate" dead={false} />
				</div>
				<div
					className="flex flex-col justify-between text-fluid-lg h-fit bg-linear-to-b from-background to-transparent"
				>
					<p className="px-4">1:45</p>
					<Separator />
					<div className="flex w-full justify-evenly">
						<div className="flex flex-col items-center justify-center text-blue-500 -space-y-0.5">
							<p>1</p>
							<PlayerLeft />
						</div>
						<Separator orientation='vertical' />
						<div className="flex flex-col items-center justify-center text-red-500 -space-y-0.5">
							<p>3</p>
							<PlayerLeft />
						</div>
					</div>
				</div>
				<div className="flex gap-xs">
					<Team type='opponent' dead={false} />
					<Team type='opponent' dead={false} />
					<Team type='opponent' dead={false} />
					<Team type='opponent' dead={false} />
				</div>
			</div>
		</Layout>
	)
}
