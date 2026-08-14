import { BookOpen, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { creatorLinks, SITE_DESCRIPTION } from '../config/site'
import { openCookieSettings } from './ConsentManager'

export function EditorialLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  return <div className="editorial-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="editorial-header">
      <Link className="editorial-brand" to="/salon"><strong><span>90s</span> यादें</strong><small>{SITE_DESCRIPTION}</small></Link>
      <button className="editorial-menu-button" type="button" onClick={() => setMenuOpen(value => !value)} aria-expanded={menuOpen} aria-controls="editorial-nav" aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      <nav id="editorial-nav" className={menuOpen ? 'is-open' : ''} aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
        <NavLink to="/memories">Memories</NavLink><NavLink to="/journal">Journal</NavLink><NavLink to="/about">About</NavLink>
      </nav>
    </header>
    <main id="main-content"><Outlet /></main>
    <footer className="editorial-footer">
      <div><Link className="footer-mark" to="/salon"><span>90s</span> यादें</Link><p>{SITE_DESCRIPTION}</p></div>
      <nav aria-label="Editorial links"><Link to="/journal">Journal</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/editorial-policy">Editorial Policy</Link><Link to="/accessibility">Accessibility</Link><Link to="/cookies">Cookies</Link><button type="button" onClick={openCookieSettings}>Cookie Settings</button></nav>
      <div className="footer-social"><BookOpen size={17} /><span>Made and edited by Raman</span>{creatorLinks.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div>
    </footer>
  </div>
}
