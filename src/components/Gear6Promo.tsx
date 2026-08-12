import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Bike, Download } from 'lucide-react'

export function Gear6Promo() {
  const [showQr, setShowQr] = useState(true)

  useEffect(() => {
    const timer = window.setInterval(() => setShowQr(current => !current), 5000)
    return () => window.clearInterval(timer)
  }, [])

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
    <AnimatePresence mode="wait" initial={false}>
      {!showQr ? <motion.span className="gear6-promo__panel" key="ride" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .35 }}>
        <span className="gear6-promo__eyebrow"><Bike size={11} /> Are you a bike rider?</span>
        <strong>Never lose<br />your crew.</strong>
        <small>Track every rider live with Gear6.</small>
        <span className="gear6-promo__cta">Start a live ride <ArrowUpRight size={12} /></span>
        <span className="gear6-promo__visual">
          <span className="gear6-promo__live"><i /> Live</span>
          <img src="/Live Ride (Tracking).png" alt="Gear6 live group ride tracking screen" />
        </span>
        <i className="gear6-promo__timer" aria-hidden="true" />
      </motion.span> : <motion.span className="gear6-promo__panel" key="qr" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}>
        <span className="gear6-promo__eyebrow"><Download size={11} /> Built for every ride</span>
        <strong>Scan. Ride.<br />Stay together.</strong>
        <small>Get Gear6 before your next group ride.</small>
        <span className="gear6-promo__cta">Download Gear6 <ArrowUpRight size={12} /></span>
        <span className="gear6-promo__visual gear6-promo__visual--qr">
          <span className="gear6-promo__scan">Scan me</span>
          <img src="/Gear 6 QR.png" alt="QR code to download the Gear6 app" />
        </span>
        <i className="gear6-promo__timer" aria-hidden="true" />
      </motion.span>}
    </AnimatePresence>
  </motion.a>
}
