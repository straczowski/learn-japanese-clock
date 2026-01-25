import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

export const mergeClasses = (...inputs: Parameters<typeof clsx>) => {
  return twMerge(clsx(inputs))
}
