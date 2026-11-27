
import { useEffect, useRef, useState } from 'react'
import { BlurReveal } from '@/components/ui/blur-reveal'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { Cinematic } from '@/components/Cinematic'
import { Arrow } from '@/components/SectionUI'
import { Directions, Services, type ServiceFilter } from '@/components/Services'
import { Comparison } from '@/components/Comparison'
import { Booking, Calculator, defaultChoice, openExternalBooking, type BookingChoice } from '@/components/EstimateBooking'
import { About, FAQ, PortfolioCases, Process, Reviews } from '@/components/StudioSections'
import { images, studio } from './config'

function Mark() {
  return <a href="#home" className="wordmark" aria-label="VIBERG AUTO — главная"><i/>VIBERG AUTO</a>
}

function Footer() {
  return <footer id="contacts"><div className="wrap">
    <div className="footer-top"><Mark/><nav aria-label="Навигация в подвале">
      <a href="#services">Услуги</a><a href="#portfolio">Портфолио</a><a href="#about">О студии</a><a href="#booking">Запись</a>
    </nav></div>
    <div className="contact-row">
      <div><span>Телефон</span>{studio.phone ? <a href={`tel:${studio.phone.replace(/[^+\d]/g, '')}`}>{studio.phone}</a> : <p>Не указан</p>}</div>
      <div><span>Адрес студии</span><p>{studio.address || 'Не указан'}</p></div>
      <div><span>Часы работы</span><p>{studio.hours || 'Уточняются перед открытием'}</p></div>
      {studio.socials.map(social => <a href={social.url} key={social.name} target="_blank" rel="noreferrer">{social.name}</a>)}
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} VIBERG AUTO</span><span>Демонстрационный сайт</span>
      {studio.privacyUrl && <a href={studio.privacyUrl}>Политика конфиденциальности</a>}<a href="#home">Наверх ↑</a>
    </div>
  </div></footer>
}

const links = [['Услуги', '#services'], ['Цены', '#calculator'], ['О студии', '#about'], ['Контакты', '#contacts']]

export default function App() {
  const [menu, setMenu] = useState(false)
  const [booking, setBooking] = useState<BookingChoice | null>(null)
  const [filter, setFilter] = useState<ServiceFilter>('all')
  const [showMobileBooking, setShowMobileBooking] = useState(false)
  const heroActions = useRef<HTMLDivElement>(null)
  function openBooking(choice: BookingChoice = defaultChoice) {
    if (!openExternalBooking()) setBooking(choice)
  }

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0, rootMargin: '0px 0px -6% 0px' })
    document.querySelectorAll('[data-reveal]').forEach(element => {
      element.classList.add('reveal-pending')
      observer.observe(element)
    })
    const bookingObserver = new IntersectionObserver(([entry]) => {
      setShowMobileBooking(entry.boundingClientRect.bottom < 0)
    })
    if (heroActions.current) bookingObserver.observe(heroActions.current)
    return () => { observer.disconnect(); bookingObserver.disconnect() }
  }, [])

  const nav = links.map(([label, href]) => <a href={href} key={href} onClick={() => setMenu(false)}>{label}</a>)

  return <div className="commercial">
    <a href="#services" className="skip-link">Перейти к содержимому</a>
    <main>
      <section className="hero-stage" id="home" aria-labelledby="hero-title">
        <div className="hero-shell">
          <div className="hero-main">
            <header className="header">
              <Mark/><nav aria-label="Основная навигация">{nav}</nav>
              <button className="menu-toggle" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(!menu)}>{menu ? 'Закрыть −' : 'Меню +'}</button>
            </header>
            {menu && <nav className="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация">{nav}</nav>}
            <div className="hero-copy">
              <h1 id="hero-title"><BlurReveal className="offer-line">Детейлинг и автосервис</BlurReveal></h1>
              <p className="hero-description">Восстанавливаем блеск. Защищаем кузов. Обслуживаем автомобиль</p>
              <div className="hero-actions" ref={heroActions}>
                <LiquidButton className="button black" onClick={() => openBooking()}>Записаться на услугу <Arrow/></LiquidButton>
                <LiquidButton asChild variant="outline" className="hero-estimate"><a href="#calculator">Узнать стоимость</a></LiquidButton>
              </div>
            </div>
            <div className="hero-photo" role="img" aria-label="Белый Lexus LFA в студийном свете" style={{ backgroundImage: `url(${images.hero})` }}/>
          </div>
        </div>
      </section>
      <div className="dark-content">
        <Directions choose={setFilter}/>
        <Services filter={filter} choose={setFilter} book={serviceId => openBooking({ ...defaultChoice, serviceId })}/>
        <Cinematic/>
        <Comparison/>
        <Calculator book={openBooking}/>
        <About/>
        <Process/>
        <PortfolioCases/>
        <Reviews/>
        <FAQ/>
        <section className="booking-section wrap" id="booking" data-reveal>
          <div className="booking-panel">
            <h2>Запись в студию</h2><p>Выберите услугу и укажите автомобиль.{!studio.bookingUrl && ' В демо можно посмотреть, как будет выглядеть заявка.'}</p>
            <LiquidButton className="button light" onClick={() => openBooking()}>Записаться на услугу <Arrow/></LiquidButton>
          </div>
        </section>
      </div>
    </main>
    <Footer/>
    {showMobileBooking && <div className="mobile-booking"><LiquidButton className="button light" onClick={() => openBooking()}>Записаться на услугу <Arrow/></LiquidButton></div>}
    {booking && <Booking initial={booking} close={() => setBooking(null)}/>}
  </div>
}
