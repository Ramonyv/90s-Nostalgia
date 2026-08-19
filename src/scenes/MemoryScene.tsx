import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { type Scene } from '../data/scenes'
import { SceneHotspot } from '../components/SceneHotspot'
import { Gear6LogoPlaceholder } from '../components/Gear6LogoPlaceholder'
import { RippleSceneMedia } from '../components/RippleSceneMedia'
import { trackEvent } from '../lib/analytics'

export function MemoryScene({ scene, animated, videoSoundEnabled, onAmbientToggle }: { scene: Scene; animated: boolean; videoSoundEnabled: boolean; onAmbientToggle?: () => void }) {
  const [videoFailed, setVideoFailed] = useState(false)
  const [addaEffect, setAddaEffect] = useState<'radio' | 'chai' | 'motorcycle' | null>(null)
  const [gear6Open, setGear6Open] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  const showVideo = Boolean(animated && scene.backgroundVideo && !videoFailed && !reducedMotion)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = .2
    video.muted = Boolean(scene.videoMuted || !videoSoundEnabled)
    if (videoSoundEnabled && !scene.videoMuted) void video.play().catch(() => { video.muted = true })
  }, [scene.id, scene.videoMuted, showVideo, videoSoundEnabled])
  useEffect(() => {
    if (!gear6Open) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setGear6Open(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [gear6Open])
  const activateHotspot = (action: Scene['hotspots'][number]['action']) => {
    if (!action) return
    if (action === 'gear6') { setGear6Open(true); return }
    if (action === 'radio') onAmbientToggle?.()
    if (action === 'radio' || action === 'chai' || action === 'motorcycle') {
      setAddaEffect(action)
      window.setTimeout(() => setAddaEffect(current => current === action ? null : current), action === 'chai' ? 3200 : 1800)
    }
  }

  return <motion.main className={`memory-scene memory-scene--${scene.id}`} style={{ '--accent': scene.accentColor, '--scene-position': scene.mobilePosition } as React.CSSProperties} initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: .85, ease: [0.22, 1, 0.36, 1] }}>
    <RippleSceneMedia alt={`${scene.title}, an illustrated Indian memory from ${scene.year}`} desktopImage={scene.desktopBackground} mobileImage={scene.mobileBackground} mobilePosition={scene.mobilePosition} video={showVideo ? scene.backgroundVideo : undefined} mobileVideo={showVideo ? scene.mobileVideo : undefined} poster={scene.fallbackImage} muted={Boolean(scene.videoMuted || !videoSoundEnabled)} videoRef={videoRef} onPlay={() => trackEvent('video_play', { scene_id: scene.id, video_type: 'scene_background' })} onVideoError={() => setVideoFailed(true)} />
    <div className="scene-shade" />
    {scene.id === 'auto-rickshaw' && <div className="auto-ride-motion" aria-hidden="true"><i /><i /><i /></div>}
    {scene.id === 'adhoori-shaam' && animated && !reducedMotion && <div className="adhoori-ambience" aria-hidden="true"><span className="adhoori-fan"><i /><i /><i /></span><span className="adhoori-rain" /><span className="adhoori-light" /><span className="adhoori-photo" /></div>}
    {scene.id === 'adhoori-shaam' && <p className="adhoori-shayari" aria-hidden="true">कुछ लोग चले जाते हैं,<br />कुछ शामों में रह जाते हैं।</p>}
    {scene.id === 'highway-adda' && <div className={`highway-adda-ambience${addaEffect ? ` is-${addaEffect}` : ''}`} aria-hidden="true"><span className="adda-distance-light" /><span className="adda-radio-glow" /><span className="adda-chai-steam"><i /><i /><i /></span><span className="adda-bike-light" /></div>}
    {scene.id === '90s-shaadi' && animated && !reducedMotion && <div className="shaadi-ambience" aria-hidden="true"><span className="shaadi-light shaadi-light--one" /><span className="shaadi-light shaadi-light--two" /><span className="shaadi-petals">{Array.from({ length: 7 }).map((_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</span><span className="shaadi-haze" /><span className="shaadi-vhs" /></div>}
    {scene.id === 'nusrat-night' && animated && !reducedMotion && <div className="nusrat-ambience" aria-hidden="true"><span className="nusrat-fan"><i /><i /><i /></span><span className="nusrat-curtain" /><span className="nusrat-radio-light" /><span className="nusrat-street-light" /><span className="nusrat-lamp" /></div>}
    {scene.id === 'gulzar-rain' && animated && !reducedMotion && <div className="gulzar-rain-ambience" aria-hidden="true"><span className="gulzar-rain-window" /><span className="gulzar-rain-passing-light" /><span className="gulzar-rain-carriage-glow" /></div>}
    {scene.animation.dust && <div className="sun-dust" aria-hidden="true">{Array.from({ length: scene.animation.dustCount }).map((_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>}
    <section className="scene-copy"><p className="scene-year"><span /> {scene.memoryLabel ?? (scene.id === 'highway-adda' ? '1998 • Somewhere on the highway' : `A memory from ${scene.year}`)}</p><h1>{scene.hindiTitle}</h1><p className="scene-description">{scene.shortLine}</p></section>
    <div className="hotspot-layer">{scene.hotspots.map((hotspot, i) => <SceneHotspot hotspot={hotspot} key={i} onActivate={activateHotspot} />)}</div>
    <div className="discover-hint"><span /><p>Move around to<br />find little memories</p></div>
    <AnimatePresence>{gear6Open && <motion.div className="gear6-memory" role="dialog" aria-modal="true" aria-labelledby="gear6-memory-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGear6Open(false)}><motion.div className="gear6-memory__paper" initial={{ y: 18, rotate: -1.5, scale: .96 }} animate={{ y: 0, rotate: -.5, scale: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }} onClick={event => event.stopPropagation()}><button type="button" onClick={() => setGear6Open(false)} aria-label="Close Gear6 memory">×</button><Gear6LogoPlaceholder /><p id="gear6-memory-title">Some friendships begin<br />where the road ends.</p><small>RIDE • ROADS • BROTHERHOOD</small><a href="https://gear6.app/" target="_blank" rel="noopener noreferrer">Visit Gear6 <span aria-hidden="true">↗</span></a></motion.div></motion.div>}</AnimatePresence>
  </motion.main>
}
