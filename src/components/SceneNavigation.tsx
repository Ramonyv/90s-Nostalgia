import { Link } from 'react-router-dom'
import { scenes } from '../data/scenes'

export function SceneNavigation({ current, onMore, onSceneSelect }: { current: string; onMore: () => void; onSceneSelect: (index: number) => void }) {
  return <nav className="scene-nav" aria-label="Memory scenes">
    {scenes.map((scene, index) => <Link key={scene.id} to={scene.slug} className={current === scene.id ? 'active' : ''} onClick={() => onSceneSelect(index)}><span>{scene.navLabel}</span></Link>)}
    <button onClick={onMore}>More <span aria-hidden="true">＋</span></button>
  </nav>
}
