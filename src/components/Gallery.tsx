import { useRef, useState } from 'react'

type CasePhoto = { image: string; alt: string }

export function CasePhotos({ photos }: { photos: CasePhoto[] }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const gesture = useRef<{ x: number; y: number } | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const photo = photos[index]

  function select(next: number) {
    setIndex((next + photos.length) % photos.length)
    setZoom(false)
    stage.current?.scrollTo(0, 0)
  }

  return <section className={`case-photos ${zoom ? 'is-zoomed' : ''}`} aria-label="Дополнительные фотографии" onKeyDown={event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      select(index + (event.key === 'ArrowRight' ? 1 : -1))
    }
  }}>
    <h3>Детали кейса</h3>
    <div className="lightbox-stage" ref={stage} tabIndex={0} aria-label="Просмотр фото. Используйте стрелки для переключения" onTouchStart={event => {
      const touch = event.touches[0]
      gesture.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null
    }} onTouchEnd={event => {
      const touch = event.changedTouches[0]
      const start = gesture.current
      gesture.current = null
      if (!zoom && start && Math.abs(touch.clientX - start.x) > 60 && Math.abs(touch.clientY - start.y) < 70) {
        select(index + (touch.clientX < start.x ? 1 : -1))
      }
    }} onTouchCancel={() => { gesture.current = null }}>
      <img key={photo.image} src={photo.image} alt={photo.alt} loading="lazy"/>
    </div>
    <div className="lightbox-controls">
      <button type="button" onClick={() => select(index - 1)} aria-label="Предыдущее фото">←</button>
      <span aria-live="polite">{index + 1} / {photos.length}</span>
      <button type="button" className="zoom-control" aria-pressed={zoom} onClick={() => {
        setZoom(!zoom)
        stage.current?.scrollTo(0, 0)
      }}>{zoom ? 'Вписать' : 'Увеличить'}</button>
      <button type="button" onClick={() => select(index + 1)} aria-label="Следующее фото">→</button>
    </div>
  </section>
}
