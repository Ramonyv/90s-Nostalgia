import type { Hotspot } from '../data/scenes'

export function SceneHotspot({ hotspot, onActivate }: { hotspot: Hotspot; onActivate?: (action: Hotspot['action']) => void }) {
  return <button className={`hotspot ${hotspot.align === 'right' ? 'hotspot--right' : ''} ${hotspot.action ? 'hotspot--action' : ''}`} style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }} aria-label={hotspot.label} onClick={() => hotspot.action && onActivate?.(hotspot.action)}>
    <span className="hotspot__pulse" /><span className="hotspot__label">{hotspot.label}</span>
  </button>
}
