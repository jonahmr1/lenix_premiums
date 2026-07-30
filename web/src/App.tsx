import { useState } from "react"
import { Button } from "./components/ui/button"
import { IconSpray } from '@tabler/icons-react';

function App() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("landscape")
  const tabletBg = `/${orientation}.jpg`

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <img
        src="/ped.png"
        className="pointer-events-none absolute inset-0 -z-1 h-full w-full object-cover"
        alt=""
      />

			<div
				className={`rounded-3xl ring-20 ${orientation === "portrait" ? "h-[80%] aspect-3/4" : "w-[80%] aspect-4/3"}`}
			>
				<div className="relative h-full w-full overflow-hidden">
					<div className="z-20 h-full w-full flex bg-muted-foreground">
						<Button>
							<IconSpray stroke={2} />
						</Button>
					</div>
					<img
						src={tabletBg}
						className="-z-10 h-full w-full"
					/>
				</div>
			</div>
    </div>
  )
}

export default App
