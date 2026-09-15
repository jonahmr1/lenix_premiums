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
				<h1 className='font-black italic text-fluid-3'>Appearance</h1>
				<Separator />
				<div className='bg-muted p-2 rounded-xl gap-3 flex flex-col'>
					<Field className='flex-row'>
						<FieldContent>
							<FieldLabel htmlFor='orientation'>Landscape orientation</FieldLabel>
						</FieldContent>
						<Switch
							id='orientation'
							defaultChecked={orientation === 'landscape'}
							onCheckedChange={value => setOrientation(value ? 'landscape' : 'portrait')}
						/>
					</Field>
					<Separator />
					<Field className='flex-row'>
						<FieldContent>
							<FieldLabel htmlFor='theme'>Light mode</FieldLabel>
						</FieldContent>
						<Switch id='theme' defaultChecked={theme === 'light'} onCheckedChange={toggle} />
					</Field>
				</div>
			</div>
		</div>
	)
}
