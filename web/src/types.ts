export interface Route {
	to: `/${string}`;
	label: string;
	element: React.JSX.Element;
}

export interface PlayerStats {
	kills: number;
	deaths: number;
	assits: number;
	wins: number;
	losses: number;
}
