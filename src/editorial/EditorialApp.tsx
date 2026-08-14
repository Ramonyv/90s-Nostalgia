import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { EditorialLayout } from './EditorialLayout'
import { AboutPage, AccessibilityPage, ContactPage, CookiesPage, EditorialPolicyPage, MemoriesIndex, NotFoundPage, PrivacyPage, TermsPage } from './StaticPages'
import './editorial.css'

const ArticlePage = lazy(() => import('./JournalPages').then(module => ({ default: module.ArticlePage })))
const JournalIndex = lazy(() => import('./JournalPages').then(module => ({ default: module.JournalIndex })))
const BlogStudio = lazy(() => import('./BlogStudio').then(module => ({ default: module.BlogStudio })))
const journalFallback = <div className="route-loader route-loader--paper">Loading journal…</div>

export function EditorialApp() {
  return <Routes>
    <Route element={<EditorialLayout />}>
      <Route path="/memories" element={<MemoriesIndex />} />
      <Route path="/journal" element={<Suspense fallback={journalFallback}><JournalIndex /></Suspense>} />
      <Route path="/journal/:slug" element={<Suspense fallback={journalFallback}><ArticlePage /></Suspense>} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route path="/admin/blog" element={<Suspense fallback={<div className="route-loader route-loader--paper">Loading Blog Studio…</div>}><BlogStudio /></Suspense>} />
  </Routes>
}
