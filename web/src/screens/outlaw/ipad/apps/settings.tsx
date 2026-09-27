import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import type { Orientation } from '../types'
import type { S } from '@lenix/lenix'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/components/theme-provider'

export const Settings = ({
	orientation,
	setOrientation,
}: {
	orientation: Orientation
	setOrientation: S<Orientation>
}) => {
	const { theme } = useTheme()
	return (
		<div className='size-full'>
			<div className='p-10 gap-3 flex flex-col'>
				<h1 className='font-black italic text-fluid-3'>Appearance</h1>
				<Separator />
				<div className='bg-muted p-2 rounded-md gap-3 flex flex-col'>
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
						<Switch id='theme' disabled defaultChecked={theme === 'light'} />
					</Field>
				</div>
			</div>
		</div>
	)
}
