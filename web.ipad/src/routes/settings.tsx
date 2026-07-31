import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { getTheme, toggleTheme } from "@/lib"
import type { Orientation } from "@/types"
import type { S } from "@lenix/lenix"

export const Settings = ({
	orientation,
	setOrientation
}: {
	orientation: Orientation
	setOrientation: S<Orientation>
}) => {
	return (
		<div className="p-10 gap-3 flex flex-col">
			<h1>Appearance</h1>
			<Separator />
			<div className="bg-muted p-2 rounded-xl gap-3 flex flex-col">
				<Field className="flex-row">
					<FieldContent>
						<FieldLabel>Enable landscape orientation</FieldLabel>
					</FieldContent>
					<Switch defaultChecked={orientation === 'landscape'} onCheckedChange={value => setOrientation(value ? 'landscape' : 'portrait')} />
				</Field>
				<Separator />
				<Field className="flex-row">
					<FieldContent>
						<FieldLabel>Turn on light mode</FieldLabel>
					</FieldContent>
					<Switch defaultChecked={getTheme() === 'dark'} onCheckedChange={value => toggleTheme(value ? 'light' : 'dark')} />
				</Field>
			</div>
		</div>
	)
}