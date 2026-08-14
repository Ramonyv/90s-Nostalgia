import { Check, Download, FileText, ImagePlus, ShieldCheck, UploadCloud, X } from 'lucide-react'
import { DragEvent, useEffect, useMemo, useRef, useState } from 'react'
import { BlogPost, parseBlogMarkdown, serializePost, validatePost } from './blog'
import { MarkdownContent } from './MarkdownContent'
import { SEO } from './SEO'

const fields: { key: keyof BlogPost; label: string; type?: string }[] = [
  { key: 'title', label: 'Title' }, { key: 'slug', label: 'Slug' }, { key: 'seoTitle', label: 'SEO title' },
  { key: 'seoDescription', label: 'SEO description' }, { key: 'description', label: 'Description' },
  { key: 'excerpt', label: 'Excerpt' }, { key: 'author', label: 'Author' }, { key: 'date', label: 'Date', type: 'date' },
  { key: 'updated', label: 'Updated', type: 'date' }, { key: 'category', label: 'Category' },
  { key: 'cover', label: 'Cover path' }, { key: 'coverAlt', label: 'Cover alt' }, { key: 'relatedMemory', label: 'Related memory' },
]

function download(name: string, content: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url)
}

type AuthState = 'checking' | 'authenticated' | 'logged-out' | 'unavailable'

async function apiRequest(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The secure publishing API is unavailable on this deployment.')
  const data = await response.json().catch(() => ({ error: 'The publishing API returned an invalid response.' })) as Record<string, unknown>
  return { response, data }
}

async function blobToBase64(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer()); let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 32_768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32_768))
  return btoa(binary)
}

async function convertImageToWebP(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Choose a valid image file.')
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 2000 / bitmap.width)
  const width = Math.max(1, Math.round(bitmap.width * scale)), height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) { bitmap.close(); throw new Error('This browser could not prepare the image canvas.') }
  context.drawImage(bitmap, 0, 0, width, height); bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('WebP conversion failed in this browser.')), 'image/webp', .82))
  return { blob, width, height }
}

