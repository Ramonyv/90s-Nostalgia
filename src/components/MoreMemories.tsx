import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { futureMemories, scenes } from '../data/scenes'

export function MoreMemories({ open, onClose, onSceneSelect }: { open: boolean; onClose: () => void; onSceneSelect: (index: number) => void }) {
  return <AnimatePresence>{open && <motion.div className="memories-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button className="close-overlay" onClick={onClose} aria-label="Close memories"><X /></button>
    <div className="memories-inner"><p className="eyebrow">Yaadon ka pitara</p><h2>Where should we go next?</h2>
      <div className="memory-list">
        {scenes.map((scene, i) => <motion.div key={scene.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + i * .05 }}><Link to={scene.slug} onClick={() => { onSceneSelect(i); onClose() }}><span>0{i + 1}</span>{scene.englishTitle}<em>{scene.year}</em></Link></motion.div>)}
        {futureMemories.map((name, i) => <motion.div key={name} className="future-memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .24 + i * .035 }}><span>{name}</span><small>Coming from another memory…</small></motion.div>)}
      </div>
    </div>
  </motion.div>}</AnimatePresence>
}
