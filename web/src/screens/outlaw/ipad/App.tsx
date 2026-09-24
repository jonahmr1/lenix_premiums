import { useEffect, useState } from 'react'
import { Home } from './routes/home'
import { Settings } from './routes/settings'
import { Index } from './pages/app'
import { storage } from '@lenix/lenix'
import type { Orientation, Storage } from './types'
import { apps } from './config'
import veritcalBg from '@workspace/ui/assets/ipad/portrait.jpg'
import horizontalBg from '@workspace/ui/assets/ipad/landscape.jpg'
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
		setDisplay(true)

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
				className={`rounded-[1vmin] relative ring-10 ring-black h-8/10 w-auto ${orientation === 'portrait' ? 'aspect-3/4' : 'aspect-4/3'}`}
			>
				<div className='relative size-full overflow-hidden rounded-[1vmin]'>
					<img src={tabletBg} className='absolute size-full invert dark:invert-0'/>
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
								path={`/${name.toLowerCase()}`}
								element={
									<AppFragment appName={name}>
										{Element ? <Element /> : <></>}
									</AppFragment>
								}
							/>
						))}
					</Routes>
				</div>
			</div>
		</div>
	)
}
