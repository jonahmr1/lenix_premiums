import { useEffect, useState } from 'react'
import { Routes, Route, MemoryRouter } from 'react-router'
import { Home } from '@/ipad/routes/home'
import { Settings } from '@/ipad/routes/settings'
import { Index } from '@/ipad/pages/app'
import { storage } from '@lenix/lenix'
import type { Orientation, Storage } from '@/ipad/types'
import { apps } from './config'
import veritcalBg from '@workspace/ui/assets/ipad/portrait.jpg'
import horizontalBg from '@workspace/ui/assets/ipad/landscape.jpg'
import { DEV } from '@/App'
import { onKeyDown, onNuiEmit } from 'lenix/nui'
import type { Outlaw } from 'types'

const AppFragment = ({ appName, children }: { appName: string; children: React.ReactNode }) => (
	<div className='relative z-10 flex size-full bg-background rounded-xl overflow-hidden'>
		<Index appName={appName}>{children}</Index>
	</div>
)

export const Ipad = () => {
	const [display, setDisplay] = useState<boolean>()
	const [orientation, setOrientation] = useState<Orientation>(
		storage.get<Storage, 'orientation'>('orientation') || 'portrait',
	)
	const tabletBg = orientation === 'portrait' ? veritcalBg : horizontalBg

	useEffect(() => {
		storage.set<Storage>('orientation', orientation)
	}, [orientation])

	useEffect(() => {
		DEV(() => setDisplay(true), 'ipad')

		const disposes = [
			onNuiEmit<Outlaw.Events['displayIpad']>('ipad:display', () => setDisplay(true)),

			onKeyDown('Escape', () => setDisplay(false))
		]

		return () => disposes.forEach(dispose => dispose())
	}, [])

	if (!display) return null

	return (
		<div className='absolute-center h-full flex items-center'>
			<div
				className={`rounded-xl relative ring-10 ring-black h-8/10 w-auto ${orientation === 'portrait' ? 'aspect-3/4' : 'aspect-4/3'}`}
			>
				<div className='relative size-full overflow-hidden rounded-xl'>
					<img src={tabletBg} className='absolute size-full invert dark:invert-0'/>
					<MemoryRouter>
						<Routes>
							<Route path='/' element={<Home orientation={orientation} />} />
							<Route
								path='/settings'
								element={
									<AppFragment appName={'Settings'}>
										<Settings {...{ orientation, setOrientation }} />
									</AppFragment>
								}
							/>
							{apps.map(({ name, element: Element }) => (
								<Route
									key={name}
									path={`/${name}`}
									element={
										<AppFragment appName={name}>
											{Element ? <Element /> : <></>}
										</AppFragment>
									}
								/>
							))}
						</Routes>
					</MemoryRouter>
				</div>
			</div>
		</div>
	)
}
