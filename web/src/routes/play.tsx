import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Outlet } from "react-router"
import { GAME_MODES } from "@/constants"
import { Dot } from "lucide-react"
import { useState } from "react"
import { ButtonGroup } from "@/components/ui/button-group"

export const Play = () => {
	const [selectedMode, setSelectedMode] = useState<typeof GAME_MODES[number]['name']>()

	return (
		<Layout className="justify-start">
			<ButtonGroup className="items-start py-5 ">
				<div className="grid grid-flow-col auto-cols-fr gap-5 shrink-0 h-auto">
					{GAME_MODES.map(mode => (
						<Button
							key={mode.name}
							className={`relative border-0 flex flex-col px-0 text-xs text-foreground w-full ${selectedMode === mode.name ? 'text-primary' : ''}`}
							variant="link"
							onClick={() => selectedMode !== mode.name ? setSelectedMode(mode.name) : setSelectedMode(undefined)}
						>
							{mode.name}
							<Dot
								className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${selectedMode === mode.name ? 'size-10 text-primary' : 'size-4 text-white'}`}
							/>
						</Button>
					))}
				</div>
			</ButtonGroup>
			<Button>

			</Button>
			<Outlet />
		</Layout>
	)
}