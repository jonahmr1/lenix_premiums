import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react"

export const Spray = ({
	appName
}: {
	appName: string
}) => {
	return (
		<div className="size-full flex overflow-hidden flex-col">
			<div className="bg-muted h-4/100 w-full overflow-hidden px-2 py-1 items-center justify-between flex">
				<div className="flex items-center">
					<Button variant='destructive' className="px-1 rounded-full" size='xs'>
						<IconX />
					</Button>
					<ButtonGroup>
						<Button variant='secondary' className="h-full">
							<IconArrowLeft />
						</Button>
						<Button variant='secondary' className="h-full">
							<IconArrowRight />
						</Button>
					</ButtonGroup>
				</div>
				<div>
					<p className="text-muted-foreground">Spray</p>
				</div>
			</div>
			<Separator className="bg-muted-foreground" />
			<div className="bg-muted size-full">

			</div>
		</div>
	)
}