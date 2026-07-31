import { IconSpray } from "@tabler/icons-react";
import { Spray } from "./routes/spray";
import type { AppIcon } from "./types";

export const apps: AppIcon[] = [
	{
		name: 'Sprays War',
		styles: 'bg-primary/33',
		icon: {
			element: IconSpray,
			styles: 'text-sidebar-primary'
		},
		element: Spray
	}
]