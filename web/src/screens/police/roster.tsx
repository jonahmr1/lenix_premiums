import { useEffect, useState } from 'react'
import { focusNui, onNuiEmit, fetchNui } from 'lenix/nui'
import type { Police } from 'types'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SmileySadIcon, WaveformIcon } from '@phosphor-icons/react'
import { entries } from '@lenix/lenix'

const TalkStates: Record<Police.Roster.TalkState, string> = {
	on: 'text-blue-400',
	off: 'text-gray-500',
}

const DutyStates: Record<Police.Roster.DutyState, string> = {
	on: 'bg-green-500 text-green-500',
	off: 'bg-red-500 text-red-500',
	break: 'bg-orange-500 text-orange-500',
}

const Officer = ({ callsign, name, duty_state, talk_state }: Police.Roster.Officer) => (
	<div className='text-muted-foreground bg-card flex min-h-1/10 w-full items-center justify-around rounded-md border px-2'>
		<div className='flex-3.5 flex items-center gap-1.5'>
			<Badge className={`shine-md size-2 rounded-full p-0 ${DutyStates[duty_state]}`} />
			<p className='text-v-1.5 pt-px font-normal whitespace-nowrap'>{callsign}</p>
		</div>
		<div className='flex flex-1 justify-center p-1'>
			<Separator orientation='vertical' className='h-4' />
		</div>
		<div className='flex flex-8 justify-between'>
			<p className='text-v-1.5 truncate text-left'>{name}</p>
			<Badge className='hidden'>
				{/* TODO */}
				<WaveformIcon className={`${TalkStates[talk_state]}`} />
			</Badge>
		</div>
	</div>
)

export const Roster = () => {
	const [display, setDisplay] = useState<boolean>(/* true */)
	const [officers, setOfficers] = useState<Police.Roster.Officers>(
		// {
		// 	1: {
		// 		playerId: 1,
		// 		name: 'Marwan Jonah',
		// 		callsign: 'D-35',
		// 		duty_state: 'on',
		// 		talk_state: 'off'
		// 	}
		// }
	)
	const [playerId, setPlayerId] = useState<number>(/* 1 */)

	useEffect(() => {
		const disposes = [
			onNuiEmit<Police.Events['displayRoster']>('roster:display', (state, playerId) => {
				setDisplay(state)
				setPlayerId(playerId)
			}),
			onNuiEmit<Police.Events['refreshOfficers']>('roster:refreshOfficers', setOfficers),
		]

		return () => {
			disposes.forEach(dispose => dispose())
		}
	}, [])

	if (!playerId || !officers) return

	const dutyState = officers[playerId].duty_state

	const updateOfficer = (playerId: number, updates: Police.Roster.OfficerUpdates) => {
		fetchNui<Police.Requests['updateOfficer']>('roster:updateOfficer', {
			playerId,
			...updates,
		})
	}

	const handleSignin = () => {
		const state = dutyState
		if (state === 'off') return updateOfficer(playerId, { duty_state: 'on' })
		if (state === 'on') return updateOfficer(playerId, { duty_state: 'off' })

		updateOfficer(playerId, { duty_state: 'off' })
	}

	const handleBreak = () => {
		const state = dutyState
		if (state === 'off') return
		if (state === 'break') return updateOfficer(playerId, { duty_state: 'on' })

		updateOfficer(playerId, { duty_state: 'break' })
	}

	const handleCallsign = () => {
		focusNui()
		fetchNui<Police.Requests['triggerCallsign']>('roster:callsign', {})
	}

	return (
		<div
			inert={!display}
			className={`bg-background absolute top-1/5 right-1/10 flex h-2/5 w-2/10 flex-col rounded-md border ${display ? 'opacity-100' : 'opacity-0'}`}
		>
			<div className='flex min-h-0 flex-1 flex-col gap-1 px-3 pt-3'>
				<div className='flex flex-col'>
					<div className='flex w-full items-center justify-between'>
						<p className='text-foreground text-v-1.5 cursor-default font-bold uppercase italic'>Active Officers</p>
						<div className='flex items-center gap-3'>
							<div>
								<Separator orientation='vertical' className='h-4' />
							</div>
							<p className='text-muted-foreground text-v-1.5 cursor-default'>{entries(officers).length}</p>
						</div>
					</div>
				</div>
				<Separator />
				<div className='flex min-h-0 flex-1 scrollbar-none flex-col items-center overflow-y-auto'>
					{entries(officers).length ? (
						entries(officers).map(([playerId, officer]) => <Officer key={playerId} {...officer} />)
					) : (
						<div className='flex h-full flex-col items-center justify-center gap-5'>
							<SmileySadIcon className='text-muted-foreground' size={60} />
							<p className='text-muted-foreground'>No officer found!</p>
						</div>
					)}
				</div>
			</div>
			<Separator />
			<div className='*:bg-card *:text-v-1 *:border-border *:text-muted-foreground flex w-full min-w-0 gap-1 p-1 *:min-w-0 *:flex-1 *:border'>
				<Button variant='secondary' className='rounded-md' onClick={handleSignin}>
					<FontAwesomeIcon
						className='text-v-1.2'
						icon={['fas', `right-${dutyState === 'off' ? 'to' : 'from'}-bracket`]}
					/>
					{dutyState === 'off' ? 'Sign-in' : 'Sign-off'}
				</Button>
				<Button variant='secondary' className='rounded-md' onClick={handleBreak}>
					<FontAwesomeIcon
						className='text-v-1.2'
						icon={['fas', `${dutyState === 'break' ? 'right-to-bracket' : 'pause'}`]}
					/>
					{dutyState === 'on' ? 'Take Break' : dutyState === 'off' ? 'Take Break' : 'Sign-in'}
				</Button>
				<Button variant='secondary' className='rounded-md' onClick={handleCallsign}>
					<FontAwesomeIcon className='text-fluid-1.5' icon={['far', 'id-badge']} />
					Callsign
				</Button>
			</div>
		</div>
	)
}
