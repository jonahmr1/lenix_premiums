import { useEffect, useState } from 'react'
import { focusNui, onNuiEmit, fetchNui, onKeyDown, unFocusNui } from 'lenix/nui'
import type { Roster as IRoster, Outlaw } from 'types'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SmileySadIcon, WaveformIcon } from '@phosphor-icons/react'

const TalkStates: Record<IRoster.TalkState, string> = {
	on: 'text-blue-400',
	off: 'text-gray-500',
}

const DutyStates: Record<IRoster.DutyState, string> = {
	on: 'bg-green-500 text-green-500',
	off: 'bg-red-500 text-red-500',
	break: 'bg-orange-500 text-orange-500',
}

const Officer = ({ callsign, name, duty_state, talk_state }: IRoster.Officer) => (
	<div className='w-full min-h-1/10 flex justify-around items-center bg-card px-2 border rounded-md'>
		<div className='flex-3.5 flex gap-1.5 items-center'>
			<Badge className={`size-2 rounded-full p-0 shine-md ${DutyStates[duty_state]}`} />
			<p className='text-neutral-600 whitespace-nowrap font-extralight text-fluid-1.5 pt-px'>{callsign}</p>
		</div>
		<div className='p-1 flex-1 flex justify-center'>
			<Separator orientation='vertical' className='h-4' />
		</div>
		<div className='flex-8 flex justify-between'>
			<p className='text-neutral-600 text-left text-fluid-1.5 truncate'>{name}</p>
			<Badge className='hidden'>
				{/* TODO */}
				<WaveformIcon className={`${TalkStates[talk_state]}`} />
			</Badge>
		</div>
	</div>
)

export const Roster = () => {
	const [display, setDisplay] = useState<boolean>()
	const [officers, setOfficers] = useState<IRoster.Officers>({})
	const [playerId, setPlayerId] = useState<number>()

	useEffect(() => {
		setDisplay(true)
		setOfficers({
			1: {
				playerId: 1,
				name: 'Marwan Jonah',
				callsign: 'D-35',
				duty_state: 'on',
				talk_state: 'off'
			}
		})
		setPlayerId(1)

		const disposes = [
			onNuiEmit<Outlaw.Events['displayRoster']>('roster:display', (state, playerId) => {
				setDisplay(state)
				setPlayerId(playerId)
			}),
			onNuiEmit<Outlaw.Events['refreshOfficers']>('roster:refreshOfficers', setOfficers),
			onKeyDown('Escape', () => {
				unFocusNui()
			})
		]

		return () => {
			disposes.forEach(dispose => dispose())
		}
	}, [])

	if (!playerId) return

	const updateOfficer = (playerId: number, updates: IRoster.OfficerUpdates) => {
		fetchNui<Outlaw.Requests['updateOfficer']>('roster:updateOfficer', {
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
		fetchNui<Outlaw.Requests['triggerCallsign']>('roster:callsign', {})
	}

	if (!playerId) return

	const dutyState = officers[playerId].duty_state

	return (
		<div
			inert={!display}
			className={`absolute top-1/5 right-1/10 w-2/10 h-2/5 border flex flex-col bg-background rounded-md ${display ? 'opacity-100' : 'opacity-0'}`}
		>
			<div className='flex-1 min-h-0 px-3 pt-3 flex flex-col gap-1'>
				<div className='flex flex-col'>
					<div className='w-full flex justify-between items-center'>
						<p className='text-foreground cursor-default text-fluid-2 uppercase italic font-black'>Active Officers</p>
						<div className='flex items-center gap-3'>
							<div>
								<Separator orientation='vertical' className='h-4' />
							</div>
							<p className='text-neutral-600 cursor-default text-fluid-2'>{Object.entries(officers).length}</p>
						</div>
					</div>
				</div>
				<Separator />
				<div className='flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col items-center'>
					{Object.entries(officers).length ? (
						Object.entries(officers).map(([playerId, officer]) => <Officer key={playerId} {...officer} />)
					) : (
						<div className='h-full flex flex-col justify-center items-center gap-5'>
							<SmileySadIcon className='text-neutral-600' size={60} />
							<p className='text-neutral-600'>No officer found!</p>
						</div>
					)}
				</div>
			</div>
			<Separator />
			<div className='flex w-full min-w-0 p-1 gap-1 *:flex-1 *:min-w-0 *:bg-card *:text-[1.2vmin] *:border *:border-border *:text-neutral-600'>
				<Button
					variant='secondary'
					className='rounded-md'
					onClick={handleSignin}
				>
					<FontAwesomeIcon className='text-fluid-1.5' icon={['fas', `right-${dutyState === 'off' ? 'to' : 'from'}-bracket`]} />
					{dutyState === 'off' ? 'Sign-in' : 'Sign-off'}
				</Button>
				<Button
					variant='secondary'
					className='rounded-md'
					onClick={handleBreak}
				>
					<FontAwesomeIcon className='text-fluid-1.5' icon={['fas', `${dutyState === 'break' ? 'right-to-bracket' : 'pause'}`]} />
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
