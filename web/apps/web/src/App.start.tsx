import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes } from "react-router"
import { Credit } from "./start/routes/credit"
import { Main } from "./start/routes/main"

export const StartingMenu = () => (
	<MemoryRouter>
		<Routes>
			<Route path={'/*'} element={<Main />} />
			<Route path={'/credit'} element={<Credit />} />
		</Routes>
		<Toaster />
	</MemoryRouter>
)