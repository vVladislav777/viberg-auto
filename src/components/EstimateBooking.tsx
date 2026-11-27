
import { useState, type FormEvent } from 'react'
import { catalog, directionIds, directions, extraIds, serviceById, type Direction } from '@/catalog'
import { studio } from '@/config'
import { money, pricing, quote, serviceAmount, vehicleClasses, type ServiceId, type VehicleClass } from '@/pricing'
import { Arrow, Label } from './SectionUI'
import { LiquidButton } from './ui/liquid-glass-button'
import { Modal } from './ui/modal'

export type BookingChoice = {
  vehicle: string
  vehicleClass: VehicleClass
  serviceId: ServiceId
  extras: ServiceId[]
}

export const defaultChoice: BookingChoice = { vehicle: '', vehicleClass: 'compact', serviceId: 'wash', extras: [] }

function Classes({ value, change }: { value: VehicleClass; change: (id: VehicleClass) => void }) {
  return <label>Класс автомобиля<select name="class" value={value} onChange={event => change(event.target.value as VehicleClass)}>
    {vehicleClasses.map(id => <option value={id} key={id}>{pricing.vehicleClasses[id].label}</option>)}
  </select></label>
}

const vehicleProfiles: Record<VehicleClass, string> = {
  compact: 'M7 29v-6l6-2 7-8h21l8 9 7 2v5h-8m-31 0H7m37 0H23',
  midsize: 'M5 29v-5l9-3 11-9h19l9 8 9 2v7h-9m-34 0H5m40 0H24',
  crossover: 'M5 29v-9l9-1 7-10h25l10 10 6 3v7h-9m-34 0H5m40 0H24',
  large: 'M4 29V12l9-2 9-4h29l6 11 5 3v9h-9m-34 0H4m41 0H24',
}
const classLabels: Record<VehicleClass, string> = {
  compact: 'Компактный', midsize: 'Седан / купе', crossover: 'Кроссовер', large: 'SUV / минивэн',
}

function ClassPicker({ value, change }: { value: VehicleClass; change: (id: VehicleClass) => void }) {
  return <fieldset className="vehicle-classes">
    <legend>Класс автомобиля</legend>
    <div className="vehicle-options">
      {vehicleClasses.map(id => <label key={id}>
        <input type="radio" name="class" value={id} checked={value === id} onChange={() => change(id)} aria-label={pricing.vehicleClasses[id].label}/>
        <span className="vehicle-option">
          <svg viewBox="0 0 68 40" width="68" height="40" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={vehicleProfiles[id]}/>
            <circle cx={id === 'compact' ? 20 : 21.5} cy="29" r="4"/><circle cx={id === 'compact' ? 46 : 49} cy="29" r="4"/>
          </svg>
          <span>{classLabels[id]}</span>
        </span>
      </label>)}
    </div>
  </fieldset>
}

