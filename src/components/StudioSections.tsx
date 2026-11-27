
import { useState } from 'react'
import { images } from '@/config'
import { benefits, cases, faq, reviews } from '@/studio-content'
import { Arrow, Label } from './SectionUI'
import { Modal } from './ui/modal'

export function About() {
  return <section className="about section wrap" id="about" data-reveal aria-labelledby="about-title">
    <div className="studio-image"><img src={images.about} alt="Вход в студию VIBERG AUTO" loading="lazy" width={836} height={470}/></div>
    <div className="about-copy">
      <Label>О СТУДИИ</Label><h2 className="studio-name" id="about-title">VIBERG AUTO</h2>
      <p>Уход за кузовом, салоном и технической частью автомобиля в одном месте. Объём работ обсуждаем до начала, результат проверяем при выдаче.</p>
      <dl className="benefit-list">{benefits.map(([title, description]) => <div key={title}><dt>{title}</dt><dd>{description}</dd></div>)}</dl>
    </div>
  </section>
}

const steps = [
  ['Осмотр', 'Уточняем задачу и проверяем состояние автомобиля.'],
  ['Согласование', 'Обсуждаем перечень работ, стоимость и срок выдачи.'],
  ['Работы и проверка', 'Выполняем согласованный объём и контролируем результат.'],
  ['Выдача', 'Показываем выполненные работы и даём рекомендации по уходу.'],
] as const

export function Process() {
  return <section className="process section wrap" id="process" data-reveal>
    <Label>ПРОЦЕСС РАБОТЫ</Label><h2>От осмотра до выдачи</h2>
    <ol className="steps">{steps.map(([title, copy], index) => <li key={title}><div className="step-line"><span>0{index + 1}</span><i/></div><h3>{title}</h3><p>{copy}</p></li>)}</ol>
  </section>
}

export function PortfolioCases() {
  const [active, setActive] = useState<(typeof cases)[number] | null>(null)
  return <section className="case-section section wrap" id="portfolio" data-reveal aria-labelledby="portfolio-title">
    <div className="section-heading"><div><Label>ПОРТФОЛИО</Label><h2 id="portfolio-title">Примеры работ</h2></div><p className="section-note">Демонстрационные кейсы на Lexus LFA.</p></div>
    <div className="case-grid">
      {cases.map(item => <button key={item.id} type="button" className="case-card" onClick={() => setActive(item)}>
        <img src={item.image} alt="" loading="lazy"/><span className="case-label"><small>{item.model} · {item.duration}</small><strong>{item.title}</strong><Arrow/></span>
      </button>)}
    </div>
    {active && <Modal onClose={() => setActive(null)} label={active.title} className="case-dialog">
      <Label>ДЕМОНСТРАЦИОННЫЙ КЕЙС</Label><h2>{active.title}</h2><p className="modal-intro">{active.model} · {active.duration}</p>
      <dl className="detail-list"><div><dt>Исходное состояние</dt><dd>{active.state}</dd></div><div><dt>Что сделали</dt><dd>{active.work}</dd></div><div><dt>Результат</dt><dd>{active.result}</dd></div></dl>
      <div className="case-photos">{active.photos.map((src, index) => <img key={src} src={src} alt={`${active.model}, фото ${index + 1}`} loading="lazy"/>)}</div>
    </Modal>}
  </section>
}

export function Reviews() {
  if (reviews.length === 0) return null
  return <section className="section wrap" aria-labelledby="reviews-title" data-reveal>
    <h2 id="reviews-title">Отзывы</h2>
    <div className="review-grid">{reviews.map(review => <figure key={review.id}><blockquote>{review.text}</blockquote><figcaption>{review.author}{review.source && <> · <a href={review.source}>Источник</a></>}</figcaption></figure>)}</div>
  </section>
}

export function FAQ() {
  return <section className="faq section wrap" id="faq" aria-labelledby="faq-title" data-reveal>
    <div><Label>ПЕРЕД ЗАПИСЬЮ</Label><h2 id="faq-title">Частые вопросы</h2></div>
    <div className="faq-list">{faq.map(([question, answer]) => <details key={question} name="studio-faq"><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
  </section>
}
