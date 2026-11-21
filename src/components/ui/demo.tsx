import { BlurReveal } from './blur-reveal'
export default function BlurRevealDemo() {
  return <div className="flex max-w-lg flex-col gap-2"><h2 className="text-3xl font-light"><BlurReveal>Внимание к каждой детали.</BlurReveal></h2><BlurReveal delay={.2}>Детейлинг, защита и восстановление.</BlurReveal></div>
}
