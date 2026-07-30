import { Button } from "@/components/ui/button"
import { apps } from "@/contants";
import { IconSpray } from '@tabler/icons-react';
import { useNavigate } from "react-router";

export const Home = () => {
	const nav = useNavigate()
	
	return (
		<div className="relative flex size-full p-4">
			{apps.map(({ name, iconStyles }) => (
				<div className="text-center" key={name}>
					<Button 
						className="size-13 p-0 bg-background hover:bg-background rounded-xl cursor-pointer"
						onClick={() => nav(`/${name}`)}
					>
						<div className="size-full bg-primary/33 p-2 rounded-xl">
							<IconSpray className={`size-full ${iconStyles}`} stroke={2} />
						</div>
					</Button>
					<p className="text-white text-sm">{name}</p>
				</div>
			))}
		</div>
	)
}