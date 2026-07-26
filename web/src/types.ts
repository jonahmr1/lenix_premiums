export interface Route {
	to: string;
	label: string;
	element: React.JSX.Element;
	children?: {
		to: string;
		label: string;
		element: React.JSX.Element;
	}[]
}