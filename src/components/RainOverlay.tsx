import type { CSSProperties } from 'react'
import type { RainRipple } from '../data/scenes'

type RainOverlayProps = {
  intensity?: 'light' | 'medium' | 'heavy'
  opacity?: number
  angle?: number
  speed?: number
  ripples?: RainRipple[]
}

export function RainOverlay({ intensity = 'medium', opacity = .55, angle = -7, speed = 1, ripples = [] }: RainOverlayProps) {
  const style = {
    '--rain-opacity': opacity,
    '--rain-angle': `${angle}deg`,
    '--rain-speed': speed,
  } as CSSProperties

  return <div className="rain-overlay" data-intensity={intensity} style={style} aria-hidden="true">
    <i className="rain-overlay__layer rain-overlay__layer--far" />
    <i className="rain-overlay__layer rain-overlay__layer--mid" />
    <i className="rain-overlay__layer rain-overlay__layer--near" />
    <div className="rain-overlay__ripples">
      {ripples.map((ripple, index) => <span key={index} style={{ left: `${ripple.x}%`, top: `${ripple.y}%`, width: ripple.width, '--ripple-width': `${ripple.width}px`, animationDelay: `${ripple.delay ?? index * .55}s` } as CSSProperties} />)}
    </div>
  </div>
}