export function Calculator({ book }: { book: (choice: BookingChoice) => void }) {
  const [choice, setChoice] = useState<BookingChoice>(defaultChoice)
  const total = quote(choice.serviceId, choice.vehicleClass, choice.extras)
  const main = serviceAmount(choice.serviceId, choice.vehicleClass)
  const additional = choice.extras.reduce((sum, id) => sum + serviceAmount(id, choice.vehicleClass), 0)
  const rounding = total - main - additional
  return <section className="calculator section" id="calculator" aria-labelledby="calculator-title" data-reveal>
    <div className="wrap calculator-layout">
      <div className="calculator-intro">
        <Label>ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ</Label><h2 id="calculator-title">Сколько стоит работа?</h2>
        <p>Выберите автомобиль и услуги. Состав работ и итоговую стоимость согласуем после осмотра.</p>
        <aside className="estimate-total">
          <span>Предварительная стоимость</span>
          <output aria-live="polite" aria-atomic="true"><strong key={total}>от {money(total)}</strong></output>
          {pricing.demonstration && <small>Расчёт по демонстрационному прайсу</small>}
          <dl className="estimate-breakdown">
            <div><dt>Основная услуга<span>{serviceById(choice.serviceId).title}</span></dt><dd>{money(main)}</dd></div>
            <div><dt>Дополнительные услуги{choice.extras.length > 0 && <span>{choice.extras.map(id => serviceById(id).title).join(', ')}</span>}</dt><dd>{additional ? money(additional) : '—'}</dd></div>
            {rounding !== 0 && <div className="estimate-rounding"><dt>Округление итога</dt><dd>{money(rounding)}</dd></div>}
          </dl>
        </aside>
      </div>
      <form className="calculator-form" onSubmit={event => { event.preventDefault(); book({ ...choice, vehicle: choice.vehicle.trim() }) }}>
        <label>Марка и модель<input name="vehicle" value={choice.vehicle} onChange={event => setChoice({ ...choice, vehicle: event.target.value })} placeholder="Например, Lexus RX" required pattern=".*\S.*" maxLength={100}/></label>
        <ClassPicker value={choice.vehicleClass} change={vehicleClass => setChoice({ ...choice, vehicleClass })}/>
        <label>Основная услуга<select name="service" value={choice.serviceId} onChange={event => {
          const serviceId = event.target.value as ServiceId
          setChoice({ ...choice, serviceId, extras: choice.extras.filter(id => id !== serviceId) })
        }}>
          {directionIds.map(id => <optgroup key={id} label={directions[id].title}>{catalog.filter(item => item.direction === id).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>)}
        </select></label>
        <fieldset className="extras"><legend>Дополнительно</legend>
          {extraIds.filter(id => id !== choice.serviceId).map(id => <label key={id}>
            <input type="checkbox" checked={choice.extras.includes(id)} onChange={event => setChoice({
              ...choice, extras: event.target.checked ? [...choice.extras, id] : choice.extras.filter(item => item !== id),
            })}/><span>{serviceById(id).title}</span><small>от {money(serviceAmount(id, choice.vehicleClass))}</small>
          </label>)}
        </fieldset>
        <LiquidButton type="submit" className="button light">Перейти к записи <Arrow/></LiquidButton>
      </form>
    </div>
  </section>
}

export function Booking({ initial, close }: { initial: BookingChoice; close: () => void }) {
  const [choice, setChoice] = useState(initial)
  const [contact, setContact] = useState({ name: '', phone: '', date: '' })
  const [summary, setSummary] = useState(false)
  const direction = serviceById(choice.serviceId).direction
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow' }).format(new Date())
  const total = quote(choice.serviceId, choice.vehicleClass, choice.extras)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSummary(true)
  }
  function setService(serviceId: ServiceId) {
    setChoice({ ...choice, serviceId, extras: choice.extras.filter(id => id !== serviceId) })
  }
  return <Modal onClose={close} label="Запись на услугу" className="booking-dialog">
    <Label>ОНЛАЙН-ЗАПИСЬ · ДЕМО</Label><h2>Запись в студию</h2>
    {summary ? <div className="booking-result" role="status">
      <h3>Проверьте данные</h3>
      <dl className="detail-list">
        <div><dt>Автомобиль</dt><dd>{choice.vehicle.trim()} · {pricing.vehicleClasses[choice.vehicleClass].label}</dd></div>
        <div><dt>Услуги</dt><dd>{[choice.serviceId, ...choice.extras].map(id => serviceById(id).title).join(', ')}</dd></div>
        {contact.date && <div><dt>Желаемая дата</dt><dd>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date(contact.date + 'T12:00:00'))}</dd></div>}
        <div><dt>Контакт</dt><dd>{contact.name.trim()} · {contact.phone.trim()}</dd></div>
        <div><dt>Предварительная стоимость</dt><dd>от {money(total)}</dd></div>
      </dl>
      <p className="notice">Это предпросмотр. Данные не отправлены, время не забронировано.</p>
      <LiquidButton type="button" className="button light" onClick={() => setSummary(false)}>Изменить данные <Arrow/></LiquidButton>
    </div> : <>
      <p className="modal-intro">Заполните форму, чтобы посмотреть итог заявки. Демо не отправляет данные и не показывает свободные слоты. Для проверки можно указать тестовый контакт.</p>
      <form onSubmit={submit} className="booking-form">
        <div className="form-row">
          <label>Направление<select name="direction" value={direction} onChange={event => {
            const next = event.target.value as Direction
            setService(catalog.find(item => item.direction === next)!.id)
          }}>{directionIds.map(id => <option key={id} value={id}>{directions[id].title}</option>)}</select></label>
          <label>Услуга<select name="service" value={choice.serviceId} onChange={event => setService(event.target.value as ServiceId)}>
            {catalog.filter(item => item.direction === direction).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select></label>
        </div>
        <label>Марка и модель<input name="vehicle" value={choice.vehicle} onChange={event => setChoice({ ...choice, vehicle: event.target.value })} required pattern=".*\S.*" maxLength={100} placeholder="Например, Lexus RX"/></label>
        <Classes value={choice.vehicleClass} change={vehicleClass => setChoice({ ...choice, vehicleClass })}/>
        {choice.extras.length > 0 && <fieldset className="extras"><legend>Дополнительные услуги из расчёта</legend>
          {choice.extras.map(id => <label key={id}><input type="checkbox" checked onChange={() => setChoice({ ...choice, extras: choice.extras.filter(item => item !== id) })}/>{serviceById(id).title}</label>)}
        </fieldset>}
        <label>Желаемая дата <small>Необязательно</small><input name="date" type="date" min={today} value={contact.date} onChange={event => setContact({ ...contact, date: event.target.value })}/></label>
        <div className="form-row">
          <label>Имя<input name="name" autoComplete="name" value={contact.name} onChange={event => setContact({ ...contact, name: event.target.value })} required pattern=".*\S.*" maxLength={80}/></label>
          <label>Телефон<input name="phone" type="tel" autoComplete="tel" placeholder="+7 900 000-00-00" value={contact.phone} onChange={event => {
            const { value } = event.target
            const digits = value.replace(/\D/g, '').length
            const valid = /^[+0-9 ()-]+$/.test(value) && digits >= 7 && digits <= 15
            event.target.setCustomValidity(!value || valid ? '' : 'Введите корректный номер телефона, от 7 до 15 цифр.')
            setContact({ ...contact, phone: value })
          }} required maxLength={22}/></label>
        </div>
        <p className="section-note">Предварительно от {money(total)}{pricing.demonstration && ' · Демо-прайс'}</p>
        <LiquidButton type="submit" className="button light">Посмотреть заявку <Arrow/></LiquidButton>
      </form>
    </>}
  </Modal>
}

export function openExternalBooking() {
  if (!studio.bookingUrl) return false
  window.location.assign(studio.bookingUrl)
  return true
}
