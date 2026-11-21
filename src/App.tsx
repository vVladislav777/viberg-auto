import { useEffect, useState, type FormEvent } from 'react'
import { BlurReveal } from '@/components/ui/blur-reveal'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { Cinematic } from '@/components/Cinematic'
import { Gallery } from '@/components/Gallery'
import { Modal } from '@/components/ui/modal'
import { images, services, studio } from './config'

function Arrow({ circle = false }: { circle?: boolean }) { return <span className={circle ? 'arrow circle' : 'arrow'} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.2" /></svg></span> }
function Mark() { return <a href="#home" className="wordmark" aria-label="VIBERG AUTO — главная"><i />VIBERG AUTO</a> }
function Label({ children }: { children: string }) { return <p className="eyebrow">{children}<span /></p> }
function Outline({ type }: { type: number }) { return <svg className="outline-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">{type === 0 ? <><path d="m16 3 11 5v8c0 6-11 13-11 13S5 22 5 16V8Z"/><path d="m10 15 4 4 8-8"/></> : type === 1 ? <><path d="m3 12 6-7h14l6 7-13 17Z M3 12h26M9 5l7 24 7-24M9 12l7-7 7 7"/></> : <><path d="M16 2c0 10-4 14-14 14 10 0 14 4 14 14 0-10 4-14 14-14C20 16 16 12 16 2Z"/></>}</svg> }

function Booking({ initial, close }: { initial: string; close: () => void }) {
  const [summary, setSummary] = useState<{ service: string; date: string; time: string } | null>(null)
  const today = new Date(); const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSummary({ service: String(data.get('service')), date: String(data.get('date')), time: String(data.get('time')) })
  }
  return <Modal onClose={close} label="Демонстрационная запись в студию"><Label>ОНЛАЙН-ЗАПИСЬ · ДЕМО</Label><h2>Запись в студию</h2>{summary ? <div className="booking-result" role="status"><Outline type={0}/><h3>Ваш выбор готов</h3><p>{summary.service}<br/>{new Date(summary.date + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} · {summary.time}</p><p className="notice">Это демонстрация. Данные не отправлены, время не забронировано. Для реальной записи необходимо подключить сервис студии.</p><LiquidButton className="button light" onClick={() => setSummary(null)}>Изменить выбор <Arrow/></LiquidButton></div> : <><p className="modal-intro">Выберите услугу и удобное время — мы подтвердим вашу запись.</p><p className="notice">Демо-режим: покажем итог выбора без отправки заявки. Все часы доступны только для примера.</p><form onSubmit={submit}><label>Услуга<select name="service" defaultValue={initial || services[0].title}>{services.map(s => <option key={s.id}>{s.title}</option>)}</select></label><div className="form-row"><label>Желаемая дата<input name="date" type="date" min={minDate} required/></label><label>Время<select name="time" defaultValue="12:00">{['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => <option key={t}>{t}</option>)}</select></label></div><LiquidButton className="button light" type="submit">Посмотреть итог <Arrow/></LiquidButton></form></>}</Modal>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  const [service, setService] = useState<number | null>(null)
  const [prices, setPrices] = useState(false)
  const [booking, setBooking] = useState<string | null>(null)
  const [serviceFilter, setServiceFilter] = useState(0)
  const openBooking = (title = '') => { if (studio.bookingUrl) { window.location.assign(studio.bookingUrl); return } setService(null); setPrices(false); setBooking(title) }
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: .1 })
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  const nav = <><a href="#about" onClick={() => setMenu(false)}>О студии</a><a href="#services" onClick={() => setMenu(false)}>Услуги</a><button onClick={() => { setPrices(true); setMenu(false) }}>Цены</button><a href="#contacts" onClick={() => setMenu(false)}>Контакты</a></>
  return <><a href="#services" className="skip-link">Перейти к содержимому</a><main>
    <section className="hero-stage" id="home" aria-label="VIBERG AUTO — детейлинг-студия">
      <div className="hero-shell">
        <div className="hero-main">
          <header className="header"><Mark/><nav aria-label="Основная навигация">{nav}</nav><button className="menu-toggle" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenu(!menu)}>{menu ? 'Закрыть −' : 'Меню +'}</button></header>
          {menu && <nav className="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация">{nav}</nav>}
          <div className="hero-copy"><Label>ДЕТЕЙЛИНГ И АВТОСЕРВИС</Label><h1><BlurReveal>Искусство ухода.<br/>Точность в деталях.</BlurReveal></h1><BlurReveal delay={.12}><p className="hero-description">От зеркального блеска до безупречной работы двигателя.<br/><span>Детейлинг и сервис в одном пространстве.</span></p></BlurReveal><div className="hero-actions"><LiquidButton className="button black" onClick={() => openBooking()}>Записаться</LiquidButton><a className="more" href="#services">Подробнее <Arrow circle/></a></div><p className="schedule">{studio.hours || studio.demoHours}<span>{studio.hours ? '' : 'Демонстрационное расписание'}</span></p></div>
          <div className="hero-photo" role="img" aria-label="Белый Lexus LFA, передняя часть и чёрное колесо на отражающем полу" style={{ backgroundImage: `url(${images.hero})` }}/>
        </div>
        <div className="technology-band" aria-label="Направления ухода">{['ДЕТЕЙЛИНГ','ЗАЩИТА КУЗОВА','ТЕХНИЧЕСКОЕ ОБСЛУЖИВАНИЕ','РЕМОНТ ДВИГАТЕЛЯ'].map((t,i) => <div key={t}><span className="tech-symbol" aria-hidden="true">{['◈','≋','◇','⌁'][i]}</span><span>{t}</span></div>)}</div>
      </div>
    </section>
    <Cinematic/><div className="dark-content">
      <section className="section services wrap" id="services" data-reveal><div className="section-heading"><div><Label>ДЕТЕЙЛИНГ / АВТОСЕРВИС</Label><h2>Всё, что нужно<br/>вашему автомобилю.</h2></div><LiquidButton className="button outline" onClick={() => setPrices(true)}>Все услуги <Arrow/></LiquidButton></div><div className="filter-controls service-filters" role="group" aria-label="Направление услуг">{["Все услуги", "Детейлинг", "Автосервис"].map((name, i) => <button key={name} aria-pressed={serviceFilter === i} onClick={() => setServiceFilter(i)}>{name}<span>{[6,4,2][i]}</span></button>)}</div><div className="service-grid">{services.map((s,i) => (serviceFilter === 0 || (serviceFilter === 1 ? i < 4 : i >= 4)) && <button className="service-card" key={s.id} onClick={() => setService(i)} aria-label={`Подробнее: ${s.title}`}><div className="service-image"><img src={s.image} alt={s.title} loading="lazy" width="640" height="480"/><span className="card-number">0{i+1}</span><span className="service-category">{i < 4 ? "ДЕТЕЙЛИНГ" : "АВТОСЕРВИС"}</span></div><div className="service-copy"><h3>{s.title}</h3><p>{s.description}</p><span className="service-discover">Подробнее об услуге</span><Arrow circle/></div></button>)}</div></section>

      <section className="about section wrap" id="about" data-reveal><div className="about-photo" role="img" aria-label="Белый Lexus LFA в интерьере детейлинг-студии" style={{ backgroundImage: `url(${images.about})` }}/><div className="about-copy"><Label>О СТУДИИ</Label><h2 className="studio-name">VIBERG AUTO</h2><p>Одно пространство для эстетики и технического совершенства. Восстанавливаем глубину цвета, защищаем кузов и заботимся о том, что под капотом. От первого осмотра до финальной проверки — с вниманием к вашему автомобилю.</p><div className="benefits">{['Профессиональный подход','Качественные материалы','Внимание к деталям'].map((b,i) => <div key={b}><Outline type={i}/><span>{b}</span></div>)}</div></div></section>

      <section className="process section wrap" id="process" data-reveal><Label>ПРОЦЕСС РАБОТЫ</Label><h2>Как мы работаем.</h2><ol className="steps">{[['Консультация','Подбираем подходящий комплекс услуг.'],['Выполнение работ','Профессиональный уход за автомобилем.'],['Проверка результата','Контроль качества и финальная доводка.'],['Выдача автомобиля','Передача автомобиля после завершения работ.']].map(([title,copy],i) => <li key={title}><div className="step-line"><span>0{i+1}</span><i/></div><h3>{title}</h3><p>{copy}</p></li>)}</ol></section>
      <Gallery/>
      <section className="booking-section wrap" id="booking" data-reveal><div className="booking-panel"><h2>Запись в студию</h2><p>Выберите услугу и удобное время —<br/>мы подтвердим вашу запись.</p><LiquidButton className="button light" onClick={() => openBooking()}>Записаться <Arrow/></LiquidButton></div></section>
    </div>
  </main><footer id="contacts"><div className="wrap"><div className="footer-top"><Mark/><nav aria-label="Навигация в подвале"><a href="#home">Главная</a><a href="#services">Услуги</a><a href="#portfolio">Портфолио</a><a href="#about">О студии</a><button onClick={() => openBooking()}>Записаться <Arrow/></button></nav></div><div className="contact-row"><div><span>ТЕЛЕФОН</span>{studio.phone ? <a href={`tel:${studio.phone.replace(/[^+\d]/g,'')}`}>{studio.phone}</a> : <p>Будет добавлен</p>}</div><div><span>АДРЕС СТУДИИ</span><p>{studio.address || 'Будет объявлен'}</p></div><div><span>ЧАСЫ РАБОТЫ</span><p>{studio.hours || 'Уточняются перед открытием'}</p></div>{studio.socials.map(s => <a href={s.url} key={s.name} target="_blank" rel="noreferrer">{s.name}</a>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} VIBERG AUTO</span><span>Концепция детейлинг-студии · Демо-сайт</span>{studio.privacyUrl && <a href={studio.privacyUrl}>Политика конфиденциальности</a>}<a href="#home">Наверх ↑</a></div></div></footer>
  {booking !== null && <Booking initial={booking} close={() => setBooking(null)}/>}
  {service !== null && <Modal onClose={() => setService(null)} label={services[service].title}><img className="modal-service-image" src={services[service].image} alt={services[service].title}/><Label>УХОД ЗА АВТОМОБИЛЕМ</Label><h2>{services[service].title}</h2><p className="modal-intro">{services[service].details}</p><ul className="includes">{services[service].includes.map(x => <li key={x}>{x}</li>)}</ul><p className="price">{services[service].price === null ? 'Стоимость уточняется после осмотра' : `от ${services[service].price.toLocaleString('ru-RU')} ₽`}</p><LiquidButton className="button light" onClick={() => openBooking(services[service].title)}>Выбрать услугу <Arrow/></LiquidButton></Modal>}
  {prices && <Modal onClose={() => setPrices(false)} label="Услуги и цены"><Label>УСЛУГИ И ЦЕНЫ</Label><h2>Индивидуальный подход.</h2><p className="modal-intro">Стоимость зависит от состояния и размеров автомобиля. {services.every(s => s.price === null) ? 'Цены для демо пока не настроены.' : 'Окончательная стоимость согласуется после осмотра.'}</p><div className="price-list">{services.map((s,i) => <button key={s.id} onClick={() => { setPrices(false); setService(i) }}><span>{s.title}<small>{s.price === null ? 'По результатам осмотра' : `от ${s.price.toLocaleString('ru-RU')} ₽`}</small></span><Arrow/></button>)}</div></Modal>}

  </>
}

