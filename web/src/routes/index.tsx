import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { IconArrowLeft, IconArrowRight, IconX } from "@tabler/icons-react"
import { useNavigate } from "react-router"

export const Index = ({
	appName,
	children
}: {
	appName: string
	children: React.ReactNode
}) => {
	const nav = useNavigate()

	return (
		<div className="size-full flex overflow-hidden flex-col">
			<div className="bg-card h-4/100 w-full overflow-hidden px-2 py-1 items-center justify-between flex">
				<div className="flex items-center">
					<Button
						variant='destructive'
						className="px-1 rounded-full" size='xs'
						onClick={() => nav('/')}
					>
						<IconX />
					</Button>
					<ButtonGroup>
						<Button
							variant='secondary'
							className="h-full"
							onClick={() => nav(-1)}
						>
							<IconArrowLeft />
						</Button>
						<Button
							variant='secondary'
							className="h-full"
							disabled
						>
							<IconArrowRight />
						</Button>
					</ButtonGroup>
				</div>
				<div>
					<p className="text-muted-foreground">{appName}</p>
				</div>
			</div>
			<Separator className="bg-muted-foreground" />
			<div className="bg-card size-full">
				{children}
			</div>
		</div>
	)
}