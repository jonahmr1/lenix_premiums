import { useState } from "react"
import type { Competitive } from "types"

export const useNotifications = () => {
	const [notifications, setNotifications] = useState<Competitive.Player['Notification'][]>([])
	return { notifications, setNotifications }
}