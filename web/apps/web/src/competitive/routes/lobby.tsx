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
import { Play } from "../pages/play"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { Layout } from "@/components/layout"

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
			content: <Play />
		},
		{
			label: 'Arsenal',
			content: '',
			disabled: true
		},
		{
			label: 'Operator',
			content: '',
			disabled: true
		},
		{
			label: 'Battlepass',
			content: '',
			disabled: true
		},
		{
			label: 'Store',
			content: '',
			disabled: true
		},
	]

	if (!state) return null

	return <>
		<Layout type="p" className="w-full h-screen flex flex-col">
			<Tabs
				value={tab.toString()}
				onValueChange={$ => setTab(Number($))}
				className="w-full h-full"
			>
				<div className="w-full flex flex-row">
					<p className="flex flex-1 justify-center items-center font-black italic text-fluid-4">FightM</p>
					<div className="flex flex-2 items-center">
						<PreviousButton
							tabs={tabs}
							value={tab}
							onValueChange={setTab}
							variant='ghost'
						>Q</PreviousButton>
						<TabsList className="bg-transparent w-full p-0 gap-xs">
							{tabs.map((self, i) => (
								<Button
									key={i}
									disabled={self.disabled}
									variant={tab === i ? 'default' : 'outline'}
									className="flex-1 font-black text-fluid-2! font-barlow italic hover:invert"
									onClick={() => setTab(i)}
									size='lg'
								>{self.label}</Button>
							))}
						</TabsList>
						<NextButton
							tabs={tabs}
							value={tab}
							onValueChange={setTab}
							variant='ghost'
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
						className="size-full place-content-center place-items-center py-xl"
					>{tab.content}</TabsContent>
				))}
			</Tabs>
			<KbdGroup>
				<NavKbd
					icon='Esc'
					onClick={() => {
						audiobility.onMouseDown()
						nav('/')
					}}
					keybind="Escape"
				>
					Exit
				</NavKbd>
			</KbdGroup>
		</Layout>
	</>
}
