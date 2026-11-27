const base = import.meta.env.BASE_URL + 'images/viberg-auto/'
export const images = {
  hero: base + 'lfa-hero-hq.png', studio: base + 'lfa-studio-hq.png', about: base + '01_lexus_outside_service.webp', engine: base + '02_lexus_hood_open.webp', lift: base + '03_lexus_on_lift.webp',
  wash: base + '04_lexus_car_wash.webp', polishing: base + 'service-paint-polishing.webp', ceramic: base + 'service-ceramic-coating.webp', ppf: base + 'service-ppf-film.webp',
  grille: base + 'portfolio-lexus-grille.webp', mirror: base + 'portfolio-carbon-mirror.webp', rear: base + 'portfolio-lfa-rear.webp', wheel: base + 'portfolio-lfa-wheel.webp',
}
export const studio = {
  name: 'VIBERG AUTO', phone: '', address: '', hours: '',
  demoHours: 'Ежедневно: 09:00 — 21:00',
  bookingUrl: '', privacyUrl: '', socials: [] as { name: string; url: string }[],
}
export const services = [
  { id: 'wash' as const, title: 'Детейлинг-мойка', description: 'Бережная очистка кузова, колёс и салона.', image: images.wash, details: 'Многоэтапная очистка кузова, деликатная работа с дисками и труднодоступными участками. Состав и объём ухода подбираются после осмотра автомобиля.', includes: ['Предварительная очистка', 'Ручная мойка кузова и дисков', 'Деликатная сушка и уход за салоном'] },
  { id: 'polishing' as const, title: 'Полировка кузова', description: 'Восстановление глубины цвета и зеркального блеска.', image: images.polishing, details: 'Оценка состояния лакокрасочного покрытия и подбор подходящей степени коррекции. Работаем с поверхностью последовательно, уделяя внимание каждой детали.', includes: ['Осмотр и оценка покрытия', 'Подбор системы полировки', 'Финишная доводка поверхности'] },
  { id: 'ceramic' as const, title: 'Керамическая защита', description: 'Долговременная защита и гидрофобный эффект.', image: images.ceramic, details: 'Подготовка и нанесение защитного состава для облегчения дальнейшего ухода. Тип покрытия, количество слоёв и сроки выдержки согласуются индивидуально.', includes: ['Подготовка и обезжиривание', 'Нанесение защитного состава', 'Рекомендации по дальнейшему уходу'] },
  { id: 'ppf' as const, title: 'Оклейка плёнкой PPF', description: 'Защита от сколов, царапин и внешних воздействий.', image: images.ppf, details: 'Прозрачная защитная плёнка для наиболее уязвимых элементов или всего кузова. Сохраняет внешний вид автомобиля и принимает на себя повседневные воздействия.', includes: ['Подбор зон защиты', 'Подготовка поверхности и оклейка', 'Проверка краёв и прилегания'] },
  { id: 'oil' as const, title: 'Замена масла и ТО', description: 'Забота о ресурсе двигателя. Масло, фильтры и плановое обслуживание.', image: images.lift, details: 'Подбираем масло и расходные материалы по допускам производителя. Перед началом согласуем перечень работ, проверим состояние автомобиля и рекомендации по обслуживанию.', includes: ['Подбор масла и фильтров по допускам', 'Замена масла и расходных материалов', 'Проверка технических жидкостей'] },
  { id: 'engine' as const, title: 'Ремонт двигателя', description: 'От диагностики до восстановления. Внимание к каждому механизму.', image: images.engine, details: 'Начинаем с диагностики и поиска причины неисправности. После дефектовки согласуем объём ремонта, перечень деталей и стоимость. Завершаем работу проверкой двигателя.', includes: ['Диагностика и дефектовка', 'Согласование ремонта и деталей', 'Восстановление и проверка работы'] },
]
export const gallery = [
  { image: images.studio, alt: 'Lexus LFA в студийном свете' },
  { image: images.about, alt: 'Lexus LFA у VIBERG AUTO' },
  { image: images.engine, alt: 'Lexus LFA с открытым капотом в сервисе' },
  { image: images.wash, alt: 'Деликатная мойка белого Lexus LFA' },
  { image: images.grille, alt: 'Деталь решётки Lexus в мягком студийном свете' },
  { image: images.mirror, alt: 'Карбоновое зеркало Lexus LFA' },
  { image: images.rear, alt: 'Задний фонарь и белый кузов Lexus LFA' },
  { image: images.wheel, alt: 'Чёрный диск и тормозная система Lexus LFA' },
]
