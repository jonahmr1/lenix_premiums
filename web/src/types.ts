import type { TablerIcon } from "@tabler/icons-react";

export interface AppIcon {
	name: string;
	styles: string;
	icon: {
		element: TablerIcon;
		styles: string;
	};
	element: () => React.JSX.Element;
}

export interface Storage {
	theme: 'dark' | 'light'
}