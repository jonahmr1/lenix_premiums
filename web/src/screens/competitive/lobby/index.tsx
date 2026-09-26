import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { audiobility } from '@/lib'
import { NavButton } from '@/components/nav'
import { Tabs, TabsList, TabsContent } from '@/components/ui/tabs'
import type { Tab } from '@/types'
import { Play } from '../play'
import { motion } from 'motion/react'
import { anim } from '@/lib'
import { PageScreen } from '@/components/screen'
// import logo from '@/assets/ui/competitive/lobby/logo.png'

export const Lobby = () => {
  const [tab, setTab] = useState(0)

  const tabs: Tab[] = [
    {
      label: 'Play',
      content: <Play />,
    },
    {
      label: 'Arsenal',
      content: '',
      disabled: true,
    },
    {
      label: 'Operator',
      content: '',
      disabled: true,
    },
    {
      label: 'Battlepass',
      content: '',
      disabled: true,
    },
    {
      label: 'Store',
      content: '',
      disabled: true,
    },
  ]

  return (
    <>
			<img
				src="lobby.png"
				className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
			/>
      <PageScreen
				className="flex h-screen w-full flex-col"
				kbds={[
					{
						icon: "ESC",
            onClick: () => {
              audiobility.onMouseDown()
              // nav({ to: '' })
              /* TODO */
            },
            keybind: "Escape",
						children: 'Exit'
					}
				]}
			>
        <Tabs
          value={tab.toString()}
          onValueChange={($) => setTab(Number($))}
          className="h-full w-full"
        >
          <motion.div
            className="flex w-full flex-row"
            {...anim}
            initial={{ opacity: 0, y: '-40%' }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-1 items-center justify-center">
              {/* <img src={logo} className="size-5xl" /> */}
              <p className="text-v-4 font-black italic">FightM</p>
            </div>
            <div className="flex flex-2 items-center">
							<NavButton
								type='previous'
								tabs={tabs}
                value={tab}
                onValueChange={setTab}
                variant="ghost"
								className='hover:bg-foreground!'
							>
                Q
							</NavButton>
              <TabsList className="w-full gap-w-0.5 bg-transparent p-0">
                {tabs.map((self, i) => (
                  <Button
                    key={i}
                    disabled={self.disabled}
                    variant={tab === i ? 'default' : 'outline'}
                    className="flex-1 text-v-1.5 font-bold italic uppercase"
                    onClick={() => setTab(i)}
                    size="lg"
                  >
                    {self.label}
                  </Button>
                ))}
              </TabsList>
							<NavButton
								type='next'
								tabs={tabs}
                value={tab}
                onValueChange={setTab}
                variant="ghost"
								className='hover:bg-foreground!'
							>
                E
							</NavButton>
            </div>
            <div>{/* top right side */}</div>
          </motion.div>
          {tabs.map((tab, i) => (
            <TabsContent
              key={i}
              value={i.toString()}
              className="size-full place-content-center place-items-center py-h-3"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </PageScreen>
    </>
  )
}
