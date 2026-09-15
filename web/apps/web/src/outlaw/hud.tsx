import { DEV } from '@/App'
import { Separator } from '@workspace/ui/components/separator'
import { Layout } from '@/components/layout'
import { onNuiEmit } from 'lenix/nui'
import { useEffect, useState } from 'react'
import type { Outlaw } from 'types'
import { random, storage } from '@lenix/lenix'
import type { Storage } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
	@param length length of numbers to stop applying to; e.g. tens? hundreds? thousands? written as 1, 2, 3 ...
 */
const zeroed = (value: string | number, length: number) => String(value).padStart(length, '0')

export const Hud = () => {
	const [state, setState] = useState<Outlaw.Hud>()
	const [display, setDisplay] = useState<{ vitals: boolean, weaponary: boolean }>()
	const hudVariant = storage.get<Storage, 'hudVariant'>('hudVariant')

	useEffect(() => {
		const dispose = DEV(() => {
			setDisplay({ vitals: true, weaponary: true })

			const interval = setInterval(() => {
				setState({
					health: random(0, 100),
					armor: random(0, 100),
					lungs: random(0, 100),
					weapon: {
						name: 'Glock 17',
						image: 'https://docs-backend.fivem.net/weapons/WEAPON_CERAMICPISTOL.png',
						clipAmmo: random(0, 17),
						clipSize: 17,
						reserveAmmo: random(40, 10000)
					}
				})
			}, 1000)

			storage.set<Storage>('hudVariant', 'progress')

			return () => clearInterval(interval)
		}, 'outlaw')

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
			dispose && dispose()
		}
	}, [])

	if (!display || !state) return null

	const Bar = ({ variant }: { variant: 'health' | 'armor' | 'lungs' }) => (
		<div
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
					className={`w-full rounded-b-md absolute bottom-0 bg-light`}
					style={{
						height: `${state[variant]}%`
					}}
				/>
			</div>
			{hudVariant === 'progress' && <div className='flex flex-col justify-end w-full h-5'>
				<p className='text-fluid-1.5 leading-3 text-neutral-200 text-shadow-sm'>{state[variant]}%</p>
				<div className='w-full h-2/3 p-px border border-neutral-400 rounded-md items-center justify-center flex bg-light/30'>
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
	)

	return (
		<>
			{/* Vitals */}
			<Layout className={`absolute bottom-0 left-0 flex gap-2.5 ${hudVariant === 'progress' && 'w-1/3'}`}>
				<Bar variant='health' />
				<Bar variant='armor' />
				<Bar variant='lungs' />
			</Layout>
			{/* Weaponary */}
			<Layout className='absolute bottom-0 right-0 flex items-start justify-end gap-md bg-radial-[at_66%] from-black/10 to-transparent to-66% pr-10'>
				<img src={state.weapon.image} className='w-1/4 -scale-x-100 brightness-200' />
				<div className='flex flex-col gap-2 items-end justify-between text-white/75 text-shadow-md'>
					<div className='flex justify-between'>
						<div className='flex gap-1 items-start'>
							<p
								className={`text-fluid-6 font-number font-black inline-block leading-[0.75em] ${state.weapon.clipAmmo > state.weapon.clipSize / 2 ? undefined : state.weapon.clipAmmo <= state.weapon.clipSize / 4 ? 'text-red-500 text-shadow-red-500 glow-sm' : 'text-orange-600 text-shadow-orange-600'}`}>
								{zeroed(state.weapon.clipAmmo, 2)}
							</p>
							<Separator orientation='vertical' className='bg-white/50 h-9/10' />
							<p className='brightness-75 leading-none'>{zeroed(state.weapon.reserveAmmo, 3)}</p>
						</div>
					</div>
						<p className='truncate font-semibold italic'>{state.weapon.name}</p>
				</div>
			</Layout>
		</>			
	)
}
