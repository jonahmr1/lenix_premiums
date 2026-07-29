import {
  IconBrandDiscord,
  IconBuildingBank,
  IconFolder,
  IconMail,
  IconMap2,
  IconMessageCircle,
  IconSettings,
  IconShieldLock,
  IconTerminal2,
  IconUserSearch,
} from "@tabler/icons-react"
import ped from "./assets/ped.png"

const desktopConfig = {
  title: "LNX Laptop",
  status: "Connected",
  user: "Guest",
  apps: [
    { label: "Messages", icon: IconMessageCircle, accent: "bg-cyan-500" },
    { label: "Mail", icon: IconMail, accent: "bg-sky-500" },
    { label: "Files", icon: IconFolder, accent: "bg-amber-500" },
    { label: "Maps", icon: IconMap2, accent: "bg-emerald-500" },
    { label: "Records", icon: IconUserSearch, accent: "bg-violet-500" },
    { label: "Bank", icon: IconBuildingBank, accent: "bg-lime-500" },
    { label: "Comms", icon: IconBrandDiscord, accent: "bg-indigo-500" },
    { label: "Security", icon: IconShieldLock, accent: "bg-rose-500" },
    { label: "Terminal", icon: IconTerminal2, accent: "bg-zinc-700" },
    { label: "Settings", icon: IconSettings, accent: "bg-neutral-500" },
  ],
}

function App() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-black text-white">
      <img
        src={ped}
        alt=""
        className="fixed inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-black/35" />

      <main className="relative z-10 flex min-h-svh items-center justify-center p-4 sm:p-8">
        <section className="w-full max-w-5xl">
          <div className="rounded-[2rem] border border-white/15 bg-zinc-950 p-3 shadow-2xl shadow-black/60 sm:p-4">
            <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950">
              <div className="flex h-[min(72svh,42rem)] min-h-[30rem] flex-col bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,.2),transparent_32%),linear-gradient(135deg,rgba(15,23,42,.95),rgba(24,24,27,.95)_58%,rgba(3,7,18,.97))]">
                <header className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-black/25 px-4 text-xs text-white/75">
                  <span>{desktopConfig.title}</span>
                  <div className="flex items-center gap-3">
                    <span>{desktopConfig.status}</span>
                    <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </header>

                <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] content-start gap-5 overflow-auto p-5 sm:grid-cols-[repeat(5,5.5rem)] sm:p-7">
                  {desktopConfig.apps.map((app) => {
                    const Icon = app.icon

                    return (
                      <button
                        key={app.label}
                        className="group flex h-24 w-20 flex-col items-center justify-start gap-2 rounded-md p-2 text-center transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
                        type="button"
                      >
                        <span
                          className={`flex size-12 items-center justify-center rounded-xl ${app.accent} shadow-lg shadow-black/30 ring-1 ring-white/20`}
                        >
                          <Icon className="size-7" stroke={1.8} />
                        </span>
                        <span className="w-full text-xs leading-tight text-white drop-shadow">
                          {app.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <footer className="flex h-12 shrink-0 items-center justify-between border-t border-white/10 bg-black/35 px-4 text-xs text-white/75">
                  <span>{desktopConfig.user}</span>
                  <div className="flex items-center gap-2">
                    {desktopConfig.apps.slice(0, 4).map((app) => {
                      const Icon = app.icon

                      return (
                        <button
                          key={app.label}
                          className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
                          type="button"
                          title={app.label}
                        >
                          <Icon className="size-4" stroke={1.8} />
                        </button>
                      )
                    })}
                  </div>
                </footer>
              </div>
            </div>
          </div>
          <div className="mx-auto h-3 w-[58%] rounded-b-2xl bg-zinc-900 shadow-2xl shadow-black/50" />
        </section>
      </main>
    </div>
  )
}

export default App
