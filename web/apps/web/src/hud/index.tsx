import { DEV } from '@/App'
import { Separator } from '@workspace/ui/components/separator'
import { Layout } from '@/components/layout'
import { onNuiEmit } from 'lenix/nui'
import { Heart, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Outlaw } from 'types'
import { storage } from '@lenix/lenix'
import type { Storage } from '@/types'

/**
	@param length length of numbers to stop applying to; e.g. tens? hundreds? thousands? written as 1, 2, 3 ...
 */
const zeroed = (value: string | number, length: number) => String(value).padStart(length, '0')

export const Hud = () => {
	const [state, setState] = useState<Outlaw.Hud>()
	const [display, setDisplay] = useState({ vitals: DEV('hud'), weaponary: DEV('hud') })
	const hudVariant = storage.get<Storage, 'hudVariant'>('hudVariant')

	useEffect(() => {
		if (DEV('hud')) {
			setState({
				health: 50,
				armor: 50,
				weapon: {
					name: 'Glock 17',
					image: 'https://docs-backend.fivem.net/weapons/WEAPON_CERAMICPISTOL.png',
					clipAmmo: 9,
					clipSize: 17,
					reserveAmmo: 50
				}
			})
			return
		}
		const disposes = [
			onNuiEmit<Outlaw.Events['displayHud']>('hud:display', state => {
				setDisplay(state)
			}),
			onNuiEmit<Outlaw.Events['updateHud']>('hud:update', state =>
				setState(state),
			),
		]

		return () => disposes.forEach(dispose => dispose())
	}, [])

	if (!display || !state) return null

	const Bar = ({ variant }: { variant: 'health' | 'armor' }) => (
		<div
			className='size-full rounded flex items-end gap-2.5'
		>
			<div className={`text-foreground relative rounded overflow-hidden ${variant === 'health' ? 'bg-rose-950/50 border border-rose-500' : 'bg-sky-950/50 border border-sky-500'}`}>
				<div className='relative z-20 p-2xs'>
					{variant === 'health' ? <Heart className='text-red-300' /> : <Shield className='text-sky-400' />}
				</div>
				<div
					className={`w-full absolute bottom-0 ${variant === 'health' ? 'bg-red-800' : 'bg-sky-800'}`}
					style={{
						height: `${state.health}%`
					}}
				/>
			</div>
			{hudVariant === 'progress' && <div className='size-full flex flex-col justify-end'>
				<p className='text-fluid-1.5 leading-3'>{state[variant]}%</p>
				<div className='w-full h-2/3 border border-foreground/50 rounded items-center justify-center flex bg-foreground/20'>
					<div className='w-96/100 h-2/3 bg-foreground/30 rounded-xs relative overflow-hidden'>
						<div
							className={`filled h-full transition-all rounded-xs w-0 ${variant === 'health' ? 'bg-rose-400' : 'bg-sky-400'}`}
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
		<Layout className='absolute bottom-md w-full flex-row justify-between items-end h-[10vh]'>
			<div className='flex pl-10 gap-2.5 h-1/3'>{/* w-1/3 */}
				<Bar variant='health' />
				<Bar variant='armor' />
			</div>
			<div className='flex items-start justify-end h-full gap-md bg-radial-[at_66%] from-muted/50 to-transparent to-66% pr-10 perspective-right-3'>
				<img src={state.weapon.image} className='w-1/4 -scale-x-100 brightness-200 rotate-1' />
				<div className='flex flex-col gap-2 items-end justify-between h-full w-1/2 text-white/75 text-shadow-md rotate-1'>
					<div className='flex justify-between'>
						<div className='flex gap-1 items-start'>
							<p
								className={`text-fluid-7 inline-block leading-none  ${state.weapon.clipAmmo > state.weapon.clipSize / 2 ? undefined : state.weapon.clipAmmo <= state.weapon.clipSize / 4 ? 'text-red-500 text-shadow-red-500' : 'text-orange-600 text-shadow-orange-600'}`}>
								{zeroed(state.weapon.clipAmmo, 2)}
							</p>
							<Separator orientation='vertical' className='bg-foreground/50 h-9/10' />
							<p className='brightness-75'>{zeroed(state.weapon.reserveAmmo, 3)}</p>
						</div>
					</div>
					<div>{state.weapon.name}</div>
				</div>
			</div>
		</Layout>
	)
}
