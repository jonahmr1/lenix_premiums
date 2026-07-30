import { useState } from "react"
import { Button } from "./components/ui/button"
import { IconSpray } from '@tabler/icons-react';

const apps = [
	{
		name: 'Spray',
		color: 'primary'
	}
]

function App() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const tabletBg = `/${orientation}.jpg`

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <img
        src="/ped.png"
        className="pointer-events-none absolute inset-0 -z-1 size-full object-cover"
        alt=""
      />

			<div
				className={`rounded-3xl ring-20 ring-background ${orientation === "portrait" ? "h-8/10 aspect-3/4" : "w-5/10 aspect-4/3"}`}
			>
				<div className="relative size-full overflow-hidden">
					<img
            src={tabletBg}
            className="absolute size-full"
            alt=""
          />

          <div className="relative flex size-full p-4">
            {apps.map(({ name, color }) => (
							<div className="text-center">
								<Button className="size-13 p-0 bg-background hover:bg-background rounded-xl cursor-pointer">
									<div className="size-full bg-primary/33 p-2 rounded-xl">
										<IconSpray className={`size-full text-sidebar-${color}`} stroke={2} />
									</div>
								</Button>
								<p className="text-foreground text-sm">{name}</p>
							</div>
						))}
          </div>
				</div>
			</div>
    </div>
  )
}

export default App
