"use client"
import { forwardRef, useId, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Adapted from the supplied Liquid Glass component. Each instance has a unique
// filter id; the CSS glass surface remains available without SVG backdrop support.
export const liquidbuttonVariants = cva('liquid-button', {
  variants: { variant: { default: 'glass-default', outline: 'glass-outline', secondary: 'glass-secondary' }, size: { default: 'glass-md', lg: 'glass-lg', xl: 'glass-xl', xxl: 'glass-xl', icon: 'glass-icon' } },
  defaultVariants: { variant: 'default', size: 'default' },
})
type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof liquidbuttonVariants> & { asChild?: boolean }
export const LiquidButton = forwardRef<HTMLButtonElement, Props>(function LiquidButton({ className, variant, size, asChild, children, ...props }, ref) {
  const id = `glass-${useId().replace(/:/g, '')}`
  if (asChild) return <Slot ref={ref} className={cn(liquidbuttonVariants({ variant, size }), className)} {...props}>{children}</Slot>
  return <button ref={ref} className={cn(liquidbuttonVariants({ variant, size }), className)} {...props}>
    <span className="glass-distortion" style={{ backdropFilter: `url(#${id}) blur(8px)` }} aria-hidden="true"/>
    <span className="glass-content">{children}</span>
    <svg className="glass-filter" aria-hidden="true" width="0" height="0"><defs><filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="noise"/><feGaussianBlur in="noise" stdDeviation="2" result="blurred"/><feDisplacementMap in="SourceGraphic" in2="blurred" scale="12" xChannelSelector="R" yChannelSelector="B"/><feGaussianBlur stdDeviation="1"/></filter></defs></svg>
  </button>
})
export const Button = LiquidButton
export const buttonVariants = liquidbuttonVariants
export const MetalButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function MetalButton({ className, ...props }, ref) {
  return <button ref={ref} className={cn('metal-button', className)} {...props}/>
})
