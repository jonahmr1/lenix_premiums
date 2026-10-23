import { Separator } from '@/components/ui/separator'
import { Layout } from '@/components/layout'
import { onNuiEmit } from 'lenix/nui'
import { useEffect, useState } from 'react'
import type { Common } from 'types'
import { storage } from '@lenix/lenix'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { zeroed } from '@/lib'

interface Storage {
	hudVariant: 'progress' | 'bar'
}

const hudVariants = ['health', 'armor', 'lungs'] as const

export const Hud = () => {
	const [state, setState] = useState<Common.Hud>()
	const [display, setDisplay] = useState<{ vitals: boolean; weaponary: boolean }>(
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
			onNuiEmit<Common.Events['displayHud']>('hud:display', setDisplay),
			onNuiEmit<Common.Events['updateHud']>('hud:update', setState),
		]

		return () => {
			disposes.forEach(dispose => dispose())
			storage.destroy<Storage>('hudVariant')
			// clearInterval(interval)
		}
	}, [])

	if ((!display?.vitals && !display?.weaponary) || !state) return null

	const hudVariant = storage.get<Storage, 'hudVariant'>('hudVariant')

	return (
		<>
			{/* Vitals */}
			<Layout className={`absolute bottom-0 left-0 flex gap-2.5 ${hudVariant === 'progress' && 'w-1/3'}`}>
				{hudVariants.map(variant => (
					<div key={variant} className='flex w-full items-end gap-2.5 rounded-md'>
						<div className={`relative rounded-md border border-neutral-200 bg-neutral-600/50`}>
							<div className='flex items-center justify-center *:z-1 *:p-1 *:text-neutral-100 *:drop-shadow *:drop-shadow-neutral-400/50'>
								{variant === 'health' ? (
									<FontAwesomeIcon icon={['fas', 'heart']} />
								) : variant === 'armor' ? (
									<FontAwesomeIcon icon={['fas', 'shield']} />
								) : (
									<FontAwesomeIcon icon={['fas', 'lungs']} />
								)}
							</div>
							<div
								className={`bgtext-neutral-300 absolute bottom-0 w-full rounded-b-md`}
								style={{
									height: `${state[variant]}%`,
								}}
							/>
						</div>
						{hudVariant === 'progress' && (
							<div className='flex h-5 w-full flex-col justify-end gap-px'>
								<p className='text-v-1 leading-3 text-neutral-200 text-shadow-sm'>{state[variant]}%</p>
								<div className='flex h-2/3 w-full items-center justify-center rounded-md border border-neutral-400 p-px text-neutral-300/30'>
									<div className='relative size-full overflow-hidden rounded-md bg-neutral-400/80'>
										<div
											className='h-full w-0 bg-neutral-200'
											style={{
												width: `${variant === 'health' ? state.health : state.armor}%`,
											}}
										></div>
									</div>
								</div>
							</div>
						)}
					</div>
				))}
			</Layout>
			{/* Weaponary */}
			<Layout className='h-h-15 w-w-20 gap-w-1 absolute right-0 bottom-0 flex items-start justify-end bg-radial-[at_66%] from-black/10 to-transparent to-66% pt-0 pr-10 pl-0'>
				<img src={state.weapon.image} className='w-1/4 -scale-x-100 brightness-200' />
				<div className='flex h-full w-3/4 flex-col items-end justify-between gap-2 text-neutral-300 text-shadow-md'>
					<div className='font-number flex h-1/2 w-full items-start gap-1'>
						<p
							className={`text-v-5 inline-block w-2/3 text-end leading-[0.75em] font-black ${state.weapon.clipAmmo > state.weapon.clipSize / 3 ? undefined : 'glow-sm text-red-500 text-shadow-red-500'}`}
						>
							{zeroed(state.weapon.clipAmmo, 2)}
						</p>
						<div className='flex h-full w-1/3 gap-1'>
							<Separator orientation='vertical' className='h-full bg-neutral-300' />
							<p className='leading-none'>{zeroed(state.weapon.reserveAmmo, 3)}</p>
						</div>
					</div>
					<p className='truncate px-1 font-medium italic'>{state.weapon.name}</p>
				</div>
			</Layout>
		</>
	)
}
