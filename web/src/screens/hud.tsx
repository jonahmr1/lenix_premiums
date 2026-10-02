import { Separator } from '@/components/ui/separator'
import { Layout } from '@/components/layout'
import { onNuiEmit } from 'lenix/nui'
import { useEffect, useState } from 'react'
import type { Outlaw } from 'types'
import { random, storage } from '@lenix/lenix'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { zeroed } from '@/lib'

interface Storage {
	hudVariant: 'progress' | 'bar'
}

const hudVariants = ['health', 'armor', 'lungs'] as const

export const Hud = () => {
	const [state, setState] = useState<Outlaw.Hud>()
	const [display, setDisplay] = useState<{ vitals: boolean, weaponary: boolean }>(
		// { vitals: true, weaponary: true }
	)

	useEffect(() => {
		// const interval = setInterval(() => {
		// 	setState({
		// 		health: random(0, 100),
		// 		armor: random(0, 100),
		// 		lungs: random(0, 100),
		// 		weapon: {
		// 			name: 'Glock 17',
		// 			image: 'https://docs-backend.fivem.net/weapons/WEAPON_CERAMICPISTOL.png',
		// 			clipAmmo: random(0, 17),
		// 			clipSize: 17,
		// 			reserveAmmo: random(40, 10000)
		// 		}
		// 	})
		// }, 1000)

		storage.set<Storage>('hudVariant', 'progress')

		const disposes = [
			onNuiEmit<Outlaw.Events['displayHud']>('hud:display', state => {
				setDisplay(state)
			}),
			onNuiEmit<Outlaw.Events['updateHud']>('hud:update', state =>
				setState(state),
			),
		]

		return () => {
			disposes.forEach(dispose => dispose())
			storage.destroy<Storage>('hudVariant')
			// clearInterval(interval)
		}
	}, [])

	if (!display || !state) return null

	const hudVariant = storage.get<Storage, 'hudVariant'>('hudVariant')

	return (
		<>
			{/* Vitals */}
			<Layout className={`absolute bottom-0 left-0 flex gap-2.5 ${hudVariant === 'progress' && 'w-1/3'}`}>
				{hudVariants.map(variant => (
					<div
						key={variant}
						className='w-full rounded-md flex items-end gap-2.5'
					>
						<div className={`relative rounded-md bg-neutral-600/50 border border-neutral-200`}>
							<div className='flex items-center justify-center *:z-1 *:p-1 *:text-neutral-100 *:drop-shadow *:drop-shadow-neutral-400/50'>
								{variant === 'health'
								? <FontAwesomeIcon icon={['fas', 'heart']} />
								: variant === 'armor'
								? <FontAwesomeIcon icon={['fas', 'shield']} />
								: <FontAwesomeIcon icon={['fas', 'lungs']} />}
							</div>
							<div
								className={`w-full rounded-b-md absolute bottom-0 bgtext-neutral-300`}
								style={{
									height: `${state[variant]}%`
								}}
							/>
						</div>
						{hudVariant === 'progress' && <div className='flex flex-col justify-end w-full h-5 gap-px'>
							<p className='text-v-1 leading-3 text-neutral-200 text-shadow-sm'>{state[variant]}%</p>
							<div className='w-full h-2/3 p-px border border-neutral-400 rounded-md items-center justify-center flex text-neutral-300/30'>
								<div className='size-full bg-neutral-400/80 rounded-md relative overflow-hidden'>
									<div
										className='h-full w-0 bg-neutral-200'
										style={{
											width: `${variant === 'health' ? state.health : state.armor}%`
										}}
									>
									</div>
								</div>
							</div>
						</div>}
					</div>
				))}
			</Layout>
			{/* Weaponary */}
			<Layout className='absolute bottom-0 right-0 w-w-20 h-h-15 flex pt-0 pl-0 items-start justify-end gap-w-1 bg-radial-[at_66%] from-black/10 to-transparent to-66% pr-10'>
				<img src={state.weapon.image} className='w-1/4 -scale-x-100 brightness-200' />
				<div className='flex flex-col gap-2 h-full items-end w-3/4 justify-between text-neutral-300 text-shadow-md'>
					<div className='w-full h-1/2 flex gap-1 items-start font-number'>
						<p
							className={`text-v-5 w-2/3 text-end font-black inline-block leading-[0.75em] ${state.weapon.clipAmmo > state.weapon.clipSize / 3 ? undefined : 'text-red-500 text-shadow-red-500 glow-sm'}`}>
							{zeroed(state.weapon.clipAmmo, 2)}
						</p>
						<div className='flex h-full gap-1 w-1/3'>
							<Separator orientation='vertical' className='bg-neutral-300 h-full' />
							<p className='leading-none'>{zeroed(state.weapon.reserveAmmo, 3)}</p>
						</div>
					</div>
					<p className='truncate font-semibold italic px-1'>{state.weapon.name}</p>
				</div>
			</Layout>
		</>			
	)
}
