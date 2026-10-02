export default (logout: () => void) => {
	logout()
	return () => {}
}