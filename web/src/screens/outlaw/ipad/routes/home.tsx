import type { AppIcon, Storage } from '../types'
import { Button } from '@/components/ui/button'
import { apps } from '../config'
import { useNavigate } from '@tanstack/react-router'
import { cn } from 'cn'
import { Settings } from './settings'

const App = ({ name, styles, disabled, icon: { element: Element, styles: iconStyles } }: Omit<AppIcon, 'element'>) => {
	const nav = useNavigate()

	return (
		<div className='text-center'>
			<Button
				disabled={disabled}
				className='size-3xl! p-0 bg-transparent hover:bg-transparent rounded-[1vmin] cursor-pointer'
				onClick={() => nav({ to: `/${name.toLowerCase()}`})}
			>
				<div className={cn('size-full p-2 rounded-[1vmin]', styles)}>
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
