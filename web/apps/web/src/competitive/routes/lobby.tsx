import { Button, buttonVariants } from "@workspace/ui/components/button"
import { useLocation, useNavigate } from "react-router"
import { Item, ItemContent, ItemMedia, ItemTitle } from '@workspace/ui/components/item'
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useEffect, useState } from "react"
import { audiobility, toast } from "@workspace/ui/lib/utils"
import { NavKbd } from "@/components/kbd"
import initials from 'initials'
import { DEV } from "@/App"

export const Lobby = () => {
	const nav = useNavigate()
	const { pathname } = useLocation()

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

	const tabs = [
		{
			label: 'Play',
			to: '/lobby',
		},
		{
			label: 'Arsenal',
			to: '/',
			// disabled: true
		},
		{
			label: 'Operator',
			to: '/',
			// disabled: true
		},
		{
			label: 'Battlepass',
			to: '/',
			// disabled: true
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
			onClick: () => {
				audiobility.onMouseDown()
				toast('TODO')
			}
		}
	]

	if (!state) return null

	return <>
		<div className="w-full h-screen">
			{/* header */}
			<div className="w-full h-10/100 flex items-center justify-between px-5xl">
				<div className="flex justify-center">FightM</div>
				<div className="flex justify-center items-center gap-md">
					<p>Q</p>
					<div className="flex justify-center">
						{tabs.map((tab, i) => (
							<Button
								key={i}
								disabled={tab.disabled}
								onClick={() => nav(`/competitive${tab.to}`)}	
								variant={`/competitive${tab.to}` === pathname ? 'default' : 'secondary'}
								className="w-[15vmin]"
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
			<div className="h-7/100 flex items-center px-30">
				{navKbds.map((kbd, i) => (
					<NavKbd
						key={i}
						icon={kbd.icon}
						onClick={kbd.onClick}
						keybind="Escape"
					>
						{kbd.label}
					</NavKbd>
				))}
			</div>
		</div>
	</>
}
