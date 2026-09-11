import { Button, buttonVariants } from "@workspace/ui/components/button"
import { useNavigate } from "react-router"
import { Item, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useEffect, useState } from "react"
import { audiobility, toast } from "@workspace/ui/lib/utils"
import { NavKbd } from "@/components/kbd"
import initials from 'initials'
import { onKeyDown } from "lenix/nui"

export const Lobby = () => {
	const nav = useNavigate()
	const [state, setState] = useState({
		avatar: 'https://lenix.dev/icon.png',
		name: 'Lenix',
		status: 'online',
	} as const)

	useEffect(() => {
		onKeyDown('Escape', handleExit)
	}, [])

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

	const navKbds = [
		{
			icon: 'Esc',
			label: 'Exit',
			onClick: () => handleExit()
		}
	]

	const handleExit = () => {
		audiobility.onMouseDown()
		toast('TODO')
	}

	return <>
		<div className="w-full h-screen">
			{/* header */}
			<div className="w-full h-10/100 flex items-center justify-between px-5xl bg-card">
				<div className="flex justify-center">FightM</div>
				<div className="flex justify-center items-center">
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
				<div>
					<Item
						onClick={() => toast('TODO')}
						className={`${buttonVariants({ variant: 'secondary' })} h-full`}
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
			<div className="h-83/100">
				
			</div>
			{/* footer */}
			<div className="h-7/100 bg-card flex items-center px-30">
				{navKbds.map(kbd => (
					<NavKbd
						icon={kbd.icon}
						onClick={kbd.onClick}
						disable='click'
					>
						{kbd.label}
					</NavKbd>
				))}
			</div>
		</div>
	</>
}
