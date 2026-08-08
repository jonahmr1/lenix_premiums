import { Layout } from '@workspace/elite/elements/layout'
import { useLocation, useNavigate } from 'react-router'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@workspace/elite/components/dropdown-menu'
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from '@workspace/elite/components/popover'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@workspace/ui/components/command'
import { BarChart3, Bell, Check, Inbox, Moon, PlayIcon, Plus, Sun, Trophy, Users, X } from 'lucide-react'
import { Play } from '../pages/play'
import { Leaderboard } from '../pages/leaderboard'
import { Stats } from '../pages/stats'
import type { Route } from '../types'
import { useEffect, useState } from 'react'
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from '@workspace/elite/components/drawer'
import { Button } from '@workspace/elite/components/button'
import { Badge } from '@workspace/elite/components/badge'
import { useTheme } from '@workspace/ui/hooks/theme'
import { focus, onEvent, triggerNui } from 'lenix/nui'
import type { Competitive } from 'types'
import { Loading } from '@workspace/elite/elements/loading'
import { Spinner } from '@workspace/ui/components/spinner'
import avatar from '@workspace/elite/assets/avatar.png'
import { entries } from '@lenix/lenix'
import { toast } from '@workspace/ui/lib/utils'
import { PLAYER_STATUSES } from '../constants'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'

