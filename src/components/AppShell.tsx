import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Maximize2, Menu, Minimize2, Volume2, VolumeX } from 'lucide-react'
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
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const ambient = useAmbientAudio(scene, entered)
  useEffect(() => {
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])
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
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  }
  return <div className="app-shell">
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/salon" replace />} />
        {scenes.map(s => <Route key={s.id} path={s.slug} element={<MemoryScene scene={s} />} />)}
        <Route path="*" element={<Navigate to="/salon" replace />} />
      </Routes>
    </AnimatePresence>
    <header className="topbar"><a className="brand" href="/salon"><strong><span>90s</span> यादें</strong><small>Relive it. Feel it. Live it.</small></a><SceneNavigation current={scene.id} onMore={() => setMoreOpen(true)} onSceneSelect={() => window.dispatchEvent(new Event(SPOTIFY_PLAY_EVENT))} /><button className="mobile-menu" onClick={() => setMoreOpen(true)} aria-label="Open memory menu"><Menu /></button></header>
    <div className="scene-controls">
      <button className="scene-control ambient-toggle" onClick={() => ambient.setAmbienceEnabled(!ambient.ambienceEnabled)} aria-label={ambient.ambienceEnabled ? 'Mute ambience' : 'Play ambience'}>{ambient.ambienceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>Ambience {ambient.ambienceEnabled ? 'on' : 'off'}</span></button>
      {document.fullscreenEnabled && <button className="scene-control fullscreen-toggle" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-pressed={fullscreen}>{fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}<span>{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span></button>}
    </div>
    <SpotifyRadio />
    <div className="scene-count"><span>0{scenes.findIndex(s => s.id === scene.id) + 1}</span><i /><span>0{scenes.length}</span></div>
    <MoreMemories open={moreOpen} onClose={() => setMoreOpen(false)} onSceneSelect={() => window.dispatchEvent(new Event(SPOTIFY_PLAY_EVENT))} />
    <IntroLoader visible={!entered} onEnter={enter} />
  </div>
}
