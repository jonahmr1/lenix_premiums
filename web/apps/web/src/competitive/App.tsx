import { Game } from "./routes/game"
import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes } from "react-router"
import { Lobby } from "./routes/lobby"

export const Competitive = () => (
	<MemoryRouter>
		<Routes>
			<Route path={'/*'} element={<Lobby />} />
			<Route path={'/game'} element={<Game />} />
		</Routes>
		<Toaster />
	</MemoryRouter>
)