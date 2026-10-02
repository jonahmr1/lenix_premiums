import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonGroup } from "@/components/ui/button-group"
import { MODES } from "@/constants"
import { Xbox } from "@/components/xbox"
import { audio } from "@/lib"
import { motion } from "motion/react"
import { anim } from "@/lib"
import { useStates } from "@/hooks"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ArrowRightIcon } from "@phosphor-icons/react"

const MotionButton = motion.create(Button)

export const Play = () => {
	const nav = useNavigate()
	const [{ lobby }] = useStates()

	const mode = lobby.mode

	return (
		<div className="size-full flex justify-between">
			<motion.div {...anim} initial={{ opacity: 0, x: `-10%` }} animate={{ opacity: 1, x: 0 }}>
				<ButtonGroup orientation='vertical' className="h-full justify-end">
					<Button
						className="h-auto p-0 relative hover:brightness-75"
						onClick={() => nav({ to: '/warzone/mode' })}
					>
						<img src={MODES[mode].image} className="max-w-w-20 pointer-events-none" />
						<p className="absolute top-0 bg-background/50 text-foreground w-full">Mode Selected</p>
						<p className="absolute bottom-0 bg-background text-foreground w-full text-v-2 text-start tracking-normal px-w-1">{MODES[mode].label}</p>
					</Button>
					<Button size='lg' className="uppercase border-t text-v-3.5 py-h-4 font-black italic hover:text-background hover:bg-foreground">Start</Button>
				</ButtonGroup>
			</motion.div>
			<motion.div
				{...anim}
				initial={{ opacity: 0, x: `10%` }}
				animate={{ opacity: 1, x: 0 }}
				className="w-1/5 h-1/2 self-center"
			>
				<Card className="size-full">
					<CardHeader>
						<CardTitle className="text-fluid-3 uppercase font-black italic tracking-normal">Missions</CardTitle>
						<CardDescription>All the upcoming missions and it's progress will show up here</CardDescription>
						<CardAction className="font-normal">No Mission</CardAction>
					</CardHeader>
					<CardContent className="size-full">
						<Xbox />
					</CardContent>
					<CardFooter>
						<MotionButton
							{...anim}
							variant='foreground'
							animate={{ width: 'auto' }}
							whileHover={{ width: '100%' }}
							className="group justify-between transition"
							onClick={() => {
								toast('Missions are not available yet', { toasterId: 'notify' })
								audio.unavailable()
							}}
						>
							View Missions
							<ArrowRightIcon className="hidden group-hover:block transition-opacity" />
						</MotionButton>
					</CardFooter>
				</Card>
			</motion.div>
		</div>
	)
}
