import {
  fetchNuiServer,
  onKeyDown,
  unFocusNui,
} from "lenix/nui"
import type { Start } from "types"
import { Fragment, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { KbdGroup } from "@/components/ui/kbd"
import { NavKbd } from "@/components/kbd"
import type { ButtonStart } from "@/types"
import { Layout } from "@/components/layout"
import { ButtonGroup } from "@/components/ui/button-group"
import { Header } from "@/components/header"
import { motion } from "motion/react"
import { anim } from "@/lib"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { useNavigate } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"

export const Pause = () => {
  const nav = useNavigate()

  const buttons: ButtonStart[] = [
    {
      label: "Resume",
      onClick: () => {
        unFocusNui()
				nav({ to: '/', hash: '' })
      },
    },
    {
      label: "Settings",
      onClick: () => {
				nav({ to: '/', hash: 'settings' })
      },
    },
    {
      label: "Leave",
      onClick: async () => {
        /* TODO: run the client logout also and not just logout */
        await fetchNuiServer<Start.Requests["logout"]>("start:logout", {})
        nav({ to: "/starting" })
      },
    },
  ]

  useEffect(() => onKeyDown("Escape", buttons[0].onClick), [])

  return (
    <motion.div
      {...anim}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Layout className="flex h-screen flex-col justify-between bg-linear-to-r from-neutral-950 to-transparent">
        <div className="gap-w-1 flex items-center">
          <div className="h-2/3 mt-h-1 w-0.5 bg-foreground" />
          <Header>Paused</Header>
        </div>
        <ButtonGroup
          orientation="vertical"
          className="h-full w-1/3 justify-center"
        >
          {buttons.map((button, i) => (
						<Fragment key={i}>
							<Button
								variant="ghost"
								onClick={() => button.onClick()}
								size="lg"
								className="group text-v-2.5! h-fit w-full justify-between px-px font-semibold tracking-wider text-neutral-300 uppercase italic"
							>
								<div className="h-full w-fu flex justify-start">
									<div className="h-full w-0.5 shrink-0 bg-foreground opacity-0 group-hover:opacity-100" />
									<span className="px-w-1.5">{button.label}</span>
								</div>
								<ArrowRightIcon className="size-v-3 mr-w-1 stroke-1 opacity-0 [:hover>&]:opacity-100" />
							</Button>
							<Separator className="last:hidden" />
						</Fragment>
          ))}
        </ButtonGroup>
        <KbdGroup className="flex w-full">
          <NavKbd
            onClick={() => buttons[0].onClick()}
            keybind="Escape"
            icon="Esc"
          >
            {buttons[0].label}
          </NavKbd>
        </KbdGroup>
      </Layout>
    </motion.div>
  )
}
