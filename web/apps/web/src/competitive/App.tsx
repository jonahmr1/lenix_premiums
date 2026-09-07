import { Game } from "./routes/game"
import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes, useNavigate } from "react-router"
import { Lobby } from "./routes/lobby"
import { useEffect } from "react"
import { DEV } from "@/App"

const Router = () => {
	const nav = useNavigate()

	useEffect(() => {
		DEV(() => nav('/game'), 'competitive')
	}, [])

	return (
		<>
			<Routes>
				<Route path={'/*'} element={<Lobby />} />
				<Route path={'/game'} element={<Game />} />
			</Routes>
			<Toaster />
		</>
	)
}

export const Competitive = () => (
	<MemoryRouter>
		<Router />
	</MemoryRouter>
)