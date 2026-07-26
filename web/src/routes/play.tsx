import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Outlet } from "react-router"
import { GAME_MODES } from "@/constants"
import { Dot } from "lucide-react"
import { useState } from "react"
import { ButtonGroup } from "@/components/ui/button-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const getRenderOrder = (count: number) => {
	const order: number[] = []

	for (let i = 0; i < count; i++) {
		if (i === 0) order.push(i)      // first item
		else if (i % 2 === 1) order.push(i) // add on right side first
		else order.unshift(i)            // then add on left side
	}

	return order
}

export const Play = () => {
	const [selectedMode, setSelectedMode] = useState<typeof GAME_MODES[number]['name']>()
	const [playersAmountSelected, setPlayersAmountSelected] = useState<number>(1)
  const renderOrder = getRenderOrder(playersAmountSelected)

	return (
		<Layout className="gap-2">
			<ButtonGroup className="items-start border-b grid grid-flow-col auto-cols-fr gap-5">
				{GAME_MODES.map(mode => (
					<Button
						key={mode.name}
						className={`relative hover:no-underline border-0 flex flex-col px-0 text-xs text-foreground w-full border-b hover:border-primary ${selectedMode === mode.name ? 'border-primary' : ''}`}
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
			<ButtonGroup className="flex-1 items-center justify-center h-full w-full gap-2">
				{renderOrder.map((i) => {
					const h = 70 - Math.floor((i + 1) / 2) * 5 // 70,65,65,60,60,...

					return (
						<Button key={i} className="w-[15%] bg-foreground/15 ring-foreground/33 border-0 ring-1 hover:bg-foreground/20" style={{ height: `${h}%` }}>
							{i === 0 ? '' : '+'}
						</Button>
					)
				})}
			</ButtonGroup>
			<Outlet />
		</Layout>
	)
}