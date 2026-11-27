
export const pricing = {
  demonstration: true,
  services: {
    wash: { from: 3500, duration: '2–3 часа' },
    polishing: { from: 18000, duration: '1–2 дня' },
    interior: { from: 12000, duration: '6–10 часов' },
    ceramic: { from: 22000, duration: '1–2 дня' },
    ppf: { from: 28000, duration: '1–3 дня' },
    headlights: { from: 5000, duration: '2–3 часа' },
    diagnostics: { from: 3000, duration: '1–2 часа' },
    maintenance: { from: 8500, duration: '2–4 часа' },
    oil: { from: 4500, duration: '1–2 часа' },
    engine: { from: 25000, duration: 'от 2 дней' },
    suspension: { from: 6500, duration: '2–5 часов' },
  },
  vehicleClasses: {
    compact: { label: 'Компактный автомобиль', factor: 1 },
    midsize: { label: 'Седан / купе / универсал', factor: 1.15 },
    crossover: { label: 'Кроссовер', factor: 1.3 },
    large: { label: 'Крупный SUV / минивэн', factor: 1.5 },
  },
} as const

export type ServiceId = keyof typeof pricing.services
export type VehicleClass = keyof typeof pricing.vehicleClasses
export const vehicleClasses = Object.keys(pricing.vehicleClasses) as VehicleClass[]

export function quote(serviceId: ServiceId, vehicleClass: VehicleClass, extras: readonly ServiceId[] = []) {
  const unique = new Set([serviceId, ...extras])
  const subtotal = [...unique].reduce((sum, id) => sum + pricing.services[id].from, 0)
  return Math.ceil(subtotal * pricing.vehicleClasses[vehicleClass].factor / 100) * 100
}

const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
export const money = (amount: number) => rubles.format(amount)
