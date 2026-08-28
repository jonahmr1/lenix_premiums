import { DEV } from '@/App'
import { onNuiEmit } from 'lenix/nui'
import { useEffect, useState } from 'react'
import type { Outlaw } from 'types'

/**
	@param length: length of numbers to stop applying to; e.g. tens? hundreds? thousands?
 */
const zeroed = (value: string | number, length: number) => String(value).padStart(length, '0')

export const Hud = () => {
	const [{
		clip, reserve
	}, setState] = useState<Outlaw.Events['updateHud'][1][0]>({
		clip: '-',
		reserve: '-',
	})
	const [display, setDisplay] = useState(DEV)

	useEffect(() => {
		if (DEV) {
			setState({ clip: 100, reserve: 0 })
			return
		}
		const disposes = [
			onNuiEmit<Outlaw.Events['displayHud']>('hud:display', setDisplay),
			onNuiEmit<Outlaw.Events['updateHud']>('hud:update', state =>
				setState(state),
			),
		]
		
		return () => disposes.forEach(dispose => dispose())
	}, [])

	if (!display) return null

	return (
		<div className='absolute w-full flex justify-end p-5 bg-muted'>
			<div className='flex gap-1 items-end'>
				<div className='font-number text-3xl'>
					{zeroed(clip, 2)}
				</div>
				<div className='font-number text-xl font-thin opacity-66'>
					{zeroed(reserve, 3)}
				</div>
			</div>
		</div>
	)
}
