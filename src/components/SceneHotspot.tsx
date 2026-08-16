import type { Hotspot } from '../data/scenes'
import { trackEvent } from '../lib/analytics'

export function SceneHotspot({ hotspot, onActivate }: { hotspot: Hotspot; onActivate?: (action: Hotspot['action']) => void }) {
  return <button className={`hotspot ${hotspot.align === 'right' ? 'hotspot--right' : ''} ${hotspot.action ? 'hotspot--action' : ''}`} style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }} aria-label={hotspot.label} onClick={() => { trackEvent('memory_explore', { method: 'hotspot', hotspot_action: hotspot.action || 'memory_note', hotspot_label: hotspot.label.slice(0, 100) }); if (hotspot.action) onActivate?.(hotspot.action) }}>
    <span className="hotspot__pulse" /><span className="hotspot__label">{hotspot.label}</span>
  </button>
}
