import locker from "./locker";
import roster from "./roster";

export default () => {
	const modules = [
		locker(),
		roster()
	];

	return () => {
		for (const disposes of modules) for (const dispose of disposes) dispose();
	};
};
