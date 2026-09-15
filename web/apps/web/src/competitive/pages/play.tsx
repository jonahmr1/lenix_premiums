import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import deathmatch from '@workspace/ui/assets/competitive/lobby/deathmatch.png'
import { useNavigate } from "react-router"

export const Play = () => {
	const nav = useNavigate()

	return (
		<div className="size-full flex items-end justify-start px-2xl">
			<ButtonGroup orientation='vertical'>
				<Button
					className="h-auto p-0 relative"
					onClick={() => nav('/competitive/lobby/mode')}
				>
					<img src={deathmatch} className="max-w-[40vmin] pointer-events-none" />
					<p className="absolute top-0 bg-background/50 text-foreground w-full">Mode Selected</p>
					<p className="absolute bottom-0 bg-background text-foreground w-full text-fluid-3 font-black text-start px-md">DEATHMATCH</p>
				</Button>
				<Button size='lg' className="uppercase border-t text-fluid-5! font-black italic px-4xl py-xl hover:text-foreground hover:bg-background">Start</Button>
			</ButtonGroup>
		</div>
	)
}