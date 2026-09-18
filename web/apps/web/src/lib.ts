import type { MotionProps } from "motion/react";

export const anim = {
	initial: false,
	transition: { duration: 0.3, ease: 'easeOut' },
} satisfies MotionProps

/**
	@param length length of numbers to stop applying to; e.g. tens? hundreds? thousands? written as 1, 2, 3 ...
 */
export const zeroed = (value: string | number, length: number) => String(value).padStart(length, '0')
