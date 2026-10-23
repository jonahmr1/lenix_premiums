export const Xbox = () => (
	<div
		className='border-foreground text-foreground size-full border'
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
