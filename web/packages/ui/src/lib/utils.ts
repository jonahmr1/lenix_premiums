import { clsx, type ClassValue } from 'clsx'
import { toast as sonner } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const toast = sonner