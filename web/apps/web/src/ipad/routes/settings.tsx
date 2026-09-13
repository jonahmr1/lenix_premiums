import { Field, FieldContent, FieldLabel } from '@workspace/ui/components/field'
import type { Orientation } from '@/ipad/types'
import type { S } from '@lenix/lenix'
import { Separator } from '@workspace/ui/components/separator'
import { Switch } from '@workspace/ui/components/switch'
import { useTheme } from '@workspace/ui/hooks/theme'

export const Settings = ({
	orientation,
	setOrientation,
}: {
	orientation: Orientation
	setOrientation: S<Orientation>
}) => {
	const { theme, toggle } = useTheme()
	return (
		<div className='size-full'>
			<div className='p-10 gap-3 flex flex-col'>
				<h1>Appearance</h1>
				<Separator />
				<div className='bg-muted p-2 rounded-xl gap-3 flex flex-col'>
					<Field className='flex-row'>
						<FieldContent>
							<FieldLabel>Landscape orientation</FieldLabel>
						</FieldContent>
						<Switch
							defaultChecked={orientation === 'landscape'}
							onCheckedChange={value => setOrientation(value ? 'landscape' : 'portrait')}
						/>
					</Field>
					<Separator />
					<Field className='flex-row'>
						<FieldContent>
							<FieldLabel>Light mode</FieldLabel>
						</FieldContent>
						<Switch defaultChecked={theme === 'light'} onCheckedChange={toggle} />
					</Field>
				</div>
			</div>
		</div>
	)
}
