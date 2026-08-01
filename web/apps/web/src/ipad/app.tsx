import { useEffect, useState } from "react"
import { Routes, Route, MemoryRouter } from 'react-router'
import { Home } from "@/ipad/routes/home"
import { Settings } from "@/ipad/routes/settings"
import { Index } from "@/ipad/routes"
import { getStorage, setStorage } from "@lenix/lenix"
import type { Orientation, Storage } from "@/ipad/types"
import { apps } from "./constants"
import { toggleTheme } from "./lib"
import veritcalBg from '@workspace/ui/assets/ipad/portrait.jpg'
import horizontalBg from '@workspace/ui/assets/ipad/landscape.jpg'

toggleTheme(getStorage<Storage, 'theme'>('theme') ?? 'dark')

const AppFragment = ({
	appName,
	children
}: {
	appName: string
	children: React.ReactNode
}) => (
	<div className="relative z-10 flex size-full bg-background rounded-xl overflow-hidden">
		<Index appName={appName}>
			{children}
		</Index>
	</div>
)

export const Ipad = () => {
	const [orientation, setOrientation] = useState<Orientation>(getStorage<Storage, 'orientation'>('orientation') || "portrait")
	const tabletBg = orientation === 'portrait' ? veritcalBg : horizontalBg

	useEffect(() => {
		setStorage<Storage>('orientation', orientation)
	}, [orientation])

	return (
		<div className="relative flex h-screen w-full items-center justify-center">
			<div
				className={`rounded-xl ring-20 ring-black ${orientation === "portrait" ? "h-8/10 aspect-3/4" : "w-5/10 aspect-4/3"}`}
			>
				<div className="relative size-full overflow-hidden">
					<img
						src={tabletBg}
						className="absolute size-full"
						alt=""
					/>
					<MemoryRouter>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/settings" element={
								<AppFragment appName={'Settings'}>
									<Settings {...{ orientation, setOrientation }} />
								</AppFragment>
							} />
							{apps.map(({ name, element: Element }) => (
								<Route key={name} path={`/${name}`} element={
									<AppFragment appName={name}>
										<Element />
									</AppFragment>
								} />
							))}
						</Routes>
					</MemoryRouter>
				</div>
			</div>
		</div>
	)
}