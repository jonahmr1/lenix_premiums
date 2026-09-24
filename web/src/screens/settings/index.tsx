import { NavKbd } from "@/components/kbd"
import { Layout } from "@/components/layout"
import { NextButton, PreviousButton } from "@/components/nav"
import type { Tab } from "@/types"
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { KbdGroup } from "@/components/ui/kbd"
import { audiobility } from "@/lib"
import { useState } from "react"
import { Keybinds } from "./keybinds"
import { KeyboardMouse } from "./keyboardMouse"
import { Header } from "@/components/header"
import { motion } from "motion/react"
import { anim } from "@/lib"
import { cn } from "cn"

export const LabelItem = ({
  children,
  title,
  className,
  digest,
  ...props
}: {
  children?: React.ReactNode
  title: React.ReactNode
  className?: React.ComponentProps<typeof Item>["className"]
  digest?: true
} & React.ComponentProps<typeof Item>) => (
  <Item
    className={cn(
      "px-md text-fluid-1.5 bg-background/50 font-black tracking-normal text-foreground hover:bg-background hover:invert",
      className
    )}
    onMouseEnter={audiobility.onMouseEnter}
    {...props}
  >
    <ItemContent>
      <ItemTitle
        className={`text-fluid-2 font-bold uppercase italic ${digest && "font-black"}`}
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
    content: <p className="text-fluid-5">...</p>,
  },
  {
    label: "Graphics" /* Advanced Graphics */,
    content: <p className="text-fluid-5">...</p>,
  },
  {
    label: "Keybinds",
    content: <Keybinds />,
  },
  {
    label: "Audio" /* Voice Chat */,
    content: <p className="text-fluid-5">...</p>,
  },
  {
    label: "Interface" /* Display */,
    content: <p className="text-fluid-5">...</p>,
  },
  {
    label: "Camera",
    content: <p className="text-fluid-5">...</p>,
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
  const [visible, setVisible] = useState(false)

  if (!visible) return null

  return (
    <Layout className="gap-sm flex h-screen w-full flex-col backdrop-blur-sm">
      <motion.div
        {...anim}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Header>Settings</Header>
      </motion.div>
      <div className="*:text-fluid-2 gap-xs px-sm flex min-h-0 w-full justify-center">
        <PreviousButton tabs={tabs} value={tab} onValueChange={setTab}>
          Q
        </PreviousButton>
        <Tabs value={tab.toString()} className="flex-1">
          <TabsList className="gap-xs h-full w-full bg-transparent p-0">
            {tabs.map(({ disabled, label }, i) => (
              <Button
                key={i}
                disabled={disabled}
                variant={tab === i ? "default" : "secondary"}
                className="text-fluid-2! flex-1 font-bold italic"
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
              className="overflow-hidden"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
        <NextButton tabs={tabs} value={tab} onValueChange={setTab}>
          E
        </NextButton>
      </div>
      <KbdGroup>
        <NavKbd onClick={() => nav(-1)} icon="Esc" keybind="Escape">
          Back
        </NavKbd>
      </KbdGroup>
    </Layout>
  )
}
