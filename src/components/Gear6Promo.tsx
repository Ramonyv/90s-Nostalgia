import { motion } from 'framer-motion'
import { ArrowUpRight, Bike } from 'lucide-react'

export function Gear6Promo() {
  return <motion.a
    className="gear6-promo"
    href="https://gear6.app/"
    target="_blank"
    rel="noreferrer"
    aria-label="Bike rider? Track your crew live with Gear6"
    initial={{ opacity: 0, x: -18 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: .6, delay: .65, ease: [0.22, 1, 0.36, 1] }}
  >
    <span className="gear6-promo__eyebrow"><Bike size={11} /> Are you a bike rider?</span>
    <strong>Never lose<br />your crew.</strong>
    <small>Track every rider live with Gear6.</small>
    <span className="gear6-promo__cta">Start a live ride <ArrowUpRight size={12} /></span>
    <span className="gear6-promo__visual">
      <span className="gear6-promo__live"><i /> Live</span>
      <img src="/Live Ride (Tracking).png" alt="Gear6 live group ride tracking screen" />
    </span>
  </motion.a>
}
