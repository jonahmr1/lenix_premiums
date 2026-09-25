import { useLocation, useNavigate } from "react-router"
import { Moon, Sun } from "lucide-react"
import { Play } from "@/rank/pages/valo/play"
import type { Route } from "@/rank/types"
import { Button } from "@workspace/valo/components/button"
import { useTheme } from "@workspace/ui/hooks/theme"
import { useEffect, useState } from "react"
import type { Competitive } from "types"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  focusNui,
  onNuiEmit,
  onKeyDown,
  unFocusNui,
  fetchNuiServer,
  fetchNui,
} from "lenix/nui"
import { DEV } from "@/screens"
import { Separator } from "@workspace/ui/components/separator"
import bg from "@workspace/valo/assets/bg.svg"

export const FAKE_PROFILE = {
  name: "Lenix",
  profile_id: "1",
  ready: true,
  sessionId: 1,
  status: "online",
  avatar: null,
} as const

export const Lobby = () => {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { theme, toggle } = useTheme()
  const [profile, setProfile] = useState<Competitive.GamerProfile>()
  const [display, setDisplay] = useState<boolean>()

  useEffect(() => {
    DEV(() => {
      setDisplay(true)
      setProfile(FAKE_PROFILE)
    }, "rank")

    const disposes = [
      onNuiEmit<Competitive.Events["open"]>("competitive:open", () => {
        setDisplay(true)
        focusNui()
      }),
      onKeyDown("Escape", () => {
        setDisplay(false)
        unFocusNui()
        fetchNui("competitive:unFocusNui", {})
      }),
    ]

    return () => {
      disposes.forEach((dispose) => dispose())
      unFocusNui()
    }
  }, [])

  useEffect(() => {
    if (!display) return

    setTimeout(async () => {
      const profile = await fetchNuiServer<
        Competitive.Requests["getGamerProfile"]
      >("competitive:getGamerProfile", {})
      setProfile(profile)
    })
  }, [display])

  if (!display) return null

  const pages: Pick<Route, "to" | "label" | "element">[] = [
    {
      to: "/",
      label: "PLAY",
      element: <Play {...{ profile }} />,
    },
  ]

  return (
    <div className="absolute top-1/2 left-1/2 size-9/10 -translate-1/2">
      <div className="relative isolate size-full justify-between overflow-hidden rounded bg-cover [&>div]:relative [&>div]:z-10">
        <img
          src={bg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 size-full object-cover dark:opacity-5"
        />
        <div className="flex min-h-1/15 w-full justify-between border-b px-20">
          <div className="flex w-1/10 cursor-default items-center font-extrabold select-none">
            RANKZONE
          </div>
          <div>
            <div className="h-full">
              <div className="grid h-full auto-cols-fr grid-flow-col">
                {pages.map((page) => {
                  const isInCurrentRoute = pathname === page.to
                  return (
                    <Button
                      key={page.to}
                      className={`relative flex h-full w-full flex-col rounded-none border-none px-15 tracking-widest text-foreground ring-0 ${isInCurrentRoute ? "to-cover bg-radial-[at_50%_100%] from-primary to-75% text-2xl" : "text-sm"}`}
                      variant={isInCurrentRoute ? "default" : "ghost"}
                      onClick={() => nav(page.to)}
                    >
                      {page.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex w-1/10 items-center gap-3">
            {profile ? (
              <div className="cursor-default select-none">{profile.name}</div>
            ) : (
              <Skeleton className="h-1/2 w-full rounded" />
            )}
            <Separator orientation="vertical" className="py-1" />
            <Button variant="ghost" className="rounded" onClick={toggle}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>
        </div>
        {pages.map((page) => (
          <div
            key={page.to}
            className={`${pathname === page.to ? "visible" : "hidden"} h-full w-full`}
          >
            {page.element}
          </div>
        ))}
      </div>
    </div>
  )
}
