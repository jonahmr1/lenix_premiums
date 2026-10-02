import criminaltask from "./criminaltask";
import ipad from "./ipad";

export default (logout: () => void) => {
	logout();
	const modules = [
		criminaltask,
		ipad
	];

	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose();
	};
};
