export const login = (logout: () => void) => {
	logout()
	return () => {}
}