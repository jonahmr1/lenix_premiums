import { DEV } from '@/App'
import { Separator } from '@workspace/ui/components/separator'
import { onNuiEmit } from 'lenix/nui'
import { Heart, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Outlaw } from 'types'

/**
	@param length length of numbers to stop applying to; e.g. tens? hundreds? thousands? written as 1, 2, 3 ...
 */
const zeroed = (value: string | number, length: number) => String(value).padStart(length, '0')

export const Hud = () => {
	const [state, setState] = useState<Outlaw.Hud>()
	const [display, setDisplay] = useState({ vitals: DEV, weaponary: DEV })

	useEffect(() => {
		if (DEV) {
			setState({
				health: 50,
				armor: 50,
				weapon: {
					name: 'Glock 17',
					image: 'https://docs-backend.fivem.net/weapons/WEAPON_CERAMICPISTOL.png',
					clipAmmo: 10,
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
			className='bg-foreground/20 w-full p-xs rounded flex items-center gap-2.5'
		>
			<div className={`text-foreground p-2xs rounded ${variant === 'health' ? 'bg-red-500' : 'bg-blue-950/90'}`}>
				{variant === 'health' ? <Heart className='text-ring' /> : <Shield className='text-blue-600' />}
			</div>
			<div className='w-full h-1/2 bg-foreground/30 rounded relative overflow-hidden'>
				<div
					className={`filled h-full transition-all rounded w-0 ${variant === 'health' ? 'bg-red-500' : 'bg-blue-600'}`}
					style={{
						width: `${variant === 'health' ? state.health : state.armor}%`
					}}
				>
				</div>
			</div>
		</div>
	)

	return (
		<div className='absolute size-full flex flex-col justify-end'>
			<div className='flex justify-between items-end'>
				<div className='p-5 flex gap-2.5 w-1/3'>
					<Bar variant='health' />
					<Bar variant='armor' />
				</div>
				<div className='flex justify-between bg-radial-[at_66%] from-muted/50 to-transparent to-66% p-10'>
					<img src={state.weapon.image} className='size-1/3 -scale-x-100 brightness-200' />
					<div className='flex flex-col gap-2 items-end text-foreground/75'>
						<div className='flex justify-between'>
							<div className='flex gap-1 items-start'>
								<p
									className={`text-fluid-7 leading-11 text-shadow-md ${state.weapon.clipAmmo > state.weapon.clipSize / 2 ? 'text-foreground' : state.weapon.clipAmmo <= state.weapon.clipSize / 4 ? 'text-red-500 text-shadow-red-500' : 'text-orange-600 text-shadow-orange-600'}`}>
									{zeroed(state.weapon.clipAmmo, 2)}
								</p>
								<Separator orientation='vertical' className='bg-foreground/50' />
								<p className='brightness-75'>{zeroed(state.weapon.reserveAmmo, 3)}</p>
							</div>
						</div>
						<div>{state.weapon.name}</div>
					</div>
				</div>
			</div>
		</div>
	)
}
