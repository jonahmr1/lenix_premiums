import { useLocation, useNavigate } from 'react-router'
import { Moon, Sun } from 'lucide-react'
import { Play } from '@/rank/pages/valo/play'
import type { Route } from '@/rank/types'
import { Button } from '@workspace/valo/components/button'
import { Layout } from '@/components/layout'
import { useTheme } from '@workspace/ui/hooks/theme'
import { DiamondIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import type { Competitive } from 'types'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { focus, onNuiEmit, onKeyDown, unFocus, fetchNuiServer, fetchNui } from 'lenix/nui'
import { DEV } from '@/App'

export const FAKE_PROFILE = {
	name: 'Lenix',
	profile_id: '1',
	ready: true,
	sessionId: 1,
	status: 'online',
	avatar: null
} as const

export const Lobby = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()
	const { theme, toggle } = useTheme()
	const [profile, setProfile] = useState<Competitive.GamerProfile>()
	const [display, setDisplay] = useState(DEV('rank'))

	useEffect(() => {
		const disposes = [
			onNuiEmit<Competitive.Events['open']>('competitive:open', () => {
				setDisplay(true)
				focus()
			}),
			onKeyDown('Escape', () => {
				setDisplay(false)
				unFocus()
				fetchNui('competitive:unFocus', {})
			})
		]

		return () => {
			disposes.forEach(dispose => dispose())
			unFocus()
		}
	}, [])

	useEffect(() => {
		if (!display) return
		if (DEV('rank')) {
			setProfile(FAKE_PROFILE)
			return
		}
		setTimeout(async () => {
			const profile = await fetchNuiServer<Competitive.Requests['getGamerProfile']>('competitive:getGamerProfile', {})
			setProfile(profile)
		})
	}, [display])

	if (!display) return null

	const pages: Pick<Route, 'to' | 'label' | 'element'>[] = [
		{
			to: '/',
			label: 'PLAY',
			element: <Play {...{ profile }} />,
		},
	]

	return (
		<Layout className='absolute left-1/2 top-1/2 -translate-1/2 w-9/10'>
			<Layout className='bg-muted size-full rounded-md overflow-hidden justify-between'>
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
											className={`relative border-0 h-full w-full text-foreground flex tracking-widest px-15 flex-col ${isInCurrentRoute ? 'bg-gradient-to-t from-primary to-transparent border-b-2 border-foreground text-2xl' : 'text-sm'}`}
											style={isInCurrentRoute ? {
												backgroundImage: 'linear-gradient(to top, rgba(var(--primary-rgb), 1), transparent)',
											} : undefined}
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
						) : (
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
						className={`${pathname === page.to ? 'visible' : 'hidden'} h-full w-full`}
					>
						{page.element}
					</div>
				))}
			</Layout>
		</Layout>
	)
}
