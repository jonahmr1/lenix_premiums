import bg1 from "@/assets/start/ls-1.png"
import bg2 from "@/assets/start/ls-2.png"
import bg3 from "@/assets/start/ls-3.png"
import bg4 from "@/assets/start/ls-4.png"
import { random } from "@lenix/lenix"
import { fetchNui, fetchNuiServer, unFocusNui } from "lenix/nui"
import type { Start } from "types"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/layout"
import type { ButtonStart } from "@/types"
import { useNavigate } from "@tanstack/react-router"

const backgrounds = [bg1, bg2, bg3, bg4]
const image = backgrounds[random(0, backgrounds.length - 1)]

export const Starting = () => {
  const nav = useNavigate()

  const buttons: ButtonStart[] = [
    {
      label: "Competitive",
      onClick: () => {
        fetchNui<Start.Requests["selectMode"]>("start:selectMode", {
          mode: "competitive",
        })
        // nav()
        unFocusNui()
      },
      disabled: true,
    },
    {
      label: "Outlaw",
      onClick: () => {
        fetchNui<Start.Requests["selectMode"]>("start:selectMode", {
          mode: "outlaw",
        })
        // nav('/outlaw')
        unFocusNui()
      },
    },
    {
      label: "Campaign",
      onClick: () => {},
      disabled: true,
    },
    {
      label: "Settings",
      onClick: () => {
        // nav('/settings')
      },
      styles: "mt-10",
    },
    {
      label: "Credit",
      onClick: () => nav({ to: "/starting/credit" }),
    },
    {
      label: "Quit",
      onClick: () => {
        fetchNuiServer<Start.Requests["exitGame"]>("start:exitGame", {})
      },
      styles:
        "text-red-700 hover:text-red-500 text-shadow-red-700 hover:drop-shadow-red-500/50 mt-5",
    },
  ]

  return (
    <div className="relative h-screen flex-row justify-start overflow-hidden bg-linear-to-t from-neutral-950/50 to-transparent p-0">
      <img src={image} className="absolute -z-1 size-full object-cover" />
      <div className="absolute -z-1 size-full bg-linear-to-r from-black/50 to-transparent" />
      <Layout className="relative flex size-full flex-col justify-between">
        <div className="flex h-9/10 flex-col items-start justify-center gap-5">
          {buttons.map((button, i) => (
            <Button
              key={i}
              variant="default"
              onClick={() => button.onClick()}
              disabled={button.disabled}
              className={`cursor-pointer bg-transparent text-xl text-neutral-300 uppercase drop-shadow-2xl duration-0 hover:bg-transparent hover:text-neutral-300 hover:drop-shadow-white/50 ${button.styles}`}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </Layout>
    </div>
  )
}
