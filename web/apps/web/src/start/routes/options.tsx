import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"

export const Options = () => {
	const Preview = () => (
		<p className="text-fluid-5">Coming Soon...</p>
	)

	const tabs = [
		{
			label: 'Settings',
			content: <Preview />
		},
		{
			label: 'Brief',
		},
		{
			label: 'Stats',
		},
		{
			label: 'Gallery',
		},
		{
			label: 'Editor',
		},
	]
	return (
		<div className="h-screen w-full bg-dark/80 flex justify-center p-md *:text-fluid-2 gap-md">
			<Button variant='secondary' className="bg-background hover:bg-background hover:opacity-80" size='lg'>Q</Button>
			<Tabs defaultValue='0' className="size-full">
				<TabsList className="bg-transparent w-full p-0 gap-md">
					{tabs.map((tab, i) => (
						<TabsTrigger className="uppercase text-[2.5vmin] h-full bg-background text-foreground! hover:opacity-80 m-0 data-active:bg-foreground! data-active:text-background!" value={i.toString()}>{tab.label}</TabsTrigger>
					))}
				</TabsList>
				{tabs.map((tab, i) => (
					<TabsContent value={i.toString()} className="size-full place-content-center place-items-center">{tab.content ?? <Preview />}</TabsContent>
				))}
			</Tabs>
			<Button variant='secondary' className="bg-background hover:bg-background hover:opacity-80" size='lg'>E</Button>
		</div>
	)
}