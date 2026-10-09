import lobby from "./lobby";

export default (logout: () => void) => {
	logout();
	const modules = [
		lobby
	];

	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose();
	};
};
