import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes } from "react-router"
import { Credit } from "./starting/pages/credit"
import { Main } from "./starting/routes/main"
import { Menu } from "./starting/pages/menu"
import { Pause } from "./starting/pages/pause"

export const Starting = () => (
	<MemoryRouter>
		<Routes>
			<Route path={'/*'} element={<Main />} />
			<Route path={'/menu'} element={<Menu />} />
			<Route path={'/credit'} element={<Credit />} />
			<Route path={'/pause'} element={<Pause />} />
		</Routes>
		<Toaster />
	</MemoryRouter>
)