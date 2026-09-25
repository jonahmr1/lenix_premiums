import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { audiobility } from '@/lib'
import { PreviousButton, NextButton } from '@/components/nav'
import { Tabs, TabsList, TabsContent } from '@/components/ui/tabs'
import type { Tab } from '@/types'
import { Play } from './pages/play'
import { motion } from 'motion/react'
import { anim } from '@/lib'
import { useNavigate } from '@tanstack/react-router'
import { PageScreen } from '@/components/screen'
// import logo from '@/assets/ui/competitive/lobby/logo.png'

export const Lobby = () => {
  const [tab, setTab] = useState(0)
  const nav = useNavigate()

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
      <PageScreen
				className="flex h-screen w-full flex-col"
				kbds={[
					{
						icon: "Esc",
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
              <PreviousButton
                tabs={tabs}
                value={tab}
                onValueChange={setTab}
                variant="ghost"
              >
                Q
              </PreviousButton>
              <TabsList className="w-full gap-w-0.5 bg-transparent p-0">
                {tabs.map((self, i) => (
                  <Button
                    key={i}
                    disabled={self.disabled}
                    variant={tab === i ? 'default' : 'outline'}
                    className="flex-1 font-sans text-v-2 font-black tracking-normal italic"
                    onClick={() => setTab(i)}
                    size="lg"
                  >
                    {self.label}
                  </Button>
                ))}
              </TabsList>
              <NextButton
                tabs={tabs}
                value={tab}
                onValueChange={setTab}
                variant="ghost"
              >
                E
              </NextButton>
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
