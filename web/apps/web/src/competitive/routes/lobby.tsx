import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Item, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useEffect, useState } from "react"
import { audiobility, toast } from "@workspace/ui/lib/utils"
import { NavKbd } from "@/components/kbd"
import initials from 'initials'
import { DEV } from "@/App"
import { PreviousButton, NextButton } from "@/components/nav"
import { Tabs, TabsList, TabsContent } from "@workspace/ui/components/tabs"
import type { Tab } from "@/types"
import { useNavigate } from "react-router"

export const Lobby = () => {
	const [tab, setTab] = useState(0)
	const nav = useNavigate()

	const [state, setState] = useState<{
		avatar: string,
		name: string,
	}>()

	useEffect(() => {
		DEV(() => {
			setState({
				avatar: 'https://lenix.dev/icon.png',
				name: 'Lenix',
			})
		}, 'competitive')
	}, [])

	const tabs: Tab[] = [
		{
			label: 'Play',
		},
		{
			label: 'Arsenal',
			disabled: true
		},
		{
			label: 'Operator',
			disabled: true
		},
		{
			label: 'Battlepass',
			disabled: true
		},
		{
			label: 'Store',
			disabled: true
		},
	]

	if (!state) return null

	return <>
		<div className="w-full h-screen">
			<Tabs
				value={tab.toString()}
				onValueChange={$ => setTab(Number($))}
				className="w-full h-93/100"
			>
				<div className="w-full flex flex-row h-15/100">
					<p className="flex flex-1 justify-center items-center font-black text-fluid-4">FightM</p>
					<div className="flex flex-2 items-center">
						<PreviousButton
							tabs={tabs}
							value={tab}
							onValueChange={setTab}
						>Q</PreviousButton>
						<TabsList className="bg-transparent w-full p-0 gap-xs">
							{tabs.map((self, i) => (
								<Button
									key={i}
									disabled={self.disabled}
									variant={tab === i ? 'default' : 'secondary'}
									className="flex-1 text-fluid-2!"
									onClick={() => setTab(i)}
									size='lg'
									{...audiobility}
								>{self.label}</Button>
							))}
						</TabsList>
						<NextButton
							tabs={tabs}
							value={tab}
							onValueChange={setTab}
						>
							E
						</NextButton>
					</div>
					<div className="flex flex-1 justify-center">
						<Item
							onClick={() => toast('TODO')}
							className={`${buttonVariants({ variant: 'secondary' })} h-full w-fit`}
						>
							<ItemMedia variant="icon">
								<Avatar>
									<AvatarImage src={state.avatar} />
									<AvatarFallback>{initials(state.name)}</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="text-fluid-2">{state.name}</ItemTitle>
							</ItemContent>
						</Item>
					</div>
				</div>
				{tabs.map((tab, i) => (
					<TabsContent
						key={i}
						value={i.toString()}
						className="size-full place-content-center place-items-center"
					>{tab.content ?? <p className="text-fluid-5">{tab.label}...</p>}</TabsContent>
				))}
			</Tabs>
			{/* footer */}
			<div className="h-7/100 flex items-center px-30">
				<NavKbd
					icon='Esc'
					onClick={() => {
						audiobility.onMouseDown()
						nav('/start/pause')
					}}
					keybind="Escape"
				>
					Exit
				</NavKbd>
			</div>
		</div>
	</>
}
