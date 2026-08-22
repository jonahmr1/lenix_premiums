import { Layout } from "@workspace/ui/elements/layout"
import bg1 from '@workspace/ui/assets/start/ls-1.png'
import bg2 from '@workspace/ui/assets/start/ls-2.png'
import bg3 from '@workspace/ui/assets/start/ls-3.png'
import bg4 from '@workspace/ui/assets/start/ls-4.png'
import { random } from "@lenix/lenix"

export const StartingMenu = () => {
	const backgrounds = [bg1, bg2, bg3, bg4]
	return (
		<Layout className="h-screen">
			<img src={backgrounds[random(0, 3)]} className="object-cover" />
		</Layout>
	)
}