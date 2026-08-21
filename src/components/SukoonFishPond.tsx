import { useEffect, useRef } from 'react'

type FishState = {
  x: number
  y: number
  angle: number
  speed: number
  phase: number
  curiousUntil: number
}

const fishSeeds: FishState[] = [
  { x: .62, y: .37, angle: 2.7, speed: .020, phase: .2, curiousUntil: 0 },
  { x: .47, y: .43, angle: .55, speed: .017, phase: 1.4, curiousUntil: 0 },
  { x: .68, y: .55, angle: -2.5, speed: .018, phase: 2.2, curiousUntil: 0 },
  { x: .38, y: .57, angle: -.32, speed: .021, phase: 3.6, curiousUntil: 0 },
  { x: .53, y: .66, angle: -2.8, speed: .016, phase: 4.5, curiousUntil: 0 },
  { x: .43, y: .31, angle: 1.1, speed: .019, phase: 5.7, curiousUntil: 0 },
]

export function SukoonFishPond() {
  const layerRef = useRef<HTMLDivElement>(null)
  const fishRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const layer = layerRef.current
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fish = fishSeeds.map(item => ({ ...item }))
    const pointer = { x: .5, y: .5, activeUntil: 0 }
    let frame = 0
    let lastFrame = performance.now()
    let lastCuriosity = 0
    let running = !document.hidden

    const handlePointer = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest('button,a,input,[role="dialog"]')) return
      const rect = layer.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      pointer.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
      pointer.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
      const now = performance.now()
      pointer.activeUntil = now + (event.type === 'pointerdown' ? 2400 : 1350)
      if (now - lastCuriosity < 420) return
      lastCuriosity = now
      fish
        .map((item, index) => ({ index, distance: Math.hypot(item.x - pointer.x, item.y - pointer.y) }))
        .filter(item => item.distance < .38)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, event.type === 'pointerdown' ? 2 : 1)
        .forEach(({ index }, rank) => { fish[index].curiousUntil = now + 1100 + rank * 480 })
    }

    const render = (now: number) => {
      if (!running) return
      const dt = Math.min(.034, (now - lastFrame) / 1000)
      lastFrame = now
      fish.forEach((item, index) => {
        const curious = now < item.curiousUntil && now < pointer.activeUntil
        if (curious) {
          const target = Math.atan2(pointer.y - item.y, pointer.x - item.x)
          const delta = Math.atan2(Math.sin(target - item.angle), Math.cos(target - item.angle))
          item.angle += delta * dt * 1.45
        } else {
          item.angle += Math.sin(now * .00045 + item.phase) * dt * .22
          if (item.x < .27 || item.x > .73 || item.y < .24 || item.y > .76) {
            const centerAngle = Math.atan2(.5 - item.y, .5 - item.x)
            const centerDelta = Math.atan2(Math.sin(centerAngle - item.angle), Math.cos(centerAngle - item.angle))
            item.angle += centerDelta * dt * .42
          }
        }
        const edge = .09
        if (item.x < edge) item.angle += Math.sin(0 - item.angle) * dt * 1.8
        if (item.x > 1 - edge) item.angle += Math.sin(Math.PI - item.angle) * dt * 1.8
        if (item.y < edge) item.angle += Math.sin(Math.PI / 2 - item.angle) * dt * 1.8
        if (item.y > 1 - edge) item.angle += Math.sin(-Math.PI / 2 - item.angle) * dt * 1.8
        const speed = item.speed * (curious ? 1.28 : 1)
        item.x = Math.max(.035, Math.min(.965, item.x + Math.cos(item.angle) * speed * dt))
        item.y = Math.max(.05, Math.min(.95, item.y + Math.sin(item.angle) * speed * dt))
        const node = fishRefs.current[index]
        if (node) {
          node.style.left = `${item.x * 100}%`
          node.style.top = `${item.y * 100}%`
          node.style.transform = `translate(-50%,-50%) rotate(${item.angle}rad)`
        }
      })
      frame = requestAnimationFrame(render)
    }

    const visibility = () => {
      running = !document.hidden
      cancelAnimationFrame(frame)
      if (running) { lastFrame = performance.now(); frame = requestAnimationFrame(render) }
    }
    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('pointerdown', handlePointer, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    frame = requestAnimationFrame(render)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  return <div ref={layerRef} className="sukoon-fish-layer" aria-hidden="true">
    {fishSeeds.map((fish, index) => <span
      key={index}
      ref={node => { fishRefs.current[index] = node }}
      className={`sukoon-fish sukoon-fish--${index + 1}`}
      style={{ left: `${fish.x * 100}%`, top: `${fish.y * 100}%`, transform: `translate(-50%,-50%) rotate(${fish.angle}rad)` }}
    />)}
  </div>
}
