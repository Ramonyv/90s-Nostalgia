import { Link } from 'react-router-dom'
import { scenes } from '../data/scenes'

export function SceneNavigation({ current, onMore }: { current: string; onMore: () => void }) {
  return <nav className="scene-nav" aria-label="Memory scenes">
    {scenes.map(scene => <Link key={scene.id} to={scene.slug} className={current === scene.id ? 'active' : ''}><span>{scene.navLabel}</span></Link>)}
    <button onClick={onMore}>More <span aria-hidden="true">＋</span></button>
  </nav>
}
