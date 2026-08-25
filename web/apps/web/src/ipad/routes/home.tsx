import type { AppIcon, Storage } from '@/ipad/types'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router'
import { apps } from '../constants'

const App = ({ name, styles, icon: { element: Element, styles: iconStyles } }: Omit<AppIcon, 'element'>) => {
	const nav = useNavigate()

	return (
		<div className='text-center'>
			<Button
				className='size-3xl! p-0 bg-background hover:bg-background rounded-xl cursor-pointer'
				onClick={() => nav(`/${name}`)}
			>
				<div className={cn('size-full p-2 rounded-xl', styles)}>
					<Element className={cn('size-full', iconStyles)} />
				</div>
			</Button>
			<p className='text-white text-fluid-1.5 font-bold drop-shadow-lg drop-shadow-black'>{name}</p>
		</div>
	)
}

export const Home = ({ orientation }: { orientation: Storage['orientation'] }) => {
	return (
		<div className={`relative grid size-full ${orientation === 'portrait' ? 'grid-cols-4' : 'grid-cols-6'} content-start gap-4 p-4`}>
			<App
				name='Settings'
				styles='bg-muted'
				icon={{
					element: Settings,
					styles: 'text-foreground',
				}}
			/>
			{apps.map(app => (
				<App {...app} key={app.name} />
			))}
		</div>
	)
}
