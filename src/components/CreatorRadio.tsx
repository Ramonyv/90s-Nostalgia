import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Heart, MapPin, ServerCog, Sparkles, X } from 'lucide-react'

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" /></svg>
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" /></svg>
}

const socials = [
  { label: 'X', href: 'https://x.com/ramandesigns9', mark: '𝕏' },
  { label: 'Instagram', href: 'https://www.instagram.com/raman1568/', icon: InstagramIcon },
  { label: 'Behance', href: 'https://www.behance.net/ramony', mark: 'Bē' },
  { label: 'GitHub', href: 'https://github.com/Ramonyv', icon: GitHubIcon },
]

const upiPaymentUrl = 'upi://pay?pa=ramandesigns9%40oksbi&pn=Raman%20Yv&tn=Support%2090s%20Yaadein&cu=INR'

export function CreatorRadio() {
  const [supportOpen, setSupportOpen] = useState(false)

  useEffect(() => {
    if (!supportOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSupportOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [supportOpen])

  return <>
    <motion.aside className="creator-radio" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55, delay: .35, ease: [0.22, 1, 0.36, 1] }} aria-label="About the creator">
    <div className="creator-radio__topline">
      <span className="creator-radio__status"><i /> On air</span>
      <i className="creator-radio__dial" aria-hidden="true" />
    </div>
    <div className="creator-radio__identity">
      <div><h2>Raman Yv</h2><p>Creator of<br /><strong>90s Yaadein</strong> <Heart size={10} fill="currentColor" /></p></div>
      <img src="/creator-raman.webp" alt="Raman Yv" />
    </div>
    <div className="creator-radio__speaker" aria-hidden="true" />
    <button className="creator-radio__support" type="button" onClick={() => setSupportOpen(true)}>
      <Heart size={10} /> Support this site
    </button>
    <div className="creator-radio__footer">
      <span><MapPin size={10} /> Tune in</span>
      <nav aria-label="Raman Yv on social media">
        {socials.map(({ label, href, mark, icon: Icon }) => <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} key={label}>{Icon ? <Icon /> : <b>{mark}</b>}</a>)}
      </nav>
    </div>
    </motion.aside>

    <AnimatePresence>
      {supportOpen && <motion.div className="support-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => {
        if (event.target === event.currentTarget) setSupportOpen(false)
      }}>
        <motion.section className="support-sheet" role="dialog" aria-modal="true" aria-labelledby="support-title" aria-describedby="support-description" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .98 }} transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}>
          <button className="support-sheet__close" type="button" onClick={() => setSupportOpen(false)} aria-label="Close support window"><X size={18} /></button>
          <div className="support-sheet__story">
            <p className="support-sheet__eyebrow"><span /> Listener supported</p>
            <h2 id="support-title">Help me keep<br /><em>90s Yaadein</em> online.</h2>
            <p className="support-sheet__note" id="support-description">I built this little corner of the internet with love. Your donation helps me pay the real costs of running and caring for it.</p>
            <div className="support-sheet__impact" aria-label="What your donation supports">
              <span><ServerCog size={15} /> Hosting &amp; upkeep</span>
              <span><Sparkles size={15} /> New nostalgic memories</span>
            </div>
            <p className="support-sheet__signature">— Raman, creator of 90s Yaadein</p>
          </div>
          <div className="support-sheet__donate">
            <p className="support-sheet__ask"><Heart size={13} fill="currentColor" /> Support the site</p>
            <div className="support-sheet__qr">
              <img src="/upi-qr.png?v=1" alt="UPI QR code to donate to Raman Yv at ramandesigns9@oksbi" />
            </div>
            <strong>Scan with any UPI app</strong>
            <a className="support-sheet__pay" href={upiPaymentUrl}><Heart size={13} fill="currentColor" /> Donate with UPI</a>
            <small>One-time donation · Any amount<br />Paying Raman Yv · ramandesigns9@oksbi</small>
          </div>
          <p className="support-sheet__thanks">No pressure. Sharing the site helps too. <Heart size={11} fill="currentColor" /></p>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </>
}
