"use client"
import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface BlurRevealProps { className?: string; children: ReactNode; delay?: number; duration?: number }
export function BlurReveal({ className, children, delay = 0, duration = .65 }: BlurRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  return <motion.span ref={ref} initial={reduced ? false : { opacity: 0, filter: 'blur(10px)', y: 20 }} animate={inView || reduced ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}} transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay }} className={cn('inline-block', className)}>{children}</motion.span>
}
