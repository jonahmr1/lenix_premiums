import { useState } from "react"
import type { Rank } from "types"

export const useNotifications = () => {
	const [notifications, setNotifications] = useState<Rank.Player['Notification'][]>([])
	return { notifications, setNotifications }
}