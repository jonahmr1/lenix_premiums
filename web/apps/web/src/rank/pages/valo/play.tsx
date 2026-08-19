import { Dot, LogOut, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { game_modes } from 'config'
import { Layout } from '@workspace/ui/elements/layout'
import { Button } from '@workspace/valo/components/button'
import { ToggleGroup, ToggleGroupItem } from '@workspace/valo/components/toggle-group'
import { Badge } from '@workspace/valo/components/badge'
import { Separator } from '@workspace/ui/components/separator'
import type { Competitive } from 'types'
import avatar from '@workspace/ui/assets/rank/avatar.png'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { fetchNuiServer, onNuiEmit } from 'lenix/nui'
import { toast } from '@workspace/ui/lib/utils'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { Loading } from '@workspace/elite/elements/loading'
import { config } from '@/rank/lib'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@workspace/ui/components/context-menu'
import { FAKE_PROFILE } from '@/rank/routes/valo/lobby'
import { entries } from '@lenix/lenix'
import { DEV } from '@/App.rank'

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

export const Play = ({
	profile
}: {
	profile: Competitive.GamerProfile | undefined
}) => {
	const [party, setParty] = useState<Competitive.Party>()
	const [stats, setStats] = useState<Record<Competitive.Profile['profile_id'], Competitive.Stats>>()
	const [invitedPlayer, setInvitedPlayer] = useState<number>()
	const [searchTimer, setSeachTimer] = useState(0)

	useEffect(() => {
		if (DEV) {
			setParty({
				profiles: [FAKE_PROFILE],
				leader: 1,
				roomAvailable: 3,
				status: 'searching',
				gameMode: 'casual'
			})
			return
		}
		(async () => {
			try {
				const party = await fetchNuiServer<Competitive.Requests['getParty']>('competitive:getParty', {})
				setParty(party)
			} catch (e) {
				toast(e as string)
			}
		})()

		const disposes = [
			onNuiEmit<Competitive.Events['playerInvited']>('competitive:playerInvited', (inviter) => {
				toast('New party invite', {
					description: `${inviter.name} invited you to their party.`,
					action: {
						label: "Accept",
						onClick: async () => {
							await fetchNuiServer<Competitive.Requests['acceptInvite']>('competitive:acceptInvite', { inviter: inviter.sessionId })
						},
					},
					cancel: {
						label: `Ignore for ${config.ignore_invites_period} minutes`,
						onClick: () => {
							fetchNuiServer<Competitive.Requests['ignoreInvites']>('competitive:ignoreInvites', { inviter: inviter.sessionId })
						},
					},
					duration: config.invites_spam_period * 1000,
				})
			}),
			onNuiEmit<Competitive.Events['updateParty']>('competitive:updateParty', setParty)
		]

		return () => disposes.forEach(dispose => dispose())
	}, [])

	useEffect(() => {
		if (!party) return

		if (DEV) {
			setStats({
				1: {
					assists: 67,
					deaths: 67,
					kills: 67,
					killsDeathsRatio: 67,
					losses: 67,
					matches: 67,
					winRate: 67,
					wins: 67,
				}
			})
			return
		}

		const timeout = setTimeout(async () => {
			const newStats = await fetchNuiServer<Competitive.Requests['party']['getStats']>(
				'competitive:party:getStats', { profiles: party.profiles.map(profile => profile.profile_id) }
			)
			setStats(newStats)
		})

		return () => clearTimeout(timeout)
	}, [party?.profiles?.length])

	useEffect(() => {
		if (party?.status !== 'searching') return setSeachTimer(0)

		const interval = setInterval(() => setSeachTimer(t => t + 1), 1000)
		return () => clearInterval(interval)
	}, [party?.status])

	const partySelfProfile = party?.profiles?.find(self => self.profile_id === profile?.profile_id)
	if (!party || !partySelfProfile) return <Loading className='h-full' />

	const renderOrder = getRenderOrder(party.roomAvailable)
	const isPartyLeader = party.leader === profile?.sessionId
	const playLabel = party.status === 'found' ? 'Match Found!'
		: party.status === 'searching' ? 'Searching...'
			: isPartyLeader ? 'Search'
				: partySelfProfile.ready ? 'Ready' : 'UnReady'
	const playHoverLabel = party.status === 'found' ? 'Match Found!'
		: isPartyLeader ? party.status === 'searching' ? 'Cancel' : 'Start'
			: partySelfProfile.ready ? 'UnReady' : 'Get Ready'


	return (
		<Layout className='h-full w-full justify-between pt-2'>
			<div className='flex flex-col items-center justify-center'>
				<div className='items-start border-b grid grid-flow-col auto-cols-fr gap-10'>
					{entries(game_modes).map(([mode]) => (
						<Button
							key={mode}
							className={`relative hover:no-underline border-0 flex flex-col px-0 text-xs text-foreground w-full border-b hover:border-primary ${party.gameMode === mode ? 'border-primary' : ''}`}
							variant='link'
							onClick={() => {
								if (party.gameMode === mode) return

								fetchNuiServer<Competitive.Requests['updatePartyGameMode']>('competitive:updatePartyGameMode', { mode })
							}}
						>
							{mode}
							<Dot
								className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${party.gameMode === mode ? 'size-10 text-primary' : 'size-4 text-foreground'}`}
							/>
						</Button>
					))}
				</div>
				<div>
					<Separator orientation='vertical' className='h-5' />
				</div>
				<ToggleGroup
					className={party.gameMode ? 'opacity-100' : 'opacity-0'}
					variant='outline'
					type='single'
					value={party.roomAvailable.toString()}
					onValueChange={async value => {
						const size = Number(value)
						if (size === 0 || !isPartyLeader || size < party.profiles.length) return
						fetchNuiServer<Competitive.Requests['setPartySize']>('competitive:setPartySize', { size })
					}}
				>
					{Array.from(
						{ length: game_modes[party.gameMode].min_players_per_team || 1 },
						(_, amountOfPlayers) => (
							<ToggleGroupItem
								key={amountOfPlayers}
								value={String(amountOfPlayers + 1)}
								className={`${party.roomAvailable === amountOfPlayers + 1 ? 'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground' : ''}`}
							>
								{amountOfPlayers + 1}v{amountOfPlayers + 1}
							</ToggleGroupItem>
						),
					)}
				</ToggleGroup>
			</div>
			<div className='flex flex-10 items-center justify-center w-full gap-2 h-3/5'>
				{renderOrder.map(i => {
					const h = 80 - Math.floor((i + 1) / 2) * 5 // 80,75,75,70,70,...
					const partyProfile = party.profiles[i]
					return partyProfile ? (
						<ContextMenu
							key={i}
						>
							<ContextMenuTrigger asChild>
								<Button
									className='flex-none w-1/6 px-0 bg-foreground/5 border-foreground/33 hover:bg-foreground/10 flex-col overflow-hidden text-foreground'
									style={{ height: `${h}%` }}
								>
									<>
										<div className='flex flex-4 items-center w-full'>
											<img src={partyProfile.avatar ?? avatar} alt='' className='h-full object-cover' />
										</div>
										<div className='flex flex-2 flex-col justify-center w-full items-center gap-2'>
											<div className={`w-full flex justify-center items-center pt-0.5 text-xl tracking-tighter normal-case font-bold ${partyProfile.profile_id === profile?.profile_id ? 'bg-primary' : 'bg-muted'}`}>{partyProfile.name}</div>
											<Badge variant={partyProfile.ready ? 'default' : 'destructive'} className={`${partyProfile.ready && 'bg-green-700'} text-[0.5rem]`}>
												{partyProfile.ready ? 'Ready' : 'Not Ready'}
											</Badge>
										</div>
										<div className='flex flex-1 flex-col w-full justify-around h-full'>
											<Separator />
											<div className='flex flex-1 justify-around items-center'>
												<div className='flex-1 flex items-center flex-col'>
													{stats?.[partyProfile.profile_id] ? <p>{stats[partyProfile.profile_id].killsDeathsRatio}</p> : <Skeleton className='w-10 h-5 rounded' />}
													<p className='text-[0.475rem]'>K/D Ratio</p>
												</div>
												<Separator orientation='vertical' />
												<div className='flex-1 flex items-center flex-col'>
													{stats?.[partyProfile.profile_id] ? <p>{stats[partyProfile.profile_id].winRate}</p> : <Skeleton className='w-10 h-5 rounded' />}
													<p className='text-[0.475rem]'>Win Ratio</p>
												</div>
											</div>
										</div>
									</>
								</Button>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuItem onClick={() => {
									fetchNuiServer<Competitive.Requests['kickProfile']>('competitive:kickProfile', { profile: partyProfile.sessionId })
								}}>
									Kick
								</ContextMenuItem>
								<ContextMenuItem onClick={() => {
									fetchNuiServer<Competitive.Requests['transferLeadership']>('competitive:transferPartyLeadership', { leader: partyProfile.sessionId })
								}}>
									Make Leader
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					) : (
						<Dialog
							key={i}
						>
							<DialogTrigger
								className='flex-none w-1/6 bg-foreground/5 border-foreground/10 border hover:bg-foreground/10 flex justify-center items-center'
								style={{ height: `${h}%` }}
							>
								<Plus />
							</DialogTrigger>
							<DialogContent className='w-1/5'>
								<DialogHeader>
									<DialogTitle>Invite a player</DialogTitle>
									<DialogDescription>
										Send an invite to a player and wait for them to accept it
									</DialogDescription>
								</DialogHeader>
								<div className="flex items-center gap-2">
									<Input
										placeholder='Player ID'
										type='number'
										required
										value={invitedPlayer}
										onChange={e => setInvitedPlayer(Number(e.currentTarget.value))}
									/>
								</div>
								<DialogFooter>
									<DialogClose>
										<Button
											onClick={async () => {
												if (!invitedPlayer || invitedPlayer === profile?.sessionId) {
													toast('Invitation failed')
													return
												}
												fetchNuiServer<Competitive.Requests['invitePlayer']>('competitive:invitePlayer', { invited: invitedPlayer })
											}}
										>Send</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)
				})}
			</div>
			<div className='flex w-1/10 flex-1 flex-col items-center'>
				<Button
					className='group w-full text-xl px-25 py-5 normal-case'
					onClick={() => {
						if (party.status === 'found') return

						if (!isPartyLeader) {
							fetchNuiServer<Competitive.Requests['updateReadiness']>(
								'competitive:updateReadiness',
								{ status: !partySelfProfile.ready }
							)
							return
						}
						fetchNuiServer<Competitive.Requests['updateMatchmaking']>('competitive:updateMatchmaking', { status: party.status === 'searching' ? 'idle' : 'searching' })
					}}
				>
					<span className='group-hover:hidden'>{playLabel === 'Searching...' ? `${playLabel}` : playLabel}</span> {/* ${searchTimer}s */}
					<span className='hidden group-hover:inline'>{playHoverLabel}</span>
				</Button>
				<Separator orientation='vertical' hidden={isPartyLeader} />
				<Button
					hidden={isPartyLeader}
					variant='outline' className='justify-evenly'
					onClick={async () => {
						try {
							await fetchNuiServer<Competitive.Requests['leaveParty']>('competitive:leaveParty', {})
						} catch (e) {
							console.log(e, typeof e)
						}
					}}
				>
					<LogOut />
					Leave Lobby
				</Button>
			</div>
		</Layout>
	)
}
