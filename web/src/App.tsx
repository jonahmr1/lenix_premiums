import { useState } from "react"
import { Routes, Route, MemoryRouter } from 'react-router'
import { Home } from "./routes/home"
import { apps } from "./contants"

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
					<MemoryRouter>
						<Routes>
							<Route path="/" element={<Home />}/>
							{apps.map(({ name, iconStyles }) => (
								<Route key={name} path={`/${name}`} element={
									<div className="">
										test
									</div>
								}/>
							))}
						</Routes>
					</MemoryRouter>
				</div>
			</div>
    </div>
  )
}

export default App
