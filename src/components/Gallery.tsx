import { useEffect, useRef, useState } from 'react'
import { gallery } from '@/config'
import { Modal } from './ui/modal'

const filters = ['Все фотографии', 'Автомобиль', 'Автосервис', 'Детали']
const categories = [1, 1, 2, 2, 3, 3, 3, 3]
const sizes = [[1672,941], [836,470], [836,470], [836,471], [362,543], [362,543], [362,543], [362,543]]

export function Gallery() {
  const [filter, setFilter] = useState(0)
  const [photo, setPhoto] = useState<number | null>(null)
  const [zoom, setZoom] = useState(false)
  const gesture = useRef<{x: number; y: number} | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const visible = gallery.map((g, index) => ({ ...g, index })).filter(g => filter === 0 || categories[g.index] === filter)
  const current = visible.findIndex(g => g.index === photo)
  function move(direction: number) {
    setPhoto(visible[(current + direction + visible.length) % visible.length].index)
    setZoom(false)
    stage.current?.scrollTo(0,0)
  }
  useEffect(() => {
    if (photo === null) return
    const key = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const direction = event.key === 'ArrowRight' ? 1 : -1
        setPhoto(visible[(current + direction + visible.length) % visible.length].index)
        setZoom(false)
        stage.current?.scrollTo(0,0)
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [photo, filter, current])

  return <section className="portfolio section wrap" id="portfolio" data-reveal>
    <div className="section-heading"><div><p className="eyebrow">ГАЛЕРЕЯ СТУДИИ<span/></p><h2>Характер — в деталях.</h2></div><span className="subtle-note">Демонстрационная галерея</span></div>
    <div className="gallery-toolbar"><div className="filter-controls" role="group" aria-label="Фильтр фотографий">{filters.map((name, i) => <button key={name} aria-pressed={filter === i} onClick={() => setFilter(i)}>{name}</button>)}</div><span className="gallery-count" role="status">{String(visible.length).padStart(2,'0')} фото</span></div>
    <div className={`gallery fitted-gallery ${filter ? 'gallery-filtered' : ''}`} key={filter}>{visible.map(g => <button key={g.image} className={g.index < 4 ? 'landscape' : 'portrait'} onClick={() => { setZoom(false); setPhoto(g.index) }} aria-label={`Открыть фото: ${g.alt}`}><img src={g.image} alt={g.alt} loading="lazy" width={sizes[g.index][0]} height={sizes[g.index][1]}/><span className="gallery-expand" aria-hidden="true">↗</span></button>)}</div>
    <p className="gallery-note">Изображения для демонстрации дизайна, не выполненные заказы студии.</p>
    {photo !== null && <Modal label="Демонстрационная фотогалерея" className={`lightbox ${zoom ? 'is-zoomed' : ''}`} onClose={() => setPhoto(null)}>
      <div className="lightbox-stage" ref={stage} onTouchStart={event => { const touch = event.touches[0]; gesture.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null }} onTouchEnd={event => {
        const touch = event.changedTouches[0], start = gesture.current
        gesture.current = null
        if (!zoom && start && Math.abs(touch.clientX - start.x) > 60 && Math.abs(touch.clientY - start.y) < 70) move(touch.clientX < start.x ? 1 : -1)
      }}><img src={gallery[photo].image} alt={gallery[photo].alt} key={photo}/></div>
      <div className="lightbox-controls"><button onClick={() => move(-1)} aria-label="Предыдущее фото">←</button><span aria-live="polite">{String(current + 1).padStart(2,'0')} / {String(visible.length).padStart(2,'0')}</span><button className="zoom-control" aria-pressed={zoom} onClick={() => { setZoom(!zoom); stage.current?.scrollTo(0,0) }}>{zoom ? 'Вписать фото −' : 'Увеличить +'}</button><button onClick={() => move(1)} aria-label="Следующее фото">→</button></div>
      <div className="gallery-thumbnails" aria-label="Выбор фотографии">{visible.map(g => <button key={g.index} aria-label={`Фото ${visible.indexOf(g)+1}: ${g.alt}`} aria-pressed={photo === g.index} onClick={() => { setPhoto(g.index); setZoom(false); stage.current?.scrollTo(0,0) }}><img src={g.image} alt=""/></button>)}</div>
    </Modal>}
  </section>
}
