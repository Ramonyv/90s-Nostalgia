import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { rituals, type SceneRitual as Ritual } from '../data/rituals'
import type { Scene } from '../data/scenes'

const STORAGE_PREFIX = 'yaadein-ritual-v1:'
const MEMORY_SURFACE_EVENT = 'yaadein:memory-surface'

function wasCompleted(sceneId: Scene['id']) {
  try { return localStorage.getItem(`${STORAGE_PREFIX}${sceneId}`) === 'done' } catch { return false }
}

export function SceneRitual({ scene }: { scene: Scene }) {
  const ritual = rituals[scene.id]
  const [open, setOpen] = useState(false)
  const [complete, setComplete] = useState(() => wasCompleted(scene.id))
  const [name, setName] = useState('')
  const [coin, setCoin] = useState<'BAT' | 'BALL' | null>(null)
  const [flipping, setFlipping] = useState(false)
  const [tuning, setTuning] = useState(18)
  const [pumps, setPumps] = useState(0)

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  useEffect(() => {
    const closeForOtherSurface = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== 'ritual') setOpen(false)
    }
    window.addEventListener(MEMORY_SURFACE_EVENT, closeForOtherSurface)
    return () => window.removeEventListener(MEMORY_SURFACE_EVENT, closeForOtherSurface)
  }, [])

  const toggleOpen = () => {
    if (!open) window.dispatchEvent(new CustomEvent(MEMORY_SURFACE_EVENT, { detail: 'ritual' }))
    setOpen(value => !value)
  }

  const finish = () => {
    setComplete(true)
    try { localStorage.setItem(`${STORAGE_PREFIX}${scene.id}`, 'done') } catch { /* completion remains for this visit */ }
  }

  const replay = () => {
    setComplete(false)
    setCoin(null)
    setTuning(18)
    setPumps(0)
  }

  const tossCoin = () => {
    if (flipping) return
    setFlipping(true)
    window.setTimeout(() => {
      setCoin(Math.random() > .5 ? 'BAT' : 'BALL')
      setFlipping(false)
      finish()
    }, 850)
  }

  const pump = () => {
    const next = pumps + 1
    setPumps(next)
    if (next >= 3) finish()
  }

  const submitName = (event: FormEvent) => {
    event.preventDefault()
    if (name.trim()) finish()
  }

  const action = () => {
    if (ritual.kind === 'coin') { tossCoin(); return }
    if (ritual.kind === 'handpump') { pump(); return }
    finish()
  }

  return <div className={`scene-ritual scene-ritual--${ritual.kind}${open ? ' is-open' : ''}${complete ? ' is-complete' : ''}`} style={{ '--ritual-accent': scene.accentColor } as React.CSSProperties}>
    <AnimatePresence>
      {open && <motion.aside className="ritual-sheet" aria-label={`${scene.title} memory ritual`} initial={{ opacity: 0, y: 16, rotate: .8, scale: .97 }} animate={{ opacity: 1, y: 0, rotate: -.2, scale: 1 }} exit={{ opacity: 0, y: 9, scale: .98 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}>
        <button className="ritual-sheet__close" type="button" onClick={() => setOpen(false)} aria-label="Close memory ritual"><X size={15} /></button>
        <p className="ritual-sheet__eyebrow">इस याद की छोटी-सी रस्म</p>
        <h2>{ritual.title}</h2>
        <p className="ritual-sheet__instruction">{ritual.instruction}</p>
        <RitualObject ritual={ritual} complete={complete} name={name} setName={setName} submitName={submitName} coin={coin} flipping={flipping} tuning={tuning} setTuning={value => { setTuning(value); if (value >= 88) finish() }} pumps={pumps} action={action} />
        <AnimatePresence mode="wait">{complete && <motion.div className="ritual-result" key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><p>{scene.id === 'school' && name.trim() ? `${name.trim()}, ${ritual.completeLine}` : ritual.completeLine}</p><button type="button" onClick={replay}><RotateCcw size={11} /> फिर से करें</button></motion.div>}</AnimatePresence>
      </motion.aside>}
    </AnimatePresence>
    <motion.button className="ritual-tag" type="button" onClick={toggleOpen} aria-label={`${ritual.title}: open scene ritual`} aria-expanded={open} whileHover={{ y: -3, rotate: -1 }} whileTap={{ scale: .97 }}>
      <span>{ritual.mark}</span><strong>एक छोटी रस्म</strong><small>{complete ? 'याद पूरी हुई' : 'छूकर देखें'}</small>
    </motion.button>
  </div>
}

type RitualObjectProps = {
  ritual: Ritual
  complete: boolean
  name: string
  setName: (name: string) => void
  submitName: (event: FormEvent) => void
  coin: 'BAT' | 'BALL' | null
  flipping: boolean
  tuning: number
  setTuning: (value: number) => void
  pumps: number
  action: () => void
}

function RitualObject({ ritual, complete, name, setName, submitName, coin, flipping, tuning, setTuning, pumps, action }: RitualObjectProps) {
  if (ritual.kind === 'notebook') return <form className="ritual-notebook" onSubmit={submitName}><label htmlFor="ritual-name">यहाँ अपना नाम लिखें</label><input id="ritual-name" value={name} onChange={event => setName(event.target.value.slice(0, 24))} placeholder="आपका नाम" autoComplete="off" /><button type="submit" disabled={!name.trim()}>{ritual.action}</button></form>
  if (ritual.kind === 'antenna') return <div className="ritual-antenna"><span className="ritual-tv"><i style={{ opacity: Math.max(0, 1 - tuning / 88) }} /></span><label htmlFor="ritual-tuning">Signal {tuning}%</label><input id="ritual-tuning" type="range" min="0" max="100" value={tuning} onChange={event => setTuning(Number(event.target.value))} /></div>
  if (ritual.kind === 'coin') return <button className={`ritual-coin${flipping ? ' is-flipping' : ''}`} type="button" onClick={action} disabled={flipping}><span>{coin ?? '?'}</span><small>{flipping ? 'हवा में…' : ritual.action}</small></button>
  if (ritual.kind === 'handpump') return <button className="ritual-handpump" type="button" onClick={action} disabled={complete}><span><i /></span><b>{Math.min(pumps, 3)} / 3</b><small>{ritual.action}</small></button>
  if (ritual.kind === 'route') return <button className="ritual-route" type="button" onClick={action}><svg viewBox="0 0 220 90" aria-hidden="true"><path className="ritual-route__road" d="M8 70 C48 12 73 78 111 37 S169 70 212 15" /><path className="ritual-route__trace" d="M8 70 C48 12 73 78 111 37 S169 70 212 15" /></svg><small>{complete ? 'NH–48 • 1998' : ritual.action}</small></button>
  return <button className={`ritual-object ritual-object--${ritual.kind}`} type="button" onClick={action}><span className="ritual-object__visual"><i /><b>{ritual.mark}</b></span><small>{ritual.action}</small></button>
}
