import { lazy, Suspense, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { scenes } from './data/scenes'
import { sceneIsVisible } from './config/experience'
import { useExperienceConfig } from './hooks/useExperienceConfig'
import { AdSenseLoader } from './editorial/ads'
import { ConsentManager } from './editorial/ConsentManager'
import { ExternalLinkAnalytics, RouteAnalytics } from './editorial/SEO'

const ImmersiveApp = lazy(() => import('./components/AppShell').then(module => ({ default: module.AppShell })))
const EditorialApp = lazy(() => import('./editorial/EditorialApp').then(module => ({ default: module.EditorialApp })))

function FeaturedMemoryRedirect() {
  const { config, ready } = useExperienceConfig()
  if (!ready) return <div className="route-loader">Loading memory…</div>
  const activeScenes = scenes.filter(scene => scene.availability === 'active' && sceneIsVisible(config, scene.id))
  const featured = activeScenes.find(scene => scene.id === config.featuredScene) ?? activeScenes[0] ?? scenes[0]
  return <Navigate to={featured.slug} replace />
}

export default function App() {
  const location = useLocation()
  const isImmersive = scenes.some(scene => scene.slug === location.pathname)
  useEffect(() => {
    document.documentElement.classList.toggle('editorial-mode', !isImmersive)
    document.body.classList.toggle('editorial-mode', !isImmersive)
    return () => {
      document.documentElement.classList.remove('editorial-mode')
      document.body.classList.remove('editorial-mode')
    }
  }, [isImmersive])
  return <>
    <RouteAnalytics /><ExternalLinkAnalytics /><ConsentManager /><AdSenseLoader />
    {location.pathname === '/' ? <FeaturedMemoryRedirect /> : isImmersive ? <Suspense fallback={<div className="route-loader">Loading memory…</div>}><ImmersiveApp /></Suspense> : <Suspense fallback={<div className="route-loader route-loader--paper">Loading archive…</div>}><EditorialApp /></Suspense>}
  </>
}
