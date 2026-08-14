import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { EditorialLayout } from './EditorialLayout'
import { ArticlePage, JournalIndex } from './JournalPages'
import { AboutPage, AccessibilityPage, ContactPage, CookiesPage, EditorialPolicyPage, MemoriesIndex, NotFoundPage, PrivacyPage, TermsPage } from './StaticPages'
import './editorial.css'

const BlogStudio = lazy(() => import('./BlogStudio').then(module => ({ default: module.BlogStudio })))

export function EditorialApp() {
  return <Routes>
    <Route element={<EditorialLayout />}>
      <Route path="/memories" element={<MemoriesIndex />} />
      <Route path="/journal" element={<JournalIndex />} />
      <Route path="/journal/:slug" element={<ArticlePage />} />
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
