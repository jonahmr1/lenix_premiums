import { useState } from 'react'

export const useFriendsDrawer = () => {
	const [drawer, setDrawer] = useState(false)

	return { drawer, setDrawer }
}
