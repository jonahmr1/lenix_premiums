import { Button } from "@workspace/ui/components/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { useNavigate } from "react-router"
import { MODES } from "../constants"
import { useContext } from "react"
import { CompetitiveContext } from "../context"
import { asserts } from "@lenix/lenix"
import { ArrowRight } from "lucide-react"
import { Xbox } from "@/components/xbox"
import { audio, toast } from "@workspace/ui/lib/utils"
import { motion } from "motion/react"
import { anim } from "@/lib"

const MotionButton = motion.create(Button)

export const Play = () => {
	const nav = useNavigate()
	const context = useContext(CompetitiveContext)
	asserts(context, `Failed to use competitive context`)

	const mode = context.selectedMode

	return (
		<div className="size-full flex justify-between px-3xl py-xl">
			<ButtonGroup orientation='vertical' className="h-full justify-end">
				<Button
					className="h-auto p-0 relative hover:brightness-75"
					onClick={() => nav('/competitive/lobby/mode')}
				>
					<img src={MODES[mode].image} className="max-w-[40vmin] pointer-events-none" />
					<p className="absolute top-0 bg-background/50 text-foreground w-full">Mode Selected</p>
					<p className="absolute bottom-0 bg-background text-foreground w-full text-fluid-3 font-black text-start px-md">{MODES[mode].label}</p>
				</Button>
				<Button size='lg' className="uppercase border-t text-fluid-5! font-black italic px-4xl py-xl hover:text-foreground hover:bg-background">Start</Button>
			</ButtonGroup>
			<Card className="w-1/5 h-1/2 self-center">
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
						variant="outline"
						animate={{ width: 'auto' }}
						whileHover={{ width: '100%' }}
						className="group justify-between transition"
						onClick={() =>{
							toast('Missions are not available yet', { toasterId: 'notify' })
							audio.unavailable()
						}}
					>
						View Missions
						<ArrowRight className="hidden group-hover:block transition-opacity" />
					</MotionButton>
				</CardFooter>
			</Card>
		</div>
	)
}