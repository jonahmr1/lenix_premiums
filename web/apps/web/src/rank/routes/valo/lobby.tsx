import { useLocation, useNavigate } from 'react-router'
import { Moon, Sun } from 'lucide-react'
import { Play } from '@/rank/pages/valo/play'
import type { Route } from '@/rank/types'
import { Button } from '@workspace/valo/components/button'
import { Layout } from '@workspace/ui/elements/layout'
import { useTheme } from '@workspace/ui/hooks/theme'
import { DiamondIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import type { Competitive } from 'types'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { triggerNui } from 'lenix/nui'

export const Lobby = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()
	const { theme, toggle } = useTheme()
	const [profile, setProfile] = useState<Competitive.Player['Profile']>()

	useEffect(() => {
		(async () => {
			const profile = await triggerNui<Competitive.Requests['getProfile']>('competitive:getProfile', {})
			setProfile(profile)
		})()
		DEV: setProfile({
			name: 'Lenix',
			profile_id: '1',
			status: 'online',
			avatar: null
		})
	}, [])

	const pages: Pick<Route, 'to' | 'label' | 'element'>[] = [
		{
			to: '/',
			label: 'PLAY',
			element: <Play {...{ profile }} />,
		},
	]

	return (
		<Layout className='h-screen bg-black/50'>
			<Layout className='bg-background w-8/10 rounded-(--radius-md) overflow-hidden justify-between'>
				<div className='flex justify-between min-h-[5vh] w-full px-20 border-b'>
					<div className='flex items-center cursor-default select-none w-1/10 font-extrabold'>RANKZONE</div>
					<div>
						<div className='h-full'>
							<div className='grid grid-flow-col auto-cols-fr h-full'>
								{pages.map(page => {
									const isInCurrentRoute = pathname === page.to
									return (
										<Button
											key={page.to}
											className={`relative border-0 h-full w-full text-foreground flex tracking-widest px-15 flex-col ${page.to === '/play' ? 'text-2xl' : 'text-sm'} ${isInCurrentRoute && 'bg-gradient-to-t from-primary to-transparent border-b-2 border-foreground'}`}
											variant={isInCurrentRoute ? 'default' : 'ghost'}
											onClick={() => nav(page.to)}
										>
											{page.label}
											<DiamondIcon
												weight='fill'
												className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-foreground ${isInCurrentRoute ? 'size-3' : 'size-2'}`}
											/>
										</Button>
									)
								})}
							</div>
						</div>
					</div>
					<div className='flex items-center w-1/10 gap-3'>
						{profile ? (
							<div className=' cursor-default select-none'>{profile.name}</div>
						): (
							<Skeleton className='w-full h-1/2 rounded' />
						)}
						<Button variant='ghost' onClick={toggle}>
							{theme === 'dark' ? <Sun /> : <Moon />}
						</Button>
					</div>
				</div>
				{pages.map(page => (
					<div
						key={page.to}
						className={`${pathname === page.to ? 'visible' : 'hidden'} h-full`}
					>
						{page.element}
					</div>
				))}
			</Layout>
		</Layout>
	)
}
