import { useEffect } from 'react'
import { focusNui, onNuiEmit } from 'lenix/nui'
import type { Start } from 'types'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Pause } from './pause'
import { Settings } from './settings'
import { Hud } from './hud'
import type { FileRoutesByTo } from '@/routeTree.gen'
import { blurNui, unBlurNui } from '@/lib'
import { useStates } from '@/hooks'

const dev = false

const hudAllowedModes: {
	[K in keyof FileRoutesByTo]: K extends `/${infer Segment}/${string}`
		? Segment
		: K extends `/${infer Segment}`
			? Segment
			: K
}[keyof FileRoutesByTo][] = ['gang', 'police']

export function App() {
	const [, setStates] = useStates()
	const nav = useNavigate()
	const hash = useLocation({ select: location => location.hash })
	const path = useLocation({ select: location => location.pathname })

	useEffect(() => {
		if (dev) nav({ to: '/starting' })

		const disposes = [
			onNuiEmit<Start.Events['modeSelection']>('start:modeSelection', characters => {
				setStates(null, { start: { characters } })
				nav({ to: '/starting' })
				focusNui()
			}),
			onNuiEmit<Start.Events['pause']>('start:pause', () => {
				focusNui()
				nav({ hash: 'pause' })
			}),
		]

		return () => disposes.forEach(dispose => dispose())
	}, [])

	useEffect(() => {
		switch (hash) {
			case 'pause':
				blurNui()
				break

			case 'settings':
				blurNui()
				break

			default:
				unBlurNui()
		}
	}, [hash])

	return (
		<>
			{dev && <img src='light.png' className='pointer-events-none absolute inset-0 -z-1 size-full object-cover' />}
			{hash === 'pause' && <Pause path={path} />}
			{hash === 'settings' && <Settings />}
			{hudAllowedModes.some(route => route === path.split('/')[1]) && <Hud />}
		</>
	)
}

export default App
