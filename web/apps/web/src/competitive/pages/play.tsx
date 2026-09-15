import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { useNavigate } from "react-router"
import { MODES } from "../constants"
import { useContext } from "react"
import { CompetitiveContext } from "../context"
import { asserts } from "@lenix/lenix"

export const Play = () => {
	const nav = useNavigate()
	const context = useContext(CompetitiveContext)
	asserts(context, `Failed to use competitive context`)

	const mode = context.selectedMode

	return (
		<div className="size-full flex items-end justify-start px-2xl">
			<ButtonGroup orientation='vertical'>
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
		</div>
	)
}