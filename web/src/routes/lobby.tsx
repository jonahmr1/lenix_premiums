import { Layout } from "@/components/layout"
import { useLocation, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { common, session, user } from "@/lib/data";
import { getTheme, toggleTheme } from "@/lib/theme";
import { BarChart3, Gamepad, Moon, PlayIcon, Sun, Trophy, Users, type LucideIcon } from "lucide-react";
import { Play } from "@/pages/play"
import { Leaderboard } from "@/pages/leaderboard"
import type { BaseRoute } from "@/types"
import { useState } from "react"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { userStatuses } from "@/constants"
import { entries } from "@lenix/lenix"

const useTheme = () => getTheme()

export const Home = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()
	const theme = useTheme()
	const [isFriendsDrawerOpen, setIsFriendsDrawerOpen] = useState(false)

	const pages = [
		{
			to: '/stats',
			label: 'STATS',
			icon: BarChart3,
			element: <></>
		},
		{
			to: '/leaderboard',
			label: 'LEADERBOARD',
			icon: Trophy,
			element: <Leaderboard />
		},
		{
			to: '/',
			label: 'PLAY',
			icon: PlayIcon,
			element: <Play onOpenFriendsDrawer={() => setIsFriendsDrawerOpen(true)} />,
		},
		{
			to: '/custom',
			label: 'CUSTOM GAME',
			icon: Gamepad,
			element: <></>
		},
	] satisfies (BaseRoute & { icon: LucideIcon })[]

	const player = common.users[user.id]
	const playerStatus = userStatuses[session.users[user.id].status]

	const availableFriends = entries(session.users)
		.filter(([, userData]) => userData.status !== 'offline')
		.map(([userId, { status }]) => ({ name: common.users[userId].name, status }))

	const offlineFriends = entries(session.users)
	.filter(([, userData]) => userData.status === 'offline')
	.map(([userId, { status }]) => ({ name: common.users[userId].name, status }))

	return (
		<div className="flex flex-col h-screen">
			<div className="flex justify-between h-1/10 w-full px-[clamp(1.5rem,4vw,5rem)] border-b bg-background/10">
				<div className="flex items-center cursor-default select-none w-1/10 font-extrabold">RANKZONE</div>
				<div>
					<NavigationMenu className="h-full items-stretch">
						<div className="flex gap-10">
							{pages.map(page => {
								const isInCurrentRoute = pathname === page.to
								const Icon = page.icon

								return (
									<Button
										key={page.to}
										className={`gap-2 border-0 rounded-none h-full px-0 w-fit bg-transparent text-sm ${isInCurrentRoute ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
										variant='link'
										onClick={() => nav(page.to)}
									>
										<Icon className="size-4" />
										{page.label}
									</Button>
								)
							})}
						</div>
					</NavigationMenu>
				</div>
				<div className="flex items-center justify-end w-1/10 gap-3">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-auto gap-3 px-2 py-1 normal-case">
								<div className="relative size-9 shrink-0 rounded-full border border-primary/60 bg-white/5 p-1">
									<img src={player.avatar} alt="" className="size-full rounded-full object-cover" />
									<span className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-background ${playerStatus.className}`} />
								</div>
								<div className="cursor-default select-none text-left leading-tight">
									<div>{user.id}</div>
									<div className="text-[0.65rem] text-primary">{playerStatus.label}</div>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							{Object.entries(userStatuses).filter(([status]) => status !== 'in_game').map(([value, option]) => (
								<DropdownMenuItem
									key={value}
									onClick={() => {/* TODO */}}
								>
									<span className={`size-2 rounded-full ${option.className}`} />
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant='ghost'
						onClick={() => toggleTheme()}
					>{theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
					<Drawer direction="right" open={isFriendsDrawerOpen} onOpenChange={setIsFriendsDrawerOpen}>
						<DrawerTrigger asChild>
							<Button>
								<Users />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Friends List</DrawerTitle>
								<DrawerDescription>Invite friends or check their status.</DrawerDescription>
							</DrawerHeader>
							<div className="flex flex-col gap-2 px-4">
								{availableFriends.map(friend => (
									<div key={friend.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3">
										<div className="flex min-w-0 items-center gap-3">
											<div className="relative grid size-9 shrink-0 place-items-center rounded-full bg-white/10 font-bold text-primary">
												{friend.name.slice(0, 2).toUpperCase()}
												<span className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-background ${userStatuses[friend.status].className}`} />
											</div>
											<div className="min-w-0">
												<div className="truncate font-semibold">{friend.name}</div>
												<div className="text-[0.65rem] text-muted-foreground">{userStatuses[friend.status].label}</div>
											</div>
										</div>
										<Button size="sm" variant="ghost">
											Invite
										</Button>
									</div>
								))}
								<div className="my-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
									<div className="h-px flex-1 bg-border/50" />
									Offline Friends
									<div className="h-px flex-1 bg-border/50" />
								</div>
								{offlineFriends.map(friend => (
									<div key={friend.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 opacity-70">
										<div className="flex min-w-0 items-center gap-3">
											<div className="relative grid size-9 shrink-0 place-items-center rounded-full bg-white/10 font-bold text-muted-foreground">
												{friend.name.slice(0, 2).toUpperCase()}
												<span className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-background ${userStatuses[friend.status].className}`} />
											</div>
											<div className="min-w-0">
												<div className="truncate font-semibold">{friend.name}</div>
												<div className="text-[0.65rem] text-muted-foreground">{userStatuses[friend.status].label}</div>
											</div>
										</div>
										<Button size="sm" variant="ghost" disabled>
											Invite
										</Button>
									</div>
								))}
							</div>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
			<Layout>
				{pages.map(page => (
					<div key={page.to} className={`${pathname === page.to ? 'visible' : 'hidden'} h-full`}>
						{page.element}
					</div>
				))}
			</Layout>
		</div>
	)
}
