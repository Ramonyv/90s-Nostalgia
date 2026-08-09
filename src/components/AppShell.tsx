import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Menu, Volume2, VolumeX } from 'lucide-react'
import { getScene, scenes } from '../data/scenes'
import { useAmbientAudio } from '../hooks/useAmbientAudio'
import { MemoryScene } from '../scenes/MemoryScene'
import { SceneNavigation } from './SceneNavigation'
import { MoreMemories } from './MoreMemories'
import { IntroLoader } from './IntroLoader'
import { SpotifyRadio, SPOTIFY_PLAY_EVENT } from './SpotifyRadio'

export function AppShell() {
  const location = useLocation(), scene = getScene(location.pathname)
  const [entered, setEntered] = useState(() => sessionStorage.getItem('yaadein-entered') === 'yes')
  const [moreOpen, setMoreOpen] = useState(false)
  const ambient = useAmbientAudio(scene, entered)
  useEffect(() => {
    const current = scenes.findIndex(item => item.id === scene.id)
    const neighbours = [scenes[(current + 1) % scenes.length], scenes[(current - 1 + scenes.length) % scenes.length]]
    const timer = window.setTimeout(() => neighbours.forEach(item => { const image = new Image(); image.src = item.background }), 1200)
    return () => window.clearTimeout(timer)
  }, [scene.id])
  const enter = async () => {
    sessionStorage.setItem('yaadein-entered', 'yes')
    window.dispatchEvent(new Event(SPOTIFY_PLAY_EVENT))
    setEntered(true)
    await ambient.startAmbient()
  }
  return <div className="app-shell">
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/salon" replace />} />
        {scenes.map(s => <Route key={s.id} path={s.slug} element={<MemoryScene scene={s} />} />)}
        <Route path="*" element={<Navigate to="/salon" replace />} />
      </Routes>
    </AnimatePresence>
    <header className="topbar"><a className="brand" href="/salon"><strong><span>90s</span> यादें</strong><small>Relive it. Feel it. Live it.</small></a><SceneNavigation current={scene.id} onMore={() => setMoreOpen(true)} /><button className="mobile-menu" onClick={() => setMoreOpen(true)} aria-label="Open memory menu"><Menu /></button></header>
    <button className="ambient-toggle" onClick={() => ambient.setAmbienceEnabled(!ambient.ambienceEnabled)} aria-label={ambient.ambienceEnabled ? 'Mute ambience' : 'Play ambience'}>{ambient.ambienceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>Ambience {ambient.ambienceEnabled ? 'on' : 'off'}</span></button>
    <SpotifyRadio />
    <div className="scene-count"><span>0{scenes.findIndex(s => s.id === scene.id) + 1}</span><i /><span>0{scenes.length}</span></div>
    <MoreMemories open={moreOpen} onClose={() => setMoreOpen(false)} />
    <IntroLoader visible={!entered} onEnter={enter} />
  </div>
}
