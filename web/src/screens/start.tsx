import { fetchNuiServer } from 'lenix/nui'
import type { Start as Starting } from 'types'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout'
import type { ButtonStart } from '@/types'
import { useNavigate } from '@tanstack/react-router'

export const Start = () => {
  const nav = useNavigate()

  const buttons: ButtonStart[] = [
    {
      label: 'Multiplayer',
      onClick: () => nav({ to: '/starting/select' }),
    },
    {
      label: 'Campaign',
      onClick: () => {},
      disabled: true,
    },
    {
      label: 'Settings',
      onClick: () => {
        nav({ to: '/', hash: 'settings' })
      },
      styles: 'mt-h-5',
    },
    {
      label: 'Credit',
      onClick: () => nav({ to: '/starting/credit' }),
    },
    {
      label: 'Quit',
      onClick: () => {
        fetchNuiServer<Starting.Requests['exitGame']>('start:exitGame', {})
      },
      styles:
        'text-red-700 hover:text-red-500 text-shadow-red-700 hover:drop-shadow-red-500/50 mt-h-3',
    },
  ]

  return (
    <div className="relative h-screen flex-row justify-start overflow-hidden bg-linear-to-t from-neutral-950/50 to-transparent p-0">
      <div className="absolute -z-1 size-full bg-linear-to-r from-black/50 to-transparent" />
      <Layout className="relative flex size-full flex-col justify-between">
        <div className="flex h-9/10 flex-col items-start justify-center gap-h-2">
          {buttons.map((button, i) => (
            <Button
              key={i}
              variant="default"
              onClick={() => button.onClick()}
              disabled={button.disabled}
              className={`cursor-pointer bg-transparent text-v-2! text-muted-foreground uppercase drop-shadow-2xl duration-0 hover:bg-transparent hover:drop-shadow-white/50 ${button.styles}`}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </Layout>
    </div>
  )
}
