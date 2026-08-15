import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Film, Image as ImageIcon, Maximize2, Menu, Minimize2, Volume2, VolumeX } from 'lucide-react'
import { getScene, scenes } from '../data/scenes'
import { spotifyPlaylists } from '../data/spotify'
import { useAmbientAudio } from '../hooks/useAmbientAudio'
import { MemoryScene } from '../scenes/MemoryScene'
import { SceneNavigation } from './SceneNavigation'
import { MoreMemories } from './MoreMemories'
import { IntroLoader } from './IntroLoader'
import { MemoryNavigator } from './MemoryNavigator'
import { requestSpotifyPlayback, SpotifyRadio } from './SpotifyRadio'
import { CreatorRadio } from './CreatorRadio'
import { NetlifyCredit } from './NetlifyCredit'
import { Gear6Promo } from './Gear6Promo'
import { SEO } from '../editorial/SEO'
import { absoluteUrl } from '../config/site'
import { MemoryKeepsake } from './MemoryKeepsake'
import { SceneRitual } from './SceneRitual'

export function AppShell() {
  const location = useLocation(), scene = getScene(location.pathname)
  const [entered, setEntered] = useState(() => sessionStorage.getItem('yaadein-entered') === 'yes')
  const [moreOpen, setMoreOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [mediaAudioUnlocked, setMediaAudioUnlocked] = useState(false)
  const [animatedScenes, setAnimatedScenes] = useState(false)
  const ambient = useAmbientAudio(scene, entered)
  const playlist = spotifyPlaylists[scene.id]
  const selectScene = (sceneId: typeof scene.id) => {
    const nextPlaylist = spotifyPlaylists[sceneId]
    requestSpotifyPlayback(nextPlaylist)
  }
  useEffect(() => {
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])
  useEffect(() => {
    if (!entered || mediaAudioUnlocked) return
    const unlock = () => setMediaAudioUnlocked(true)
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [entered, mediaAudioUnlocked])
  const enter = async () => {
    sessionStorage.setItem('yaadein-entered', 'yes')
    requestSpotifyPlayback(playlist)
    setMediaAudioUnlocked(true)
    setEntered(true)
    await ambient.startAmbient()
  }
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  }
  const toggleAmbient = () => {
    if (!ambient.ambienceEnabled) setMediaAudioUnlocked(true)
    ambient.setAmbienceEnabled(!ambient.ambienceEnabled)
  }
  return <div className="app-shell">
    <SEO title={`${scene.title} (${scene.year})`} description={`${scene.description} Explore an illustrated memory from everyday India in the 1990s.`} canonicalPath={scene.slug} image={scene.desktopBackground} jsonLd={scene.id === 'salon' ? { '@context': 'https://schema.org', '@type': 'WebSite', name: '90s Yaadein', description: 'An interactive archive of everyday memories from 1990s India.', url: absoluteUrl('/') } : undefined} />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/salon" replace />} />
        {scenes.map(s => <Route key={s.id} path={s.slug} element={<MemoryScene scene={s} animated={animatedScenes} videoSoundEnabled={mediaAudioUnlocked && ambient.ambienceEnabled} onAmbientToggle={toggleAmbient} />} />)}
        <Route path="*" element={<Navigate to="/salon" replace />} />
      </Routes>
    </AnimatePresence>
    <header className="topbar"><a className="brand" href="/salon"><strong><span>90s</span> यादें</strong><small>Relive it. Feel it. Live it.</small></a><div className="immersive-nav-cluster"><SceneNavigation current={scene.id} onMore={() => setMoreOpen(true)} onSceneSelect={selectScene} /><nav className="archive-nav" aria-label="Archive"><a href="/memories">Memories</a><a href="/journal">Journal</a><a href="/about">About</a></nav></div><button className="mobile-menu" onClick={() => setMoreOpen(true)} aria-label="Open memory menu"><Menu /></button></header>
    <div className="scene-controls">
      <button className={`scene-control animation-toggle${animatedScenes ? ' is-active' : ''}`} onClick={() => setAnimatedScenes(value => !value)} aria-label={animatedScenes ? 'Use static scene backgrounds' : 'Animate scene backgrounds'} aria-pressed={animatedScenes}>{animatedScenes ? <Film size={15} /> : <ImageIcon size={15} />}<span>{animatedScenes ? 'Animated' : 'Static'}</span></button>
      <button className="scene-control ambient-toggle" onClick={toggleAmbient} aria-label={ambient.ambienceEnabled ? 'Mute ambience' : 'Play ambience'}>{ambient.ambienceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>Ambience {ambient.ambienceEnabled ? 'on' : 'off'}</span></button>
      {document.fullscreenEnabled && <button className="scene-control fullscreen-toggle" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-pressed={fullscreen}>{fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}<span>{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span></button>}
    </div>
    {scene.id !== 'highway-adda' && <Gear6Promo />}
    <CreatorRadio />
    <NetlifyCredit />
    <MemoryNavigator current={scene.id} onMore={() => setMoreOpen(true)} onSceneSelect={selectScene} />
    <MemoryKeepsake key={scene.id} scene={scene} />
    <SceneRitual key={`ritual-${scene.id}`} scene={scene} />
    <SpotifyRadio playlist={playlist} />
    <div className="scene-count"><span>0{scenes.findIndex(s => s.id === scene.id) + 1}</span><i /><span>0{scenes.length}</span></div>
    <MoreMemories open={moreOpen} onClose={() => setMoreOpen(false)} onSceneSelect={selectScene} />
    <IntroLoader visible={!entered} onEnter={enter} />
  </div>
}
