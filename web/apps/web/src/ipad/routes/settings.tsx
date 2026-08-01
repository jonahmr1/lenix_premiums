import { Field, FieldContent, FieldLabel } from "@workspace/ui/components/field"
import type { Orientation } from "@/ipad/types"
import type { S } from "@lenix/lenix"
import { Separator } from "@workspace/ui/components/separator"
import { Switch } from "@workspace/ui/components/switch"
import { getTheme, toggleTheme } from "../lib"

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