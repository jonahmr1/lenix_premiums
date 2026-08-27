import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes } from "react-router"
import { Credit } from "./starting/routes/credit"
import { Main } from "./starting/routes/main"
import { Pause } from "./starting/routes/pause"
import { Start } from "./starting/routes/start"

export const Starting = () => (
	<MemoryRouter>
		<Routes>
			<Route path={'/*'} element={<Main />} />
			<Route path={'/start'} element={<Start />} />
			<Route path={'/credit'} element={<Credit />} />
			<Route path={'/pause'} element={<Pause />} />
		</Routes>
		<Toaster />
	</MemoryRouter>
)