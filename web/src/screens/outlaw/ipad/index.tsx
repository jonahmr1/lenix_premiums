import { useEffect, useState } from 'react'
import { entries, storage } from '@lenix/lenix'
import type { Orientation, Storage } from './types'
import { onKeyDown, onNuiEmit } from 'lenix/nui'
import type { Outlaw } from 'types'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@phosphor-icons/react'
import { GearIcon, HandFistIcon, SkullIcon, SprayBottleIcon, TrophyIcon } from '@phosphor-icons/react'
import { Spray } from './apps/spray'
import type { App } from './types'
import { Settings } from './apps/settings'
import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from 'cn'
import { createElement } from 'react'
import { cdn } from '@/lib'

const apps: Record<string, App> = {
  settings: {
    name: 'Settings',
    styles: 'bg-foreground',
    icon: {
      element: GearIcon,
      styles: 'text-muted',
    },
    element: Settings,
  },
  gang: {
  	name: 'Gang',
  	styles: 'bg-blue-950',
  	icon: {
  		element: SkullIcon,
  		styles: 'text-blue-500',
  	},
  	disabled: true,
  	element: () => <></>,
  },
  leaderboard: {
  	name: 'Leaderboard',
  	styles: 'bg-yellow-950',
  	icon: {
  		element: TrophyIcon,
  		styles: 'text-yellow-500',
  	},
  	disabled: true,
  	element: () => <></>,
  },
  spray: {
    name: 'Sprays War',
    styles: 'bg-red-950',
    icon: {
      element: SprayBottleIcon,
      styles: 'text-red-500',
    },
    element: Spray,
  },
  war: {
  	name: 'Gang War',
  	styles: 'bg-green-950',
  	icon: {
  		element: HandFistIcon,
  		styles: 'text-green-500',
  	},
  	disabled: true,
  	element: () => <></>,
  },
}

export const Ipad = () => {
  const [display, setDisplay] = useState<boolean>(true)
  const [orientation, setOrientation] = useState<Orientation>(storage.get<Storage, 'orientation'>('orientation') || 'portrait')
  const page = useLocation({ select: (location) => location.hash })
  const navigate = useNavigate()
	const router = useRouter()

  const tabletBg = orientation === 'portrait' ? cdn('assets/ipad/portrait.jpg') : cdn('assets/ipad/landscape.jpg')
  const nav = (app: string) => navigate({ to: '/outlaw/ipad', hash: app })

  useEffect(() => {
    storage.set<Storage>('orientation', orientation)
  }, [orientation])

  useEffect(() => {
    const disposes = [onNuiEmit<Outlaw.Events['displayIpad']>('ipad:display', () => setDisplay(true)), onKeyDown('Escape', () => setDisplay(false))]

    return () => disposes.forEach((dispose) => dispose())
  }, [])

  if (!display) return null

  return (
    <div className="absolute-center flex h-full items-center [--ipad-radius:2vmin]">
      <div className={`relative h-8/10 w-auto rounded-(--ipad-radius) overflow-hidden ring-10 ring-black ${orientation === 'portrait' ? 'aspect-3/4' : 'aspect-4/3'}`}>
				<img src={tabletBg} className="absolute size-full not-dark:invert" />
				{page === '' ? (
					<div className={`relative grid size-full ${orientation === 'portrait' ? 'grid-cols-4' : 'grid-cols-6'} gap-w-2 p-w-2 content-start`}>
						{entries(apps).map(([app, config]) => (
							<div className="text-center" key={app}>
								<Button size='icon' disabled={config.disabled} className="size-h-6 cursor-pointer rounded-(--ipad-radius) overflow-hidden bg-transparent p-0 hover:bg-transparent" onClick={() => nav(app)}>
									<div className={cn('size-full rounded-md p-2', config.styles)}>
										{createElement(config.icon.element, {
											className: cn('size-full', config.icon.styles),
										})}
									</div>
								</Button>
								<p className={`${config.disabled && 'opacity-50'} text-v-1 font-bold text-foreground`}>{config.name}</p>
							</div>
						))}
					</div>
				) : (
					<div className={`relative z-10 flex size-full overflow-hidden rounded-md bg-background`}>
						<div className="flex size-full flex-col overflow-hidden">
							<div className="flex h-6/100 w-full items-center justify-between overflow-hidden bg-card px-2">
								<div className="flex items-center gap-2">
									<Button size='icon-xs' variant="destructive" className="rounded-full" onClick={() => nav('')}>
										<XIcon className="size-v-1.5" weight='bold' />
									</Button>
									<ButtonGroup className='**:size-v-2'>
										<Button size='icon' variant="secondary" onClick={() => router.history.back()}>
											<ArrowLeftIcon />
										</Button>
										<Button size='icon' variant="secondary" disabled>
											<ArrowRightIcon />
										</Button>
									</ButtonGroup>
								</div>
								<div>
									<p className="text-v-1.5 font-normal text-muted-foreground">{apps[page].name}</p>
								</div>
							</div>
							<Separator className="bg-muted-foreground" />
							<div className="size-full overflow-hidden bg-card">
								<div className="relative flex size-full items-center">
									{createElement(apps[page].element, {
										orientation: orientation,
										setOrientation: setOrientation,
									})}
								</div>
							</div>
						</div>
					</div>
				)}
      </div>
    </div>
  )
}
