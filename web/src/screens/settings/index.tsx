import { NextButton, PreviousButton } from "@/components/nav"
import type { Tab } from "@/types"
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { audiobility } from "@/lib"
import { useState } from "react"
import { Keybinds } from "./keybinds"
import { KeyboardMouse } from "./keyboardMouse"
import { Header } from "@/components/header"
import { motion } from "motion/react"
import { anim } from "@/lib"
import { cn } from "cn"
import { useRouter } from "@tanstack/react-router"
import { PageScreen } from "@/components/screen"

export const LabelItem = ({
  children,
  title,
  className,
  ...props
}: {
  children?: React.ReactNode
  title: React.ReactNode
  className?: React.ComponentProps<typeof Item>["className"]
  digest?: true
} & React.ComponentProps<typeof Item>) => (
  <Item
    className={cn(
      "px-w-1 bg-background/50 text-foreground hover:bg-background italic hover:invert group",
      className
    )}
    onMouseEnter={audiobility.onMouseEnter}
    {...props}
  >
    <ItemContent>
      <ItemTitle
        className='text-v-1.25 uppercase font-bold'
      >
        {title}
      </ItemTitle>
    </ItemContent>
    <ItemActions>{children}</ItemActions>
  </Item>
)

const tabs: Tab[] = [
  {
    label: "General",
    content: <div className="size-full flex items-center justify-center text-v-4">General Soon...</div>,
  },
  {
    label: "Graphics" /* Advanced Graphics */,
    content: <div className="size-full flex items-center justify-center text-v-4">Graphics Soon...</div>,
  },
  {
    label: "Keybinds",
    content: <Keybinds />,
  },
  {
    label: "Audio" /* Voice Chat */,
    content: <div className="size-full flex items-center justify-center text-v-4">Audio Soon...</div>,
  },
  {
    label: "Interface" /* Display */,
    content: <div className="size-full flex items-center justify-center text-v-4">Display Soon...</div>,
  },
  {
    label: "Camera",
    content: <div className="size-full flex items-center justify-center text-v-4">Display Soon...</div>,
  },
  {
    label: "Keyboard / Mouse",
    content: <KeyboardMouse />,
  },
  {
    label: "Gamepad",
    content: "",
    disabled: true,
  },
  {
    label: "Brief",
    content: "",
    disabled: true,
  },
  {
    label: "Stats",
    content: "",
    disabled: true,
  },
  {
    label: "Gallery",
    content: "",
    disabled: true,
  },
  {
    label: "Editor",
    content: "",
    disabled: true,
  },
]

export const Settings = () => {
  const [tab, setTab] = useState(2)
	const router = useRouter()

  return (
    <PageScreen
			className="gap-h-1 flex h-screen w-full flex-col backdrop-blur-sm"
			kbds={[
				{
					onClick: () => router.history.back(),
					icon: "ESC",
					keybind: "Escape",
					children: 'Back'
				}
			]}
		>
      <motion.div
        {...anim}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Header>Settings</Header>
      </motion.div>
      <div className="*:text-v-2 gap-w-0.5 flex min-h-0 size-full justify-center">
        <PreviousButton tabs={tabs} value={tab} onValueChange={setTab}>
          Q
        </PreviousButton>
        <Tabs value={tab.toString()} className="flex-1 size-full">
          <TabsList className="gap-w-0.5 h-full w-full bg-transparent p-0">
            {tabs.map(({ disabled, label }, i) => (
              <Button
                key={i}
                disabled={disabled}
                variant={tab === i ? "default" : "secondary"}
                className="text-v-1.4 flex-1 font-bold italic uppercase"
                onClick={() => setTab(i)}
                size="lg"
              >
                {label}
              </Button>
            ))}
          </TabsList>
          {tabs.map((tab, i) => (
            <TabsContent
              key={i}
              value={i.toString()}
              className="overflow-hidden size-full"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
        <NextButton tabs={tabs} value={tab} onValueChange={setTab}>
          E
        </NextButton>
      </div>
    </PageScreen>
  )
}