export function BlogStudio() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [fileName, setFileName] = useState('blog.md')
  const [coverPreview, setCoverPreview] = useState('')
  const [coverFile, setCoverFile] = useState<Blob | null>(null)
  const [coverInfo, setCoverInfo] = useState('')
  const [coverError, setCoverError] = useState('')
  const [convertingCover, setConvertingCover] = useState(false)
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [publishMessage, setPublishMessage] = useState('')
  const [publishedCommit, setPublishedCommit] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  useEffect(() => () => { if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview) }, [coverPreview])
  useEffect(() => {
    void apiRequest('/api/blog-auth', { action: 'status' }).then(({ response, data }) => {
      if (response.status === 503 || data.configured === false) setAuthState('unavailable')
      else setAuthState(response.ok && data.authenticated === true ? 'authenticated' : 'logged-out')
    }).catch(() => setAuthState('unavailable'))
  }, [])
  const validation = useMemo(() => post ? validatePost(post) : null, [post])
  const importFile = async (file?: File) => {
    if (!file || !/\.(md|markdown)$/i.test(file.name)) return
    setPost(parseBlogMarkdown(await file.text(), file.name)); setFileName(file.name); setCoverPreview(''); setCoverFile(null); setCoverInfo(''); setCoverError('')
  }
  const drop = (event: DragEvent) => { event.preventDefault(); void importFile(event.dataTransfer.files[0]) }
  const edit = (key: keyof BlogPost, value: string | boolean) => setPost(current => current ? { ...current, [key]: key === 'tags' && typeof value === 'string' ? value.split(',').map(tag => tag.trim()).filter(Boolean) : value, ...(key === 'slug' && coverFile ? { cover: `/blog/${value || 'article'}/cover.webp` } : {}) } : current)
  const handleCover = async (file?: File) => {
    if (!file) return
    setConvertingCover(true); setCoverError('')
    try {
      const converted = await convertImageToWebP(file)
      setCoverFile(converted.blob); setCoverPreview(URL.createObjectURL(converted.blob))
      const saving = Math.round((1 - converted.blob.size / file.size) * 100)
      setCoverInfo(`${converted.width} × ${converted.height}px · ${(converted.blob.size / 1024).toFixed(0)} KB WebP${saving > 0 ? ` · ${saving}% smaller` : ''}`)
      setPost(current => current ? { ...current, cover: `/blog/${current.slug || 'article'}/cover.webp` } : current)
    } catch (error) { setCoverFile(null); setCoverInfo(''); setCoverError(error instanceof Error ? error.message : 'Could not convert this image.') }
    finally { setConvertingCover(false); if (coverRef.current) coverRef.current.value = '' }
  }
  const login = async () => {
    setAuthError('')
    try {
      const { response, data } = await apiRequest('/api/blog-auth', { action: 'login', password })
      if (!response.ok || data.authenticated !== true) throw new Error(String(data.error || 'Login failed.'))
      setPassword(''); setAuthState('authenticated')
    } catch (error) { setAuthError(error instanceof Error ? error.message : 'Login failed.') }
  }
  const logout = async () => {
    await apiRequest('/api/blog-auth', { action: 'logout' }).catch(() => undefined); setAuthState('logged-out'); setPublishedCommit(''); setPublishMessage('')
  }
  const publish = async (overwrite = false) => {
    if (!post || authState !== 'authenticated') return
    setPublishing(true); setPublishMessage(''); setPublishedCommit('')
    try {
      const coverBase64 = coverFile ? await blobToBase64(coverFile) : ''
      const { response, data } = await apiRequest('/api/blog-publish', { markdown: serializePost(post), coverBase64, overwrite })
      if (response.status === 401) { setAuthState('logged-out'); throw new Error('Your secure session expired. Sign in again.') }
      if (response.status === 409 && data.code === 'ARTICLE_EXISTS' && !overwrite) {
        setPublishing(false)
        if (window.confirm('An article with this slug already exists. Publish this as an update?')) await publish(true)
        return
      }
      if (!response.ok || data.ok !== true) throw new Error(String(data.error || 'Publishing failed.'))
      setPublishMessage('Published successfully. The deployment rebuild has been triggered.'); setPublishedCommit(String(data.commitUrl || ''))
    } catch (error) { setPublishMessage(error instanceof Error ? error.message : 'Publishing failed.') }
    finally { setPublishing(false) }
  }
  const publishDisabledReason = !post ? 'Import or create an article first.' : validation?.errors.length ? 'Resolve required metadata errors first.' : post.draft ? 'Uncheck Draft before publishing.' : !post.cover ? 'Upload a cover before publishing.' : post.cover !== `/blog/${post.slug}/cover.webp` ? `Cover path must be /blog/${post.slug}/cover.webp.` : authState !== 'authenticated' ? 'Sign in to publish.' : ''
  return <div className="studio-page">
    <SEO title="Blog Studio" description="Internal Markdown importer for 90s Yaadein." canonicalPath="/admin/blog" noindex />
    <header className="studio-header"><div><p><span>90s</span> यादें</p><h1>Blog Studio</h1></div><nav aria-label="Studio sections"><button onClick={() => { setPost(parseBlogMarkdown('---\ntitle: ""\ndescription: ""\ndate: ""\ncategory: ""\ndraft: true\n---\n\n## Start writing\n')); setFileName('new-article.md'); setCoverPreview(''); setCoverFile(null); setCoverInfo(''); setCoverError(''); setPublishMessage(''); setPublishedCommit('') }}>New Article</button><button onClick={() => inputRef.current?.click()}>Import Markdown</button><button disabled>Drafts</button><button className="studio-publish-button" disabled={Boolean(publishDisabledReason) || publishing} title={publishDisabledReason} onClick={() => void publish()}>{publishing ? 'Publishing…' : 'Publish'}</button></nav></header>
    {authState === 'authenticated' ? <div className="studio-notice studio-notice--connected"><ShieldCheck size={18} /><p><strong>Secure publishing connected</strong>GitHub credentials remain on the server. Your signed session is stored in an HttpOnly cookie.</p><button onClick={() => void logout()}>Sign out</button></div> : authState === 'unavailable' ? <div className="studio-notice"><ShieldCheck size={18} /><p><strong>Safe export mode</strong>The secure publishing API is not configured on this deployment. Blog Studio still validates and exports files locally; it never receives a GitHub token.</p></div> : null}
    {authState === 'checking' ? <section className="studio-login"><p>Checking secure publishing…</p></section> : authState === 'logged-out' ? <section className="studio-login"><ShieldCheck size={27} /><p className="section-kicker">Protected publishing</p><h2>Sign in to Blog Studio</h2><p>The password is verified by the server and is never stored in the browser.</p><form onSubmit={event => { event.preventDefault(); void login() }}><label><span>Admin password</span><input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} autoFocus /></label>{authError && <p className="is-error" role="alert">{authError}</p>}<button className="button-primary" type="submit" disabled={!password}>Sign in securely</button></form></section> : <>
    {!post ? <section className="drop-zone" onDrop={drop} onDragOver={event => event.preventDefault()}><UploadCloud size={42} /><h2>Drop your blog.md here</h2><p>Markdown stays on this device while you validate and preview it.</p><button className="button-primary" onClick={() => inputRef.current?.click()}>or choose file</button><input ref={inputRef} type="file" accept=".md,.markdown,text/markdown" hidden onChange={event => void importFile(event.target.files?.[0])} /></section> : <div className="studio-workspace">
      <aside className="studio-editor"><div className="studio-file"><FileText size={18} /><span>{fileName}</span><button aria-label="Remove imported article" onClick={() => setPost(null)}><X size={16} /></button></div>
        <section className="validation-panel"><h2>Pre-publish checklist</h2>{validation?.errors.map(message => <p className="is-error" key={message}><X size={14} />{message}</p>)}{validation?.warnings.map(message => <p className="is-warning" key={message}>! {message}</p>)}{validation && validation.errors.length === 0 && <p className="is-valid"><Check size={14} />Required metadata is valid</p>}</section>
        <div className="studio-fields">{fields.map(field => <label key={field.key}><span>{field.label}</span>{field.key === 'excerpt' || field.key === 'description' || field.key === 'seoDescription' ? <textarea value={String(post[field.key])} onChange={event => edit(field.key, event.target.value)} /> : <input type={field.type || 'text'} value={String(post[field.key])} onChange={event => edit(field.key, event.target.value)} />}</label>)}<label><span>Tags <small>comma separated</small></span><input value={post.tags.join(', ')} onChange={event => edit('tags', event.target.value)} /></label><label className="check-field"><input type="checkbox" checked={post.featured} onChange={event => edit('featured', event.target.checked)} /><span>Featured</span></label><label className="check-field"><input type="checkbox" checked={post.draft} onChange={event => edit('draft', event.target.checked)} /><span>Draft</span></label></div>
        <button className="cover-upload" disabled={convertingCover} onClick={() => coverRef.current?.click()}><ImagePlus size={18} /> {convertingCover ? 'Converting to WebP…' : coverFile ? 'Replace cover image' : 'Upload and convert cover'}</button><input ref={coverRef} hidden type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={event => void handleCover(event.target.files?.[0])} />
        {coverInfo && <p className="studio-help"><strong>WebP ready:</strong> {coverInfo}</p>}{coverError && <p className="studio-help is-error" role="alert">{coverError}</p>}
        <button className="button-primary studio-export" disabled={Boolean(validation?.errors.length)} onClick={() => download(`${post.slug || 'blog'}.md`, serializePost(post), 'text/markdown')}><Download size={17} /> Export validated Markdown</button><p className="studio-help">Commit the exported file to <code>content/blog/{post.slug || '{slug}'}.md</code> and the optimized cover to <code>public/blog/{post.slug || '{slug}'}/cover.webp</code>. Drafts are never included in the public bundle.</p>
        {coverFile && <button className="cover-upload" onClick={() => download('cover.webp', coverFile, 'image/webp')}><Download size={17} /> Export WebP cover</button>}
      </aside>
      <main className="studio-preview"><p className="section-kicker">Full article preview</p><article><header><span>{post.category || 'Category'}</span><h1>{post.title || 'Untitled article'}</h1><p>{post.description || 'Article description'}</p><small>{post.author} · {post.date || 'Publish date'} · {post.readingTime} min read</small></header>{(coverPreview || post.cover) && <img className="preview-cover" src={coverPreview || post.cover} alt={post.coverAlt} />}<MarkdownContent body={post.body} /></article></main>
      {publishMessage && <aside className={publishedCommit ? 'studio-result is-success' : 'studio-result is-error'} role="status"><p>{publishMessage}</p>{publishedCommit && <a href={publishedCommit} target="_blank" rel="noopener noreferrer">View GitHub commit</a>}</aside>}
    </div>}</>}
  </div>
}
