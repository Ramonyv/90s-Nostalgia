import { Eye, EyeOff, Film, Image as ImageIcon, Save, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_EXPERIENCE_CONFIG, normalizeExperienceConfig, sceneIsVisible, type ExperienceConfig, type ScenePlaybackMode } from '../config/experience'
import { scenes, type SceneId } from '../data/scenes'
import { SEO } from './SEO'

type AuthState = 'checking' | 'authenticated' | 'logged-out' | 'unavailable'
const activeScenes = scenes.filter(scene => scene.availability === 'active')

async function jsonRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...init, headers: { accept: 'application/json', ...(init.headers || {}) } })
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The live control API is unavailable on this deployment.')
  const data = await response.json().catch(() => ({ error: 'The server returned an invalid response.' })) as Record<string, unknown>
  return { response, data }
}

export function ExperienceControl() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [config, setConfig] = useState<ExperienceConfig>(DEFAULT_EXPERIENCE_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [persistent, setPersistent] = useState(false)

  const loadConfig = async () => {
    setLoading(true)
    try {
      const { response, data } = await jsonRequest('/api/experience-config')
      if (!response.ok) throw new Error(String(data.error || 'Could not load live settings.'))
      setConfig(normalizeExperienceConfig(data.config)); setPersistent(data.persistent === true)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load live settings.') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    void jsonRequest('/api/blog-auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'status' }) }).then(({ response, data }) => {
      if (response.status === 503 || data.configured === false) setAuthState('unavailable')
      else setAuthState(response.ok && data.authenticated === true ? 'authenticated' : 'logged-out')
    }).catch(() => setAuthState('unavailable'))
    void jsonRequest('/api/experience-config').then(({ response, data }) => {
      if (!response.ok) throw new Error(String(data.error || 'Could not load live settings.'))
      setConfig(normalizeExperienceConfig(data.config)); setPersistent(data.persistent === true)
    }).catch(error => setMessage(error instanceof Error ? error.message : 'Could not load live settings.')).finally(() => setLoading(false))
  }, [])

  const visibleCount = useMemo(() => activeScenes.filter(scene => sceneIsVisible(config, scene.id)).length, [config])
  const login = async () => {
    setAuthError('')
    try {
      const { response, data } = await jsonRequest('/api/blog-auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'login', password }) })
      if (!response.ok || data.authenticated !== true) throw new Error(String(data.error || 'Login failed.'))
      setPassword(''); setAuthState('authenticated'); await loadConfig()
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Login failed.') }
  }
  const updateScene = (sceneId: SceneId, patch: { visible?: boolean; playback?: ScenePlaybackMode }) => setConfig(current => {
    const existing = current.scenes[sceneId] ?? { visible: true, playback: 'inherit' as const }
    const nextSetting = { ...existing, ...patch }
    let featuredScene = current.featuredScene
    if (patch.visible === false && featuredScene === sceneId) featuredScene = activeScenes.find(scene => scene.id !== sceneId && sceneIsVisible(current, scene.id))?.id ?? featuredScene
    return { ...current, featuredScene, scenes: { ...current.scenes, [sceneId]: nextSetting } }
  })
  const save = async () => {
    setSaving(true); setMessage('')
    try {
      const { response, data } = await jsonRequest('/api/experience-config', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(config) })
      if (response.status === 401) { setAuthState('logged-out'); throw new Error('Your admin session expired. Sign in again.') }
      if (!response.ok || data.ok !== true) throw new Error(String(data.error || 'Could not save live settings.'))
      setConfig(normalizeExperienceConfig(data.config)); setPersistent(data.persistent === true); setMessage('Live experience updated. Visitors will receive it within about 45 seconds.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save live settings.') }
    finally { setSaving(false) }
  }

  return <div className="studio-page experience-control">
    <SEO title="Experience Control" description="Private live controls for 90s Yaadein." canonicalPath="/admin/experience" noindex />
    <header className="studio-header"><div><p><span>90s</span> यादें</p><h1>Experience Control</h1></div><nav aria-label="Admin sections"><Link to="/admin/blog">Blog Studio</Link><Link to={scenes.find(scene => scene.id === config.featuredScene)?.slug ?? '/salon'}>View live site</Link>{authState === 'authenticated' && <button className="studio-publish-button" disabled={saving || loading || visibleCount === 0} onClick={() => void save()}><Save size={14} /> {saving ? 'Saving…' : 'Publish live'}</button>}</nav></header>
    {authState === 'checking' ? <section className="studio-login"><p>Checking secure access…</p></section> : authState === 'logged-out' ? <section className="studio-login"><ShieldCheck size={27} /><p className="section-kicker">Protected controls</p><h2>Sign in to Experience Control</h2><p>These settings change what visitors see on the live site.</p><form onSubmit={event => { event.preventDefault(); void login() }}><label><span>Admin password</span><input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} autoFocus /></label>{authError && <p className="is-error" role="alert">{authError}</p>}<button className="button-primary" type="submit" disabled={!password}>Sign in securely</button></form></section> : authState === 'unavailable' ? <section className="studio-login"><ShieldCheck size={27} /><h2>Controls unavailable</h2><p>Configure the existing admin password and session secret on this deployment first.</p></section> : <main className="experience-control__main">
      <section className="experience-summary"><div><SlidersHorizontal size={19} /><p><strong>Live presentation</strong><span>{visibleCount} visible memories · {persistent ? 'remote storage connected' : 'using safe defaults'}</span></p></div>{config.updatedAt && <time dateTime={config.updatedAt}>Last updated {new Date(config.updatedAt).toLocaleString()}</time>}</section>
      <section className="experience-global" aria-labelledby="global-controls"><div><p className="section-kicker">Global defaults</p><h2 id="global-controls">How memories open</h2><p>Per-memory settings below can override this default.</p></div><fieldset><legend>Default playback</legend><div className="experience-segmented"><button className={config.defaultPlayback === 'static' ? 'is-active' : ''} onClick={() => setConfig(current => ({ ...current, defaultPlayback: 'static' }))}><ImageIcon size={15} /> Static</button><button className={config.defaultPlayback === 'loop' ? 'is-active' : ''} onClick={() => setConfig(current => ({ ...current, defaultPlayback: 'loop' }))}><Film size={15} /> Loop video</button></div></fieldset><label className="experience-switch"><span><strong>Visitor playback control</strong><small>Allow visitors to switch between static and animated scenes.</small></span><input type="checkbox" checked={config.allowVisitorOverride} onChange={event => setConfig(current => ({ ...current, allowVisitorOverride: event.target.checked }))} /></label></section>
      <section className="experience-scenes" aria-labelledby="memory-controls"><header><div><p className="section-kicker">Memory visibility</p><h2 id="memory-controls">Live themes</h2></div><p>Choose the opening memory, visibility and playback behavior.</p></header><div className="experience-scenes__list">{activeScenes.map((scene, index) => {
        const setting = config.scenes[scene.id] ?? { visible: true, playback: 'inherit' as const }
        const visible = sceneIsVisible(config, scene.id)
        return <article className={visible ? '' : 'is-hidden'} key={scene.id}><span className="experience-scene__number">{String(index + 1).padStart(2, '0')}</span><img src={scene.mobileBackground} alt="" loading="lazy" /><div className="experience-scene__identity"><strong>{scene.selectorTitle ?? scene.title}</strong><small>{scene.selectorSecondary ?? `${scene.year} · ${scene.navLabel}`}</small></div><label className="experience-featured"><input type="radio" name="featured-scene" checked={config.featuredScene === scene.id} disabled={!visible} onChange={() => setConfig(current => ({ ...current, featuredScene: scene.id }))} /><span>Opening</span></label><label className="experience-select"><span>Playback</span><select value={setting.playback} disabled={!visible} onChange={event => updateScene(scene.id, { playback: event.target.value as ScenePlaybackMode })}><option value="inherit">Use global</option><option value="static">Static</option><option value="loop">Loop video</option></select></label><button className="experience-visibility" disabled={visible && visibleCount === 1} onClick={() => updateScene(scene.id, { visible: !visible })} aria-label={`${visible ? 'Hide' : 'Show'} ${scene.title}`}>{visible ? <><Eye size={15} /> Live</> : <><EyeOff size={15} /> Hidden</>}</button></article>
      })}</div></section>
      <footer className="experience-save"><p>{message || 'Changes remain private until you publish them.'}</p><button className="button-primary" disabled={saving || loading || visibleCount === 0} onClick={() => void save()}><Save size={15} /> {saving ? 'Publishing…' : 'Publish experience'}</button></footer>
    </main>}
  </div>
}
