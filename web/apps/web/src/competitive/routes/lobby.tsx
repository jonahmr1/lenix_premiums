import { Button, buttonVariants } from "@workspace/ui/components/button"
import { useNavigate } from "react-router"
import { Item, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useState } from "react"
import { toast } from "@workspace/ui/lib/utils"

export const Lobby = () => {
	const nav = useNavigate()
	const [state, setState] = useState({
		avatar: 'https://lenix.dev/icon.png',
		name: 'Lenix',
		status: 'online'
	} as const)

	const tabs = [
		{
			label: 'Play',
			to: '/',
		},
		{
			label: 'Arsenal',
			to: '/',
			disabled: true
		},
		{
			label: 'Operator',
			to: '/',
			disabled: true
		},
		{
			label: 'Battlepass',
			to: '/',
			disabled: true
		},
		{
			label: 'Store',
			to: '/',
			disabled: true
		},
	]

	return <>
		<div className="w-full h-screen">
			<div className="w-full h-1/10 flex items-center bg-card">
				<div className="w-1/5 flex justify-center">FightM</div>
				<div className="w-3/5 flex justify-center items-center">
					<p>Q</p>
					<div className="flex justify-center">
						{tabs.map(tab => (
							<Button
								disabled={tab.disabled}
								onClick={() => nav(tab.to)}	
							>{tab.label}</Button>
						))}
					</div>
					<p>E</p>
				</div>
				<div className="w-1/5">
					<Item
						onClick={() => toast('Test')}
						className={`${buttonVariants({ variant: 'secondary' })} h-full`}
					>
						<ItemMedia variant="icon">
						<Avatar>
							<AvatarImage src={state.avatar} />
							<AvatarFallback>{'TODO'}</AvatarFallback>
						</Avatar>
						</ItemMedia>
						<ItemContent>
							<ItemTitle className="text-fluid-2">{state.name}</ItemTitle>
						</ItemContent>
					</Item>
				</div>
			</div>
			<div></div>
			<div></div>
		</div>
	</>
}
