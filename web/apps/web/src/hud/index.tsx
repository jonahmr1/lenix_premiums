import { DEV } from '@/App'
import { onNuiEmit } from 'lenix/nui'
import { useEffect, useState } from 'react'
import type { Outlaw } from 'types'

export const Hud = () => {
	const [state, setState] = useState<Outlaw.Events['updateHud'][1][0]>({
		clip: '-',
		reserve: '-',
	})
	const [display, setDisplay] = useState(DEV)

	useEffect(() => {
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
		<div className='absolute w-full flex justify-end p-5'>
			<div className='flex gap-1 items-end'>
				<div className='font-number text-3xl'>{state.clip}</div>
				<div className='font-number text-xl font-thin italic'>{state.reserve}</div>
			</div>
		</div>
	)
}
