import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Outlet } from "react-router"
import { GAME_MODES } from "@/constants"
import { Dot } from "lucide-react"
import { useState } from "react"
import { ButtonGroup } from "@/components/ui/button-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export const Play = () => {
	const [selectedMode, setSelectedMode] = useState<typeof GAME_MODES[number]['name']>()
	const [playersAmountSelected, setPlayersAmountSelected] = useState<number>(1)

	return (
		<Layout className="gap-2">
			<ButtonGroup className="items-start border-b grid grid-flow-col auto-cols-fr gap-5">
				{GAME_MODES.map(mode => (
					<Button
						key={mode.name}
						className={`relative underline-offset-10 border-0 flex flex-col px-0 text-xs text-foreground w-full ${selectedMode === mode.name ? 'text-primary underline' : ''}`}
						variant="link"
						onClick={() => selectedMode !== mode.name ? setSelectedMode(mode.name) : setSelectedMode(undefined)}
					>
						{mode.name}
						<Dot
							className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${selectedMode === mode.name ? 'size-10 text-primary' : 'size-4 text-foreground'}`}
						/>
					</Button>
				))}
			</ButtonGroup>
			<ToggleGroup
				className={selectedMode ? 'opacity-100' : 'opacity-0'}
				variant="outline"
				type="single"
				value={playersAmountSelected?.toString()}
				onValueChange={value => Number(value) > 0 ? setPlayersAmountSelected(Number(value)) : setPlayersAmountSelected(playersAmountSelected)}
			>
				{Array.from({ length: GAME_MODES.find(mode => mode.name === selectedMode)?.playersPerTeam || 1 }, (_, amountOfPlayers) => (
					<ToggleGroupItem 
						value={String(amountOfPlayers + 1)}
						className={`${playersAmountSelected === amountOfPlayers + 1 ? 'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground' : ''}`}
					>
						{amountOfPlayers + 1}v{amountOfPlayers + 1}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<ButtonGroup className="flex-1 items-center justify-center h-full w-full">
				{Array.from({ length: playersAmountSelected }, (_, i) => (
					<Button className="h-7/10 w-2/10">+</Button>
				))}
			</ButtonGroup>
			<Outlet />
		</Layout>
	)
}