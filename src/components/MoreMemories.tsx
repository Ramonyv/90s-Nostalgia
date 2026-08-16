import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, X } from 'lucide-react'
import { scenes, type Scene } from '../data/scenes'
import { trackEvent } from '../lib/analytics'

export function MoreMemories({ open, onClose, onSceneSelect }: { open: boolean; onClose: () => void; onSceneSelect: (sceneId: Scene['id']) => void }) {
  return <AnimatePresence>{open && <motion.div className="memories-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button className="close-overlay" onClick={onClose} aria-label="Close memories"><X /></button>
    <div className="memories-inner"><p className="eyebrow">Yaadon ka pitara</p><h2>Where should we go next?</h2>
      <div className="memory-list">
        {scenes.filter(scene => scene.availability === 'active').map((scene, i) => <motion.div key={scene.id} style={{ '--memory-accent': scene.accentColor } as React.CSSProperties} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + i * .035 }}><Link to={scene.slug} onClick={() => { trackEvent('memory_explore', { to_scene: scene.id, method: 'scene_selector' }); onSceneSelect(scene.id); onClose() }}><span>{String(i + 1).padStart(2, '0')}</span><strong>{scene.title}<small>{scene.shortLine}</small></strong><em>{scene.year}</em><ArrowUpRight size={14} /></Link></motion.div>)}
      </div>
      <nav className="memories-overlay__archive" aria-label="Archive pages"><Link to="/memories" onClick={onClose}>Memories index</Link><Link to="/journal" onClick={() => { trackEvent('scene_to_blog_click', { destination: '/journal', source: 'scene_selector' }); onClose() }}>Journal</Link><Link to="/about" onClick={onClose}>About</Link></nav>
    </div>
  </motion.div>}</AnimatePresence>
}
