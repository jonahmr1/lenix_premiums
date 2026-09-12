import { useLocation, useNavigate } from 'react-router'
import { Moon, Sun } from 'lucide-react'
import { Play } from '@/rank/pages/valo/play'
import type { Route } from '@/rank/types'
import { Button } from '@workspace/valo/components/button'
import { Layout } from '@/components/layout'
import { useTheme } from '@workspace/ui/hooks/theme'
import { useEffect, useState } from 'react'
import type { Competitive } from 'types'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { focus, onNuiEmit, onKeyDown, unFocus, fetchNuiServer, fetchNui } from 'lenix/nui'
import { DEV } from '@/App'
import { Separator } from '@workspace/ui/components/separator'
import bg from '@workspace/valo/assets/bg.svg'

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
	const [display, setDisplay] = useState<boolean>()

	useEffect(() => {
		DEV(() => {
			setDisplay(true)
			setProfile(FAKE_PROFILE)
		}, 'rank')
		
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
		<div className='absolute left-1/2 top-1/2 -translate-1/2 size-9/10'>
			<div
				className='
					relative
					isolate
					size-full
					rounded
					overflow-hidden
					justify-between
					[&>div]:relative
					[&>div]:z-10
					bg-cover
				'
			>
				<img
					src={bg}
					alt=''
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 z-0 size-full object-cover dark:opacity-5'
				/>
				<div className='flex justify-between min-h-1/15 w-full px-20 border-b'>
					<div className='flex items-center cursor-default select-none w-1/10 font-extrabold'>RANKZONE</div>
					<div>
						<div className='h-full'>
							<div className='grid grid-flow-col auto-cols-fr h-full'>
								{pages.map(page => {
									const isInCurrentRoute = pathname === page.to
									return (
										<Button
											key={page.to}
											className={`relative h-full ring-0 w-full rounded-none text-foreground border-none flex tracking-widest px-15 flex-col ${isInCurrentRoute ? 'bg-radial-[at_50%_100%] from-primary to-cover to-75% text-2xl' : 'text-sm'}`}
											variant={isInCurrentRoute ? 'default' : 'ghost'}
											onClick={() => nav(page.to)}
										>
											{page.label}
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
						<Separator orientation='vertical' className='py-1' />
						<Button
							variant='ghost'
							className='rounded'
							onClick={toggle}
						>
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
			</div>
		</div>
	)
}
