import { useEffect, useRef, type ReactNode } from 'react'
export function Modal({ children, onClose, label, className = '' }: { children: ReactNode; onClose: () => void; label: string; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return <dialog ref={ref} aria-label={label} className={`modal ${className}`} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) { const b = e.currentTarget.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) onClose() } }}><button className="modal-close" aria-label="Закрыть" onClick={onClose}>×</button>{children}</dialog>
}
