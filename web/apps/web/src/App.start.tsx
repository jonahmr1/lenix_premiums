import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes } from "react-router"
import { Credit } from "./starting/routes/credit"
import { Main } from "./starting/routes/main"

export const Starting = () => (
	<MemoryRouter>
		<Routes>
			<Route path={'/*'} element={<Main />} />
			<Route path={'/credit'} element={<Credit />} />
		</Routes>
		<Toaster />
	</MemoryRouter>
)