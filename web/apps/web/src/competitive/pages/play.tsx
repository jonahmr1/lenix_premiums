import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import deathmatch from '@workspace/ui/assets/competitive/lobby/deathmatch.png'

export const Play = () => {
	return (
		<div className="size-full flex items-end justify-start px-2xl">
			<ButtonGroup orientation='vertical'>
				<Button className="h-auto p-0 relative">
					<img src={deathmatch} className="max-w-[40vmin] pointer-events-none" />
					<p className="absolute bottom-0 bg-background text-foreground w-full text-fluid-3 font-black text-start px-md">DEATHMATCH</p>
				</Button>
				<Button size='lg' className="uppercase text-fluid-4! font-black italic px-4xl py-xl">Start</Button>
			</ButtonGroup>
		</div>
	)
}