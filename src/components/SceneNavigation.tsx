import { Link } from 'react-router-dom'
import { scenes, type Scene } from '../data/scenes'

export function SceneNavigation({ current, onMore, onSceneSelect }: { current: string; onMore: () => void; onSceneSelect: (sceneId: Scene['id']) => void }) {
  return <nav className="scene-nav" aria-label="Memory scenes">
    {scenes.map(scene => <Link key={scene.id} to={scene.slug} className={current === scene.id ? 'active' : ''} onClick={() => onSceneSelect(scene.id)}><span>{scene.navLabel}</span></Link>)}
    <button onClick={onMore}>More <span aria-hidden="true">＋</span></button>
  </nav>
}
