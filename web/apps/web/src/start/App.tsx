import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes } from "react-router"
import { Main } from "./routes/main"
import { Starting } from "./routes/starting"
import { Credit } from "./routes/credit"
import { Pause } from "./routes/pause"

export const Start = () => (
	<MemoryRouter>
		<Routes>
			<Route path={'/*'} element={<Main />} />
			<Route path={'/start'} element={<Starting />} />
			<Route path={'/credit'} element={<Credit />} />
			<Route path={'/pause'} element={<Pause />} />
		</Routes>
		<Toaster />
	</MemoryRouter>
)