import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export const Settings = () => {
	return (
		<div className="p-10 gap-3 flex flex-col">
			<h1>Appearance</h1>
			<Separator />
			<div className="bg-muted p-2 rounded-xl gap-3 flex flex-col">
				<Field className="flex-row">
					<FieldContent>
						<FieldLabel>Enable landscape orientation</FieldLabel>
					</FieldContent>
					<Switch />
				</Field>
				<Separator />
				<Field className="flex-row">
					<FieldContent>
						<FieldLabel>Turn on light mode</FieldLabel>
					</FieldContent>
					<Switch />
				</Field>
			</div>
		</div>
	)
}