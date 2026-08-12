import { motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import './LegacySupportModal.css'

type LegacySupportModalProps = {
  onClose: () => void
  upiPaymentUrl: string
}

/**
 * Archived on 2026-08-12 when the support experience was refreshed.
 * This component is intentionally not imported by the live application.
 */
export function LegacySupportModal({ onClose, upiPaymentUrl }: LegacySupportModalProps) {
  return <motion.div className="legacy-support-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose()
  }}>
    <motion.section className="legacy-support-sheet" role="dialog" aria-modal="true" aria-labelledby="support-title" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .98 }} transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}>
      <button className="legacy-support-sheet__close" type="button" onClick={onClose} aria-label="Close support window"><X size={18} /></button>
      <p className="legacy-support-sheet__eyebrow"><span /> A little love</p>
      <h2 id="support-title">Keep these memories playing.</h2>
      <p className="legacy-support-sheet__note">If 90s Yaadein brought back a smile, you can help me make the next memory. No pressure—being here already means a lot.</p>
      <div className="legacy-support-sheet__qr">
        <img src="/upi-qr.png?v=1" alt="UPI QR code to support Raman Yv at ramandesigns9@oksbi" />
      </div>
      <strong>Scan with any UPI app</strong>
      <a className="legacy-support-sheet__pay" href={upiPaymentUrl}>Pay with UPI</a>
      <small>Paying Raman Yv · ramandesigns9@oksbi</small>
      <p className="legacy-support-sheet__thanks"><Heart size={11} fill="currentColor" /> Thank you for keeping nostalgia alive.</p>
    </motion.section>
  </motion.div>
}
