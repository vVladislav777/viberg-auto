
import { images, services as originalServices } from './config'
import type { ServiceId } from './pricing'

export type Direction = 'detailing' | 'service'
export const directions = {
  detailing: { title: 'Детейлинг', subtitle: 'Эстетика и защита', image: images.wash, highlights: ['Полировка кузова', 'Химчистка салона', 'Керамическое покрытие', 'Защитная оклейка', 'Детейлинг-мойка'] },
  service: { title: 'Автосервис', subtitle: 'Точность и надёжность', image: images.lift, highlights: ['Компьютерная диагностика', 'Техническое обслуживание', 'Замена масла и фильтров', 'Ремонт двигателя', 'Обслуживание подвески'] },
} as const
export const directionIds = Object.keys(directions) as Direction[]

const root = import.meta.env.BASE_URL + 'images/viberg-auto/'
export const comparisonImages = {
  headlightBefore: root + 'headlight-before.jpg',
  headlightAfter: root + 'headlight-after.jpg',
  interiorBefore: root + 'interior-before.jpg',
  interiorAfter: root + 'interior-after.jpg',
  paintBefore: root + 'paint-before.jpg',
  paintAfter: root + 'paint-after.jpg',
}

const servicePhotos = {
  polishing: comparisonImages.paintAfter,
  oil: root + 'service-oil-change.jpg',
  maintenance: root + 'service-scheduled-maintenance.jpg',
  diagnostics: root + 'service-computer-diagnostics.jpg',
}

type Service = {
  id: ServiceId
  direction: Direction
  title: string
  image: string
  description: string
  problem: string
  details: string
  includes: string[]
  factors: string
}

const details = {
  wash: ['Дорожная плёнка, грязь на дисках и в труднодоступных местах.', 'Размер автомобиля, степень загрязнения и выбранные зоны ухода.'],
  polishing: ['Паутинка от моек, потёртости и тусклые отражения.', 'Площадь кузова, глубина дефектов и число этапов коррекции.'],
  ceramic: ['Кузов быстро загрязняется, на поверхности задерживается вода.', 'Подготовка кузова, состав и количество слоёв.'],
  ppf: ['Сколы и следы песка на передней части кузова и других уязвимых деталях.', 'Площадь оклейки, геометрия деталей и вид плёнки.'],
  oil: ['Подошёл срок замены масла и фильтров по регламенту.', 'Допуск и объём масла, тип фильтров, доступ к узлам и расходники.'],
  engine: ['Нестабильная работа, посторонний шум, расход масла или потеря мощности.', 'Причина неисправности, объём разборки, детали и расходники.'],
} satisfies Partial<Record<ServiceId, [string, string]>>

export const catalog: Service[] = [
  ...originalServices.map(item => {
    const { id } = item
    const [problem, factors] = details[id]
    return {
      ...item, id, direction: id === 'oil' || id === 'engine' ? 'service' as const : 'detailing' as const,
      image: id === 'polishing' || id === 'oil' ? servicePhotos[id] : item.image,
      title: id === 'oil' ? 'Замена масла и фильтров' : item.title,
      description: id === 'oil' ? 'Свежее масло по допуску производителя и новые фильтры по регламенту.' : item.description,
      problem, factors,
    }
  }),
  { id: 'interior', direction: 'detailing', title: 'Химчистка салона', image: comparisonImages.interiorAfter,
    description: 'Чистые сиденья, ковролин и панели с сохранением фактуры материалов.', problem: 'Пятна на обивке, въевшаяся пыль и загрязнения в швах.',
    details: 'Осматриваем салон, подбираем составы под материалы, очищаем поверхности по зонам и сушим салон.',
    includes: ['Очистка сидений и ковролина', 'Уход за панелями и кожей', 'Сушка и осмотр'], factors: 'Количество рядов сидений, материалы и степень загрязнения.' },
  { id: 'headlights', direction: 'detailing', title: 'Восстановление фар', image: comparisonImages.headlightAfter,
    description: 'Более прозрачная внешняя поверхность рассеивателей.', problem: 'Помутнение и мелкие царапины на пластике фар.',
    details: 'Проверяем, где возникло помутнение. При поверхностном дефекте защищаем кузов, полируем пластик и наносим защитный состав.',
    includes: ['Осмотр оптики', 'Коррекция внешней поверхности', 'Защита рассеивателей'], factors: 'Состояние пластика, количество фар и выбранная защита.' },
  { id: 'diagnostics', direction: 'service', title: 'Компьютерная диагностика', image: servicePhotos.diagnostics,
    description: 'Понимание причины ошибки и список следующих проверок.', problem: 'Индикаторы на панели или сбои в работе систем.',
    details: 'Уточняем симптомы, считываем ошибки и параметры работы, сопоставляем показания с жалобой.',
    includes: ['Чтение кодов ошибок', 'Проверка параметров', 'Объяснение результатов'], factors: 'Марка, количество систем и необходимость дополнительных измерений.' },
  { id: 'maintenance', direction: 'service', title: 'Техническое обслуживание', image: servicePhotos.maintenance,
    description: 'Плановые работы по регламенту с понятным перечнем замен.', problem: 'Приближается плановое ТО или история обслуживания неизвестна.',
    details: 'Сверяем пробег и регламент, согласуем перечень работ и проверяем состояние основных узлов.',
    includes: ['Подбор регламентных операций', 'Замена согласованных расходников', 'Осмотр автомобиля'], factors: 'Интервал ТО, комплектация, список деталей и расходников.' },
  { id: 'suspension', direction: 'service', title: 'Обслуживание подвески', image: images.lift,
    description: 'Определяем причину стука и согласуем ремонт изношенных узлов.', problem: 'Шумы на неровностях, люфт или неравномерный износ шин.',
    details: 'Осматриваем ходовую на подъёмнике, проверяем шарниры, сайлентблоки и амортизаторы, согласуем нужные замены.',
    includes: ['Осмотр ходовой', 'Проверка люфтов', 'Замена согласованных деталей'], factors: 'Найденные дефекты, конструкция подвески и стоимость деталей.' },
]

export const serviceById = (id: ServiceId) => catalog.find(item => item.id === id)!
export const extraIds = ['wash', 'interior', 'headlights', 'diagnostics'] as const
