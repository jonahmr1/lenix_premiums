import { useState } from "react"

function App() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const tabletBg = `/${orientation}.jpg`

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <img
        src="/ped.png"
        className="pointer-events-none absolute inset-0 -z-1 h-full w-full object-cover"
        alt=""
      />

      <div
        className={`
					rounded-3xl border-black bg-black p-5
          ${orientation === "portrait" ? "h-[80%] aspect-3/4" : "w-[80%] aspect-4/3"}
        `}
      >
        <img
          src={tabletBg}
          className="h-full w-full object-fill"
          alt=""
        />
				<p className="text-white z-50">test</p>
      </div>
    </div>
  )
}

export default App
