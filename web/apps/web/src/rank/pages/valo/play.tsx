import { Dot, LogOut, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GAME_MODES } from '@/rank/constants.valo'
import { Layout } from '@workspace/ui/elements/layout'
import { Button } from '@workspace/valo/components/button'
import { ToggleGroup, ToggleGroupItem } from '@workspace/valo/components/toggle-group'
import { Badge } from '@workspace/valo/components/badge'
import { Separator } from '@workspace/ui/components/separator'
import type { Competitive } from 'types'
import avatar from '@workspace/valo/assets/avatar.png'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { fetchNuiServer, onNuiEmit } from 'lenix/nui'
import { toast } from '@workspace/ui/lib/utils'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { Loading } from '@workspace/elite/elements/loading'
import { config } from '@/rank/lib'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@workspace/ui/components/context-menu'
import { DEV, FAKE_PROFILE } from '@/rank/routes/valo/lobby'

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
	profile: Competitive.Player['Profile'] | undefined
}) => {
	const [selectedMode, setSelectedMode] = useState<(typeof GAME_MODES)[number]['name']>('Back-To-Back')
	const [party, setParty] = useState<Competitive.Player['Party']>()
	const [stats, setStats] = useState<Record<Competitive.Player['Profile']['profile_id'], Competitive.Player['Stats']>>()
	const [invitedPlayer, setInvitedPlayer] = useState<number>()

	useEffect(() => {
		if (DEV) {
			setParty({
				profiles: [FAKE_PROFILE],
				'leader': 1,
				'roomAvailable': 1
			})
			return
		}
		(async () => {
			const party = await fetchNuiServer<Competitive.Requests['party']['get']>('competitive:party:get', {})
			setParty(party)
		})()

		const disposes = [
			onNuiEmit<Competitive.Events['playerInvited']>('competitive:playerInvited', (inviter) => {
				toast('New party invite', {
					description: `${inviter.name} invited you to their party.`,
					action: {
						label: "Accept",
						onClick: async () => {
							const newParty = await fetchNuiServer<Competitive.Requests['acceptInvite']>('competitive:acceptInvite', { inviter: inviter.sessionId })
							setParty(newParty)
						},
					},
					cancel: {
						label: `Ignore for ${config.ignoreInvitesPeriod} minutes`,
						onClick: () => {
							fetchNuiServer<Competitive.Requests['ignoreInvites']>('competitive:ignoreInvites', { inviter: inviter.sessionId })
						},
					},
					duration: config.invitesSpamPeriod * 1000,
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
					'assists': 0,
					'deaths': 0,
					'kills': 0,
					'killsDeathsRatio': 0,
					'losses': 0,
					'matches': 0,
					'winRate': 0,
					'wins': 0,
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
	}, [party?.profiles.length])

	if (!party) return <Loading className='h-full' />

	const renderOrder = getRenderOrder(party.roomAvailable)
	const partyProfile = party.profiles.find(self => self.profile_id === profile?.profile_id)
	const isPartyLeader = party.leader === profile?.sessionId
	const playStatus = partyProfile?.ready ? isPartyLeader ? 'Start' : 'Ready' : 'Get Ready'

	return (
		<Layout className='h-full w-full justify-between pt-2'>
			<div className='flex flex-col items-center justify-center'>
				<div className='items-start border-b grid grid-flow-col auto-cols-fr gap-10'>
					{GAME_MODES.map(mode => (
						<Button
							key={mode.name}
							className={`relative hover:no-underline border-0 flex flex-col px-0 text-xs text-foreground w-full border-b hover:border-primary ${selectedMode === mode.name ? 'border-primary' : ''}`}
							variant='link'
							onClick={() => (selectedMode !== mode.name && setSelectedMode(mode.name))}
						>
							{mode.name}
							<Dot
								className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${selectedMode === mode.name ? 'size-10 text-primary' : 'size-4 text-foreground'}`}
							/>
						</Button>
					))}
				</div>
				<div>
					<Separator orientation='vertical' className='h-5' />
				</div>
				<ToggleGroup
					className={selectedMode ? 'opacity-100' : 'opacity-0'}
					variant='outline'
					type='single'
					value={party.roomAvailable.toString()}
					onValueChange={async value => {
						const size = Number(value)
						if (size === 0 || !isPartyLeader || size <= party.profiles.length) return
						const updatedParty = await fetchNuiServer<Competitive.Requests['party']['setSize']>('competitive:party:setSize', { size })
						setParty(updatedParty)
					}}
				>
					{Array.from(
						{ length: GAME_MODES.find(mode => mode.name === selectedMode)?.playersPerTeam || 1 },
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
			<div className='flex flex-8 items-center justify-center w-full gap-2 h-3/5'>
				{renderOrder.map(i => {
					const h = 80 - Math.floor((i + 1) / 2) * 5 // 80,75,75,70,70,...
					const partyProfile = party.profiles[i]
					return partyProfile ? (
						<ContextMenu
							key={i}
						>
							<ContextMenuTrigger asChild>
								<Button
									className='flex-none w-1/5 px-0 bg-foreground/5 border-foreground/33 hover:bg-foreground/10 flex-col overflow-hidden text-foreground'
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

								}}>
									Kick
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					) : (
						<Dialog>
							<DialogTrigger
							className='flex-none w-1/5 bg-foreground/5 border-foreground/10 border hover:bg-foreground/10 flex justify-center items-center'
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
			<div className='flex-1 items-start'>
				<div className='grid grid-cols-[1fr_1fr_2fr_1fr_1fr] grid-rows-1 items-center'>
					<div />
					<div />
					<Button
						className='group text-xl px-20 py-5'
						onClick={() => {
							fetchNuiServer<Competitive.Requests['updateReadiness']>(
								'competitive:updateReadiness',
								{ status: playStatus === 'Ready' ? 'unready' : 'ready' }
							)
						}}
					>
						{isPartyLeader ? (
							<span>{playStatus}</span>
						) : (
							<>
								<span className='group-hover:hidden'>{playStatus === 'Get Ready' ? 'UnReady' : 'Ready'}</span>
								<span className='hidden group-hover:inline'>
									{playStatus === 'Ready' ? 'UnReady' : 'Get Ready'}
								</span>
							</>
						)}
					</Button>
					<Separator hidden={isPartyLeader} />
					<Button
						hidden={isPartyLeader}
						variant='outline' className='justify-evenly'
						onClick={async () => {
							const newParty = await fetchNuiServer<Competitive.Requests['leaveParty']>('competitive:leaveParty', {})
							setParty(newParty)
						}}
					>
						<LogOut />
						Leave Lobby
					</Button>
				</div>
			</div>
		</Layout>
	)
}
