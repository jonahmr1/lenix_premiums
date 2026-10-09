import { useEffect } from 'react'
import { focusNui, onNuiEmit } from 'lenix/nui'
import type { Start } from 'types'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Pause } from './pause'
import { Settings } from './settings'
import { Hud } from './hud'
import type { FileRoutesByTo } from '@/routeTree.gen'
import { blurNui, unBlurNui } from '@/lib'

const dev = false

const hudAllowedModes: {
  [K in keyof FileRoutesByTo]: K extends `/${infer Segment}/${string}` ? Segment : K extends `/${infer Segment}` ? Segment : K
}[keyof FileRoutesByTo][] = ['gang', 'police']

export function App() {
  const nav = useNavigate()
  const hash = useLocation({ select: (location) => location.hash })
  const path = useLocation({ select: (location) => location.pathname })
  const rootHash = path === '/' && hash

  useEffect(() => {
    if (dev) nav({ to: '/starting' })

    const disposes = [
      onNuiEmit<Start.Events['modeSelection']>('start:modeSelection', () => {
        nav({ to: '/starting' })
        focusNui()
      }),
      onNuiEmit<Start.Events['pause']>('start:pause', () => {
        focusNui()
        nav({ to: '/', hash: 'pause', replace: true })
      }),
    ]

    return () => disposes.forEach((dispose) => dispose())
  }, [])

  useEffect(() => {
    if (rootHash === 'pause') blurNui()
    else if (rootHash === 'settings') blurNui()
    else unBlurNui()
  }, [rootHash])

  return (
    <>
      {dev && <img src="light.png" className="pointer-events-none absolute inset-0 -z-1 size-full object-cover" />}
      {rootHash === 'pause' && <Pause />}
      {rootHash === 'settings' && <Settings />}
      {hudAllowedModes.some((route) => route === path.split('/')[1]) && <Hud />}
    </>
  )
}

export default App
