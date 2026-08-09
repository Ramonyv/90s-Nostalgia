import { AnimatePresence, motion } from 'framer-motion'

export function IntroLoader({ visible, onEnter }: { visible: boolean; onEnter: () => void }) {
  return <AnimatePresence>{visible && <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: .8 }}>
    <div className="intro__grain" /><motion.div className="intro__content" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <div className="intro__cassette" aria-hidden="true"><span /><i /><i /></div>
      <p>Est. 1990-something</p><h1><span>90s</span> यादें</h1><div className="intro__line" /><h2>कुछ यादें कभी पुरानी नहीं होतीं।</h2>
      <button onClick={onEnter}><strong>यादों में चलें</strong><span>Enter the 90s</span></button>
      <small>Best experienced with sound</small>
    </motion.div>
  </motion.div>}</AnimatePresence>
}
