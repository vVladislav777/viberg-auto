
import { useState, type CSSProperties } from 'react'
import { comparisonImages, serviceById } from '@/catalog'
import { money, pricing, type ServiceId } from '@/pricing'
import { Label } from './SectionUI'

const examples = [
  { id: 'polishing', before: comparisonImages.paintBefore, after: comparisonImages.paintAfter,
    subject: 'Кузов Lexus LFA', result: 'На демонстрационных кадрах видно, как после коррекции лака отражения на капоте и крыльях становятся чётче.' },
  { id: 'interior', before: comparisonImages.interiorBefore, after: comparisonImages.interiorAfter,
    subject: 'Кожа, ковролин и панели', result: 'Светлая обивка без видимых загрязнений, очищенные панели и ковролин.' },
  { id: 'headlights', before: comparisonImages.headlightBefore, after: comparisonImages.headlightAfter,
    subject: 'Передняя оптика', result: 'Убраны видимые следы помутнения и царапины на внешней поверхности.' },
] satisfies { id: ServiceId; before: string; after: string; subject: string; result: string }[]

export function Comparison() {
  const [active, setActive] = useState(0)
  const [divider, setDivider] = useState(50)
  const item = examples[active]
  const price = pricing.services[item.id]

  return <section className="comparison section wrap" id="comparison" aria-labelledby="comparison-title" data-reveal>
    <div className="section-heading">
      <div><Label>РЕЗУЛЬТАТ ДЕТЕЙЛИНГА</Label><h2 id="comparison-title">До и после</h2></div>
      <p className="section-note">Демонстрационные фото. Потяните разделитель или используйте стрелки клавиатуры.</p>
    </div>
    <div className="filter-controls comparison-filters" role="group" aria-label="Вид сравнения">
      {examples.map((example, index) => <button key={example.id} aria-pressed={active === index} onClick={() => { setActive(index); setDivider(50) }}>
        {serviceById(example.id).title}
      </button>)}
    </div>
    <div className="comparison-layout">
      <div className="comparison-frame" style={{ '--divider': divider + '%' } as CSSProperties}>
        <div className="comparison-layer"><img src={item.after} alt={item.subject + ' после обработки'} loading="lazy" width={1280} height={960}/></div>
        <div className="comparison-layer comparison-before"><img src={item.before} alt={item.subject + ' до обработки'} loading="lazy" width={1280} height={960}/></div>
        <span className="compare-tag before-tag">До</span><span className="compare-tag after-tag">После</span>
        <div className="compare-divider" aria-hidden="true"><span>‹ ›</span></div>
        <input className="compare-range" type="range" min="0" max="100" value={divider} onChange={event => setDivider(Number(event.target.value))} aria-label="Разделитель фото до и после" aria-valuetext={`До: ${divider}%, после: ${100 - divider}%`}/>
      </div>
      <div className="comparison-copy">
        <h3>{item.subject}</h3><p>{item.result}</p>
        <dl><div><dt>Продолжительность</dt><dd>{price.duration}</dd></div><div><dt>Стоимость {pricing.demonstration && 'в демо'}</dt><dd>от {money(price.from)}</dd></div></dl>
        <a className="text-action" href="#calculator">Рассчитать для своего авто →</a>
      </div>
    </div>
  </section>
}
