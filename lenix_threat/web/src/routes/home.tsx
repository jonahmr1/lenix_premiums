import { Button } from "@/components/ui/button"
import { apps } from "@/contants";
import type { AppIcon } from "@/types";
import { IconSettings } from '@tabler/icons-react';
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";

const App = ({ name, styles, icon: { element: Element, styles: iconStyles }}: Omit<AppIcon, 'element'>) => {
	const nav = useNavigate()
	
	return (
		<div className="text-center" >
			<Button 
				className="size-13 p-0 bg-background hover:bg-background rounded-xl cursor-pointer"
				onClick={() => nav(`/${name}`)}
			>
				<div className={twMerge('size-full p-2 rounded-xl', styles)}>
					<Element className={twMerge('size-full', iconStyles)} stroke={2} />
				</div>
			</Button>
			<p className="text-white text-xs font-bold drop-shadow-lg drop-shadow-black">{name}</p>
		</div>
	)
}

export const Home = () => {
	return (
		<div className="relative grid size-full grid-cols-5 content-start gap-4 p-4">
			<App
				name="Settings"
				styles="bg-muted"
				icon={{
					element: IconSettings,
					styles: 'text-zinc-400',
				}}
			/>
			{apps.map(app => <App {...app} key={app.name} />)}
		</div>
	)
}