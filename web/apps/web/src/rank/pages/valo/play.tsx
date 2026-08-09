import { useNavigate } from 'react-router'
import { Dot, Plus } from 'lucide-react'
import { useState } from 'react'
import { GAME_MODES, user } from '@/rank/constants.valo'
import { Layout } from '@workspace/ui/elements/layout'
import { Button } from '@workspace/valo/components/button'
import { ToggleGroup, ToggleGroupItem } from '@workspace/valo/components/toggle-group'
import { Badge } from '@workspace/valo/components/badge'
import { Separator } from '@workspace/ui/components/separator'

const getRenderOrder = (count: number) => {
	const order: number[] = []

	for (let i = 0; i < count; i++) {
		if (i === 0)
			order.push(i) // first item
		else if (i % 2 === 1)
			order.push(i) // add on right side first
		else order.unshift(i) // then add on left side
	}

	return order
}

export const Play = () => {
	const [selectedMode, setSelectedMode] = useState<(typeof GAME_MODES)[number]['name']>()
	const [playersAmountSelected, setPlayersAmountSelected] = useState<number>(1)
	const renderOrder = getRenderOrder(playersAmountSelected)
	const nav = useNavigate()

	return (
		<Layout className='h-full w-full justify-between pt-4'>
			<div className='flex flex-col items-center gap-3'>
				<div className='items-start border-b grid grid-flow-col auto-cols-fr gap-10'>
					{GAME_MODES.map(mode => (
						<Button
							key={mode.name}
							className={`relative hover:no-underline border-0 flex flex-col px-0 text-xs text-foreground w-full border-b hover:border-primary ${selectedMode === mode.name ? 'border-primary' : ''}`}
							variant='link'
							onClick={() => (selectedMode !== mode.name ? setSelectedMode(mode.name) : setSelectedMode(undefined))}
						>
							{mode.name}
							<Dot
								className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${selectedMode === mode.name ? 'size-10 text-primary' : 'size-4 text-foreground'}`}
							/>
						</Button>
					))}
				</div>
				<ToggleGroup
					className={selectedMode ? 'opacity-100' : 'opacity-0'}
					variant='outline'
					type='single'
					value={playersAmountSelected?.toString()}
					onValueChange={value =>
						Number(value) > 0 ? setPlayersAmountSelected(Number(value)) : setPlayersAmountSelected(playersAmountSelected)
					}
				>
					{Array.from(
						{ length: GAME_MODES.find(mode => mode.name === selectedMode)?.playersPerTeam || 1 },
						(_, amountOfPlayers) => (
							<ToggleGroupItem
								key={amountOfPlayers}
								value={String(amountOfPlayers + 1)}
								className={`${playersAmountSelected === amountOfPlayers + 1 ? 'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground' : ''}`}
							>
								{amountOfPlayers + 1}v{amountOfPlayers + 1}
							</ToggleGroupItem>
						),
					)}
				</ToggleGroup>
			</div>
			<div className='flex flex-8 items-center justify-center w-full gap-2 h-full'>
				{renderOrder.map(i => {
					const h = 80 - Math.floor((i + 1) / 2) * 5 // 80,75,75,70,70,...

					return (
						<Button
							key={i}
							className='w-[25%] px-0 bg-foreground/15 border-foreground/33 hover:bg-foreground/20 flex-col overflow-hidden'
							style={{ height: `${h}%` }}
						>
							{i === 0 ? (
								<>
									<div className='flex flex-1 items-start'>
										<img src={user.avatar} alt='' />
									</div>
									<div className='flex flex-1 flex-col justify-center w-full items-center'>
										<div className='w-full text-4xl tracking-tighter font-bold'>{user.name}</div>
										<Badge variant={user.isReady ? 'outline' : 'destructive'} className='text-[0.5rem]'>
											{user.isReady ? 'Ready' : 'Not Ready'}
										</Badge>
									</div>
									<div className='flex flex-1 flex-col w-full justify-around h-full'>
										<Separator />
										<div className='flex flex-1 justify-around items-center'>
											<div className='flex-1'>
												<p>{user.stats.kills}</p>
												<p className='text-[0.625rem]'>Total Kills</p>
											</div>
											<Separator orientation='vertical' />
											<div className='flex-1'>
												<p>{user.stats.deaths}</p>
												<p className='text-[0.625rem]'>Total Deaths</p>
											</div>
										</div>
										<Separator />
										<div className='flex flex-1 justify-around items-center'>
											<div className='flex-1'>
												<p>{user.stats.assits}</p>
												<p className='text-[0.625rem]'>Total Assists</p>
											</div>
											<Separator orientation='vertical' />
											<div className='flex-1'>
												<p>{((user.stats.wins / (user.stats.wins + user.stats.losses)) * 100).toFixed(1)}%</p>
												<p className='text-[0.625rem]'>Win Ratio</p>
											</div>
										</div>
									</div>
								</>
							) : (
								<Plus />
							)}
						</Button>
					)
				})}
			</div>
			<div className='flex-1 items-start'>
				<div className='grid grid-cols-[1fr_1fr_2fr_1fr_1fr] grid-rows-1 items-center'>
					<Button variant='outline'>Practive</Button>
					<Separator />
					<Button
						className='text-xl px-20 py-5'
						onClick={() => {
							nav('/in-game')
						}}
					>
						Start
					</Button>
					<Separator />
					<Button variant='outline'>Leave Lobby</Button>
				</div>
			</div>
		</Layout>
	)
}
