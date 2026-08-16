import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { scenes, type Scene } from '../data/scenes'
import { trackEvent } from '../lib/analytics'

export function MemoryNavigator({ current, onMore, onSceneSelect }: { current: Scene['id']; onMore: () => void; onSceneSelect: (sceneId: Scene['id']) => void }) {
  const activeScenes = scenes.filter(scene => scene.availability === 'active')
  const currentIndex = Math.max(0, activeScenes.findIndex(scene => scene.id === current))
  const previous = activeScenes[(currentIndex - 1 + activeScenes.length) % activeScenes.length]
  const next = activeScenes[(currentIndex + 1) % activeScenes.length]

  return <nav className="memory-navigator" aria-label="Memory navigation">
    <Link className="memory-navigator__direction memory-navigator__direction--previous" to={previous.slug} onClick={() => { trackEvent('memory_explore', { from_scene: current, to_scene: previous.id, method: 'previous' }); onSceneSelect(previous.id) }} aria-label={`Previous memory: ${previous.title}`}>
      <ArrowLeft size={16} /><span><small>Previous memory</small><strong>{previous.title}</strong></span>
    </Link>
    <button className="memory-navigator__index" type="button" onClick={() => { trackEvent('memory_explore', { scene_id: current, method: 'all_memories' }); onMore() }} aria-label={`Open all memories. Memory ${currentIndex + 1} of ${activeScenes.length}`}>
      <span className="memory-navigator__reel" aria-hidden="true">{activeScenes.map((scene, index) => <i className={index === currentIndex ? 'is-current' : ''} key={scene.id} />)}</span>
      <strong>{String(currentIndex + 1).padStart(2, '0')} / {String(activeScenes.length).padStart(2, '0')}</strong><small>All memories</small>
    </button>
    <Link className="memory-navigator__direction memory-navigator__direction--next" to={next.slug} onClick={() => { trackEvent('memory_explore', { from_scene: current, to_scene: next.id, method: 'next' }); onSceneSelect(next.id) }} aria-label={`Next memory: ${next.title}`}>
      <span><small>Next memory</small><strong>{next.title}</strong></span><ArrowRight size={16} />
    </Link>
  </nav>
}
