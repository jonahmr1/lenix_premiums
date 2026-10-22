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
	<div className='w-full min-h-1/10 flex justify-around text-muted-foreground items-center bg-card px-2 border rounded-md'>
		<div className='flex-3.5 flex gap-1.5 items-center'>
			<Badge className={`size-2 rounded-full p-0 shine-md ${DutyStates[duty_state]}`} />
			<p className='whitespace-nowrap font-normal text-v-1.5 pt-px'>{callsign}</p>
		</div>
		<div className='p-1 flex-1 flex justify-center'>
			<Separator orientation='vertical' className='h-4' />
		</div>
		<div className='flex-8 flex justify-between'>
			<p className='text-left text-v-1.5 truncate'>{name}</p>
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
			className={`absolute top-1/5 right-1/10 w-2/10 h-2/5 border flex flex-col bg-background rounded-md ${display ? 'opacity-100' : 'opacity-0'}`}
		>
			<div className='flex-1 min-h-0 px-3 pt-3 flex flex-col gap-1'>
				<div className='flex flex-col'>
					<div className='w-full flex justify-between items-center'>
						<p className='text-foreground cursor-default text-v-1.5 uppercase italic font-bold'>Active Officers</p>
						<div className='flex items-center gap-3'>
							<div>
								<Separator orientation='vertical' className='h-4' />
							</div>
							<p className='text-muted-foreground cursor-default text-v-1.5'>{entries(officers).length}</p>
						</div>
					</div>
				</div>
				<Separator />
				<div className='flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col items-center'>
					{entries(officers).length ? (
						entries(officers).map(([playerId, officer]) => <Officer key={playerId} {...officer} />)
					) : (
						<div className='h-full flex flex-col justify-center items-center gap-5'>
							<SmileySadIcon className='text-muted-foreground' size={60} />
							<p className='text-muted-foreground'>No officer found!</p>
						</div>
					)}
				</div>
			</div>
			<Separator />
			<div className='flex w-full min-w-0 p-1 gap-1 *:flex-1 *:min-w-0 *:bg-card *:text-v-1 *:border *:border-border *:text-muted-foreground'>
				<Button
					variant='secondary'
					className='rounded-md'
					onClick={handleSignin}
				>
					<FontAwesomeIcon className='text-v-1.2' icon={['fas', `right-${dutyState === 'off' ? 'to' : 'from'}-bracket`]} />
					{dutyState === 'off' ? 'Sign-in' : 'Sign-off'}
				</Button>
				<Button
					variant='secondary'
					className='rounded-md'
					onClick={handleBreak}
				>
					<FontAwesomeIcon className='text-v-1.2' icon={['fas', `${dutyState === 'break' ? 'right-to-bracket' : 'pause'}`]} />
					{dutyState === 'on'
						? 'Take Break'
						: dutyState === 'off'
							? 'Take Break'
							: 'Sign-in'}
				</Button>
				<Button
					variant='secondary'
					className='rounded-md'
					onClick={handleCallsign}
				>
					<FontAwesomeIcon className='text-fluid-1.5' icon={['far', 'id-badge']} />
					Callsign
				</Button>
			</div>
		</div>
	)
}
