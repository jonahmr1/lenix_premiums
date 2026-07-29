import type { userStatuses } from "./constants";

export interface BaseRoute {
	to: `/${string}`;
	label: string;
	element: React.JSX.Element;
}

export interface Route extends BaseRoute {
	children?: BaseRoute[]
}

export type UserStatus = keyof typeof userStatuses

export interface PlayerStats {
	kills: number;
	deaths: number;
	assits: number;
	wins: number;
	losses: number;
}
