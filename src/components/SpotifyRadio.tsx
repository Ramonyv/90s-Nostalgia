import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Radio, X } from 'lucide-react'
import { spotifyConfig, spotifyEmbedUrl } from '../data/spotify'

export function SpotifyRadio({ open, onOpen, onClose, available }: { open: boolean; onOpen: () => void; onClose: () => void; available: boolean }) {
  return <>
    <AnimatePresence>{open && <motion.aside className="spotify-radio" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .35 }} aria-label="Salon Spotify radio">
      <div className="radio-topline"><div><Radio size={14} /><span>Salon radio · real 80s &amp; 90s</span></div><button onClick={onClose} aria-label="Close Spotify radio"><X size={16} /></button></div>
      <iframe
        title={`${spotifyConfig.title} on Spotify`}
        src={spotifyEmbedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <a href={spotifyConfig.sourceUrl} target="_blank" rel="noreferrer">Open playlist on Spotify <ExternalLink size={10} /></a>
    </motion.aside>}</AnimatePresence>
    {available && !open && <motion.button className="spotify-trigger" onClick={onOpen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label="Turn on the salon radio"><Radio size={15} /><span><strong>Salon radio</strong><small>Real 80s &amp; 90s songs</small></span></motion.button>}
  </>
}
