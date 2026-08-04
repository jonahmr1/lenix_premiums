export interface BaseRoute {
	to: `/${string}`
	label: string
	element: React.JSX.Element
}

export interface Route extends BaseRoute {
	children?: BaseRoute[]
}
