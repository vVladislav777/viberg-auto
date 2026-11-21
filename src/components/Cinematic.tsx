import { useEffect, useRef } from 'react'
import { images } from '@/config'

export function Cinematic() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current!
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const draw = () => {
      frame = 0
      if (media.matches || innerWidth <= 600) { el.style.setProperty('--progress', '0'); return }
      const rect = el.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - innerHeight)))
      el.style.setProperty('--progress', String(progress))
    }
    const update = () => { if (!frame) frame = requestAnimationFrame(draw) }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    media.addEventListener('change', update)
    draw()
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); media.removeEventListener('change', update) }
  }, [])
  return <section className="cinematic" ref={ref} aria-label="Lexus LFA в студии"><div className="cinematic-sticky"><div className="cinematic-frame"><img src={images.studio} alt="Белый Lexus LFA в тёмной студии с отражениями на полу" loading="lazy" width="1672" height="941"/><div className="cinematic-shade"/><div className="cinematic-copy"><span className="eyebrow">VIBERG AUTO · ДЕТЕЙЛИНГ И АВТОСЕРВИС</span><h2>Безупречный вид.<br/><span>Точное движение.</span></h2><span className="cinematic-foot">СОХРАНЯЕМ ХАРАКТЕР ВАШЕГО АВТОМОБИЛЯ <i>↓</i></span></div></div></div></section>
}
