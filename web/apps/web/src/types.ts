export interface Storage {
	hudVariant: 'progress' | 'bar'
}
export interface Tab {
	label: string
	disabled?: true
	content?: React.ReactNode
}