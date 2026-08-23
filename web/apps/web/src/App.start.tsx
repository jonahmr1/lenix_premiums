import { Toaster } from "@workspace/ui/components/sonner"
import { MemoryRouter, Route, Routes } from "react-router"
import { Credit } from "./starting/routes/credit"
import { Main } from "./starting/routes/main"
import { DEV } from "@/App"
import { useState } from "react"

export const Starting = () => {
	const [display, setDisplay] = useState(DEV)
	
	return (
		<MemoryRouter>
			<Routes>
				<Route path={'/*'} element={<Main display={display} setDisplay={setDisplay} />} />
				<Route path={'/credit'} element={<Credit />} />
			</Routes>
			<Toaster />
		</MemoryRouter>
	)
}