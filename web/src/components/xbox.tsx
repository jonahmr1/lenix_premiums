export const Xbox = () => (
	<div
		className="size-full border border-foreground text-foreground"
		style={{
			backgroundImage: `
				linear-gradient(to top right,
						transparent calc(50% - 0.5px),
						currentColor 50%,
						transparent calc(50% + 0.5px)),
				linear-gradient(to bottom right,
					transparent calc(50% - 0.5px),
					currentColor 50%,
					transparent calc(50% + 0.5px))
				`,
		}}
	/>
)