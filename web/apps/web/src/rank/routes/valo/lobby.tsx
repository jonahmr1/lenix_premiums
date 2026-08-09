import { useLocation, useNavigate } from 'react-router'
import { Diamond, Moon, Sun } from 'lucide-react'
import { Play } from '@/rank/pages/valo/play'
import { Leaderboard } from '@/rank/pages/valo/leaderboard'
import type { Route } from '@/rank/types'
import { Button } from '@workspace/valo/components/button'
import { user } from '@/rank/constants.valo'
import { Layout } from '@workspace/ui/elements/layout'
import { useTheme } from '@workspace/ui/hooks/theme'

const pages: Pick<Route, 'to' | 'label' | 'element'>[] = [
	{
		to: '/',
		label: 'PLAY',
		element: <Play />,
	},
	{
		to: '/leaderboard',
		label: 'LEADERBOARD',
		element: <Leaderboard />,
	},
]

export const Lobby = () => {
	const { pathname } = useLocation()
	const nav = useNavigate()
	const { theme, toggle } = useTheme()

	return (
		<Layout className='min-h-screen'>
			<Layout className='bg-muted w-8/10 rounded-md overflow-hidden'>
				<div className='flex justify-between min-h-[5vh] w-full px-20 border-b bg-background/30'>
					<div className='flex items-center cursor-default select-none w-1/10 font-extrabold'>RANKZONE</div>
					<div>
						<div className='h-full'>
							<div className='grid grid-flow-col auto-cols-fr h-full'>
								{pages.map(page => {
									const isInCurrentRoute = pathname === page.to
									return (
										<Button
											key={page.to}
											className={`relative border-0 h-full w-full text-foreground flex tracking-widest px-7 flex-col ${page.to === '/play' ? 'text-2xl' : 'text-sm'} ${isInCurrentRoute ? 'bg-gradient-to-t from-primary to-transparent border-b-2 border-foreground' : ''}`}
											variant={isInCurrentRoute ? 'default' : 'ghost'}
											onClick={() => nav(page.to)}
										>
											{page.label}
											<Diamond
												className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-foreground ${isInCurrentRoute ? 'size-3' : 'size-2'}`}
											/>
										</Button>
									)
								})}
							</div>
						</div>
					</div>
					<div className='flex items-center w-1/10 gap-3'>
						<div className=' cursor-default select-none'>{user.name}</div>
						<Button variant='ghost' onClick={toggle}>
							{theme === 'dark' ? <Sun /> : <Moon />}
						</Button>
					</div>
				</div>
				<Layout>
					{pages.map(page => (
						<div key={page.to} className={pathname === page.to ? 'visible' : 'hidden'}>
							{page.element}
						</div>
					))}
				</Layout>
			</Layout>
		</Layout>
	)
}