const Notifications = ({ notifications }: {
	notifications: Competitive.Player['Notification'][]
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='ghost' size='icon' className='relative'>
					<Bell />
					{notifications.length > 0 && <Badge className='absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[0.55rem]'>
						{notifications.length}
					</Badge>}
				</Button>
			</PopoverTrigger>
			<PopoverContent align='end' className='w-[21.5rem] gap-3 border border-foreground/10 bg-popover/95 p-3'>
				<PopoverHeader>
					<PopoverTitle className='flex items-center gap-2 text-sm font-bold uppercase tracking-widest'>
						<Inbox className='size-4 text-primary' />
						Notifications
					</PopoverTitle>
				</PopoverHeader>
				<div className='max-h-80 space-y-2 overflow-y-auto'>
					{notifications.length ? (
						notifications.map(notification => (
							<div
								key={notification.id}
								className='rounded-lg border border-foreground/10 bg-foreground/[0.04] p-3'
							>
								<div className='flex min-w-0 items-center gap-3'>
									<div className='size-9 shrink-0 rounded-full bg-foreground/10 p-1'>
										<img
											src={notification.author.avatar ?? avatar}
											alt=''
											className='size-full rounded-full object-cover'
										/>
									</div>
									<div className='min-w-0'>
										<div className='truncate font-semibold'>{notification.title}</div>
										<div className='line-clamp-2 text-[0.65rem] text-muted-foreground'>
											{notification.description}
										</div>
										<div className='mt-0.5 text-[0.6rem] text-muted-foreground'>{notification.createdAt}</div>
									</div>
								</div>
								<div className='mt-3 grid grid-cols-2 gap-2'>
									<Button size='sm' className='gap-1'>
										<Check className='size-3' />
										Accept
									</Button>
									<Button size='sm' variant='ghost' className='gap-1 text-muted-foreground'>
										<X className='size-3' />
										Reject
									</Button>
								</div>
							</div>
						))
					) : (
						<div className='grid min-h-32 place-items-center rounded-lg border border-dashed border-foreground/10 bg-foreground/[0.02] p-4 text-center text-muted-foreground'>
							<div>
								<Inbox className='mx-auto mb-2 size-5 text-primary/70' />
								<div className='font-semibold'>
									Notifications from the system and party invites will show up here
								</div>
							</div>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}

const Status = ({ profile, setProfile }: {
	profile: Competitive.Player['Profile']
	setProfile: React.Dispatch<React.SetStateAction<Competitive.Player['Profile'] | undefined>>
}) => {
	const playerStatus = PLAYER_STATUSES[profile.status]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='h-auto gap-3 px-2 py-1 normal-case'>
					<div className='relative size-9 shrink-0 rounded-full border border-primary/60 bg-foreground/5 p-1'>
						<img src={profile.avatar ?? avatar} alt='' className='size-full rounded-full object-cover' />
						<span
							className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-background ${playerStatus.className}`}
						/>
					</div>
					<div className='cursor-default select-none text-left leading-tight'>
						<div>{profile.name}</div>
						<div className='text-[0.65rem] text-primary'>{playerStatus.label}</div>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-40'>
				{entries(PLAYER_STATUSES)
					.filter(([status]) => status !== 'in_game')
					.map(([value, option]) => (
						<DropdownMenuItem
							key={value}
							onClick={async () => {
								if (value === 'in_game') throw `unexpected profile status<${value}>`
								const status = await triggerNui<Competitive.Requests['setStatus']>('rank:setStatus', { status: value })
								if (!status) {
									toast('Try again later')
									return
								}
								setProfile(prev => (prev ? { ...prev, status } : prev))
							}}
						>
							<span className={`size-2 rounded-full ${option.className}`} />
							{option.label}
						</DropdownMenuItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const Friends = ({ drawer, setDrawer, friends }: {
	drawer: boolean
	setDrawer: React.Dispatch<React.SetStateAction<boolean>>
	friends: Competitive.Player['Profile'][]
}) => {
	const [open, setOpen] = useState(false)
	const [profiles, setProfiles] = useState<Competitive.Player['Profile'][]>()
	const availableFriends = friends.filter(friend => friend.status !== 'offline')
	const offlineFriends = friends.filter(friend => friend.status === 'offline')

	return (
		<Drawer direction='right' open={drawer} onOpenChange={setDrawer}>
			<DrawerTrigger asChild>
				<Button>
					<Users />
				</Button>
			</DrawerTrigger>
			<DrawerContent className='max-w-2/10'>
				<DrawerHeader>
					<div className='flex items-start justify-between gap-3'>
						<div>
							<DrawerTitle>Friends List</DrawerTitle>
							<DrawerDescription>Invite friends or check their status.</DrawerDescription>
						</div>
						<Button onClick={async () => {
							setOpen(true)
							const profiles = await triggerNui<Competitive.Requests['getProfiles']>('rank:getProfiles', {})
							setProfiles(profiles)
						}} size='sm' className='gap-2'>
							<Plus className='size-4' />
							Add Friend
						</Button>
						<CommandDialog
							open={open}
							onOpenChange={setOpen}
							className='max-w-2/10'
						>
							<Command>
								<CommandInput placeholder='Type a name...' />
								<CommandList>
									<CommandEmpty>No results found.</CommandEmpty>
									<CommandGroup heading="Players">
										{profiles ? profiles.map(profile => (
											<CommandItem
												key={profile.profile_id}
												value={profile.profile_id}
												onSelect={profile_id => {
													console.log('clicked player id:', profile_id)
												}}
											>
												<Avatar>
													<AvatarImage src={profile.avatar ?? avatar} />
													<AvatarBadge className={PLAYER_STATUSES[profile.status].className} />
												</Avatar>
												<span>{profile.name}</span>
											</CommandItem>
										)) : (
											<div className='flex min-h-28 items-center justify-center gap-2 px-4 text-sm text-muted-foreground'>
												<Spinner className='size-4' />
												Loading players...
											</div>
										)}
									</CommandGroup>
								</CommandList>
							</Command>
						</CommandDialog>
					</div>
				</DrawerHeader>
				<div className='flex flex-col gap-2 px-4'>
					{availableFriends.map(friend => (
						<div
							key={friend.name}
							className='flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/[0.04] p-3'
						>
							<div className='flex min-w-0 items-center gap-3'>
								<div className='relative size-9 shrink-0 rounded-full bg-foreground/10 p-1'>
									<img src={friend.avatar ?? avatar} alt='' className='size-full rounded-full object-cover' />
									<span
										className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-background ${PLAYER_STATUSES[friend.status].className}`}
									/>
								</div>
								<div className='min-w-0'>
									<div className='truncate font-semibold'>{friend.name}</div>
									<div className='text-[0.65rem] text-muted-foreground'>
										{PLAYER_STATUSES[friend.status].label}
									</div>
								</div>
							</div>
							<Button size='sm' variant='ghost'>
								Invite
							</Button>
						</div>
					))}
					{offlineFriends.length ? <>
						<div className='my-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground'>
							<div className='h-px flex-1 bg-border/50' />
							Offline Friends
							<div className='h-px flex-1 bg-border/50' />
						</div>
						{offlineFriends.map(friend => (
							<div
								key={friend.name}
								className='flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3 opacity-70'
							>
								<div className='flex min-w-0 items-center gap-3'>
									<div className='relative size-9 shrink-0 rounded-full bg-foreground/10 p-1'>
										<img src={friend.avatar ?? avatar} alt='' className='size-full rounded-full object-cover' />
										<span
											className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-background ${PLAYER_STATUSES[friend.status].className}`}
										/>
									</div>
									<div className='min-w-0'>
										<div className='truncate font-semibold'>{friend.name}</div>
										<div className='text-[0.65rem] text-muted-foreground'>
											{PLAYER_STATUSES[friend.status].label}
										</div>
									</div>
								</div>
								<Button size='sm' variant='ghost' disabled>
									Invite
								</Button>
							</div>
						))}
					</> : <></>}
				</div>
			</DrawerContent>
		</Drawer>
	)
}

export const Home = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()
	const { theme, toggle } = useTheme()
	const [display, setDisplay] = useState<boolean>()
	const [profile, setProfile] = useState<Competitive.Player['Profile']>()
	const [friends, setFriends] = useState<Competitive.Player['Profile'][]>()
	const [drawer, setDrawer] = useState(false)
	const [leaderboard, setLeaderboard] = useState<Competitive.Leaderboard>()
	const [notifications, _setNotifications] = useState<Competitive.Player['Notification'][]>([])
	const [stats, setStats] = useState<Competitive.Player['Stats']>()

	useEffect(() => {
		const disposes = [
			onEvent<Competitive.Events['open']>('rank:open', async () => {
				setDisplay(true)
				focus()
				setProfile(await triggerNui<Competitive.Requests['getProfile']>('rank:getProfile', {}))
				setFriends(await triggerNui<Competitive.Requests['getFriends']>('rank:getFriends', {}))
			}),
		]
		const handler = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return
			setDisplay(false)
			focus(false, false)
		}

		window.addEventListener('keydown', handler)

		return () => {
			for (const dispose of disposes) dispose()
			window.removeEventListener('keydown', handler)
		}
	}, [])

	if (!display) return
	if (!profile || !friends) return <Loading className='h-screen' />

	const pages: readonly Route[] = [
		{
			to: '/',
			label: 'PLAY',
			icon: PlayIcon,
			element: <Play
				{...{ profile, stats, leaderboard, setDrawer,
					setStats: state => {
						if (state === undefined) throw `undefined is forbidden`
						setStats(state)
					},
					setLeaderboard: state => {
						if (state === undefined) throw `undefined is forbidden`
						setLeaderboard(state)
					},
				}}
			/>,
		},
		{
			to: '/stats',
			label: 'STATS',
			icon: BarChart3,
			element: <Stats
				{...{ profile, stats }}
			/>,
		},
		{
			to: '/leaderboard',
			label: 'LEADERBOARD',
			icon: Trophy,
			element: <Leaderboard
				{...{ profile, stats, leaderboard }}
			/>,
		},
	]

	return (
		<div className='flex h-screen flex-col bg-background'>
			<div className='flex h-1/10 w-full justify-between border-b bg-background/10 px-[clamp(1.5rem,4vw,5rem)]'>
				<div className='flex w-1/10 cursor-default select-none items-center font-extrabold'>RANKZONE</div>
				<div>
					<div className='flex h-full items-center'>
						<div className='flex gap-10'>
							{pages.map(page => {
								const isInCurrentRoute = pathname === page.to
								const Icon = page.icon

								return (
									<Button
										key={page.to}
										className={`h-full w-fit gap-2 rounded-none border-0 bg-transparent px-0 text-sm ${isInCurrentRoute ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
										variant='link'
										onClick={() => nav(page.to)}
									>
										<Icon className='size-4' />
										{page.label}
									</Button>
								)
							})}
						</div>
					</div>
				</div>
				<div className='flex w-1/10 items-center justify-end gap-3'>
					<Notifications notifications={notifications} />
					<Button variant='ghost' onClick={toggle}>
						{theme === 'dark' ? <Sun /> : <Moon />}
					</Button>
					<Status {...{ profile, setProfile }} />
					<Friends {...{ drawer, setDrawer, friends }} />
				</div>
			</div>
			<Layout className='h-full'>
				{pages.map(page => (
					<div key={page.to} className={`${pathname === page.to ? 'visible' : 'hidden'} h-full w-full`}>
						{page.element}
					</div>
				))}
			</Layout>
		</div>
	)
}
