
import { useEffect, useRef, useState } from 'react'
import { catalog, directions, directionIds, type Direction } from '@/catalog'
import { money, pricing, type ServiceId } from '@/pricing'
import { Arrow, Label } from './SectionUI'
import { LiquidButton } from './ui/liquid-glass-button'
import { Modal } from './ui/modal'

export type ServiceFilter = Direction | 'all'

export function Directions({ choose }: { choose: (direction: Direction) => void }) {
  return <section className="directions section wrap" aria-labelledby="directions-title" data-reveal>
    <Label>НАПРАВЛЕНИЯ</Label>
    <h2 id="directions-title">Две задачи. Одна студия.</h2>
    <div className="direction-grid">
      {directionIds.map((id, index) => {
        const item = directions[id]
        return <a className="direction-panel" href="#services" key={id} onClick={() => choose(id)}>
          <img src={item.image} loading="lazy" alt=""/>
          <div className="direction-copy">
            <span className="display direction-index">0{index + 1} /</span>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
            <ul>{item.highlights.map(name => <li key={name}>{name}</li>)}</ul>
            <span className="direction-action">Смотреть услуги <Arrow/></span>
          </div>
        </a>
      })}
    </div>
  </section>
}

export function Services({ filter, choose, book }: {
  filter: ServiceFilter
  choose: (direction: ServiceFilter) => void
  book: (id: ServiceId) => void
}) {
  const [detail, setDetail] = useState<ServiceId | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const selected = catalog.find(item => item.id === detail)
  useEffect(() => {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('card-arrived')
        observer.unobserve(entry.target)
      }
    }, { threshold: .15 })
    grid.current?.querySelectorAll('.service-card:not(.card-arrived)').forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [filter])
  return <section className="section services wrap" id="services" data-reveal aria-labelledby="services-title">
    <div className="section-heading">
      <div><Label>ДЕТЕЙЛИНГ / АВТОСЕРВИС</Label><h2 id="services-title">Услуги и цены</h2></div>
      <LiquidButton asChild variant="outline" className="button outline"><a href="#calculator">Рассчитать стоимость <Arrow/></a></LiquidButton>
    </div>
    {pricing.demonstration && <p className="section-note">Цены и сроки демонстрационные. Итог зависит от автомобиля и объёма работ.</p>}
    <div className="filter-controls service-filters" role="group" aria-label="Направление услуг">
      {(['all', ...directionIds] as const).map(id => <button key={id} aria-pressed={filter === id} onClick={() => choose(id)}>{id === 'all' ? 'Все услуги' : directions[id].title}</button>)}
    </div>
    <div className="service-grid" ref={grid}>
      {catalog.filter(item => filter === 'all' || item.direction === filter).map(item => {
        const price = pricing.services[item.id]
        return <article className="service-card" key={item.id} data-service={item.id}>
          <div className="service-image"><img src={item.image} alt="" loading="lazy"/><span className="service-category">{directions[item.direction].title}</span></div>
          <div className="service-copy">
            <h3>{item.title}</h3><p>{item.description}</p>
            <div className="service-facts"><strong><small>от</small> {money(price.from)}</strong><span>{price.duration}</span></div>
            <div className="service-actions">
              <button type="button" className="text-action" onClick={() => setDetail(item.id)} aria-label={`Подробнее: ${item.title}`}>Подробнее <Arrow/></button>
              <LiquidButton className="button outline" onClick={() => book(item.id)} aria-label={`Записаться: ${item.title}`}>Записаться</LiquidButton>
            </div>
          </div>
        </article>
      })}
    </div>
    {selected && <Modal onClose={() => setDetail(null)} label={selected.title} className="service-detail">
      <img className="modal-service-image" src={selected.image} alt=""/>
      <Label>{directions[selected.direction].title}</Label><h2>{selected.title}</h2>
      <p className="service-detail-price">От {money(pricing.services[selected.id].from)} · {pricing.services[selected.id].duration}{pricing.demonstration && ' · Демо'}</p>
      <dl className="detail-list">
        <div><dt>Какие проблемы решает</dt><dd>{selected.problem}</dd></div>
        <div><dt>Что входит</dt><dd><ul>{selected.includes.map(item => <li key={item}>{item}</li>)}</ul></dd></div>
        <div><dt>Как проходит работа</dt><dd>{selected.details}</dd></div>
        <div><dt>Результат</dt><dd>{selected.description}</dd></div>
        <div><dt>От чего зависит стоимость</dt><dd>{selected.factors}</dd></div>
      </dl>
      <LiquidButton className="button light" onClick={() => { setDetail(null); book(selected.id) }}>Выбрать услугу <Arrow/></LiquidButton>
    </Modal>}
  </section>
}
