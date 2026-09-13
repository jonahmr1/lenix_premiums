import type { AppIcon, Storage } from '@/ipad/types'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router'
import { apps } from '../config'

const App = ({ name, styles, disabled, icon: { element: Element, styles: iconStyles } }: Omit<AppIcon, 'element'>) => {
	const nav = useNavigate()

	return (
		<div className='text-center'>
			<Button
				disabled={disabled}
				className='size-3xl! p-0 bg-transparent hover:bg-transparent rounded-xl cursor-pointer'
				onClick={() => nav(`/${name}`)}
			>
				<div className={cn('size-full p-2 rounded-xl', styles)}>
					<Element className={cn('size-full', iconStyles)} />
				</div>
			</Button>
			<p className={`${disabled && 'opacity-50'} text-foreground text-fluid-1.5 font-bold`}>{name}</p>
		</div>
	)
}

export const Home = ({ orientation }: { orientation: Storage['orientation'] }) => {
	return (
		<div className={`relative grid size-full ${orientation === 'portrait' ? 'grid-cols-4' : 'grid-cols-6'} content-start gap-xl p-xl`}>
			<App
				name='Settings'
				styles='bg-foreground'
				icon={{
					element: Settings,
					styles: 'text-muted',
				}}
			/>
			{apps.map(app => (
				<App {...app} key={app.name} />
			))}
		</div>
	)
}
