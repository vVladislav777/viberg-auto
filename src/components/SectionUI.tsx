
export function Arrow() {
  return <span className="arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.2"/></svg></span>
}

export function Label({ children }: { children: string }) {
  return <p className="eyebrow">{children}<span/></p>
}
