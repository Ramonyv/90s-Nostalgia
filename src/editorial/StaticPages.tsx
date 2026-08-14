import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { creatorLinks } from '../config/site'
import { scenes } from '../data/scenes'
import { openCookieSettings } from './ConsentManager'
import { SEO } from './SEO'

type PageSection = { heading: string; paragraphs: string[] }

function TextPage({ title, eyebrow, intro, sections, updated }: { title: string; eyebrow: string; intro: string; sections: PageSection[]; updated?: string }) {
  return <><SEO title={title} description={intro} canonicalPath={`/${title.toLowerCase().replace(/\s+/g, '-')}`} /><article className="text-page"><header><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>{updated && <small>Last updated: {updated}</small>}</header>{sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}</article></>
}

export function MemoriesIndex() {
  return <><SEO title="Memories" description="Explore illustrated scenes of everyday life in 1990s India." canonicalPath="/memories" /><section className="memories-page"><header><p className="eyebrow">An interactive archive</p><h1>Everyday India,<br />remembered in scenes.</h1><p>Enter neighbourhood salons, railway platforms, monsoon lanes and the ordinary places that stayed with us.</p></header><div className="memories-grid">{scenes.map(scene => <article key={scene.id}><Link to={scene.slug}><img src={scene.desktopBackground} alt={`${scene.title}, an illustrated Indian memory from ${scene.year}`} width="900" height="600" loading="lazy" /><div><p><span>{scene.year}</span><span>Everyday India</span></p><h2>{scene.title}</h2><p>{scene.description}</p><span className="text-link">Enter memory <ArrowRight size={15} /></span></div></Link></article>)}</div></section></>
}

export function AboutPage() {
  return <><SEO title="About" description="How 90s Yaadein turns everyday memories of 1990s India into interactive digital experiences." canonicalPath="/about" /><article className="about-page"><header><div><p className="eyebrow">About the archive</p><h1>90s Yaadein</h1><p>An interactive archive of everyday India.</p></div><img src="/scenes/salon.webp" alt="An illustrated neighbourhood Indian salon in the 1990s" width="1200" height="800" /></header><section className="about-intro"><h2>What if nostalgia could be experienced instead of only remembered?</h2><div><p>90s Yaadein began with that simple question. It brings ordinary places back into focus: the salon chair, the platform bench, a cassette counter, a lane turned cricket pitch, and the family gathered around one television.</p><p>The project exists to preserve the texture of everyday memory—not as documentary reconstruction, but as an interactive, illustrated interpretation shaped by recollection.</p></div></section><section className="process-list"><p className="section-kicker">How a scene is made</p><ol><li><strong>Remember</strong><span>Start with a place, sound, object or ritual that feels culturally specific.</span></li><li><strong>Illustrate</strong><span>Build a visual world from details that carry the memory.</span></li><li><strong>Give it sound</strong><span>Ambient audio and music restore the rhythm around the image.</span></li><li><strong>Add interaction</strong><span>Motion and small discoveries let visitors inhabit the scene.</span></li></ol></section><section className="creator-profile"><img src="/creator-raman.webp" alt="Raman, creator of 90s Yaadein" width="400" height="400" /><div><p className="section-kicker">Creator</p><h2>Raman</h2><p>Multidisciplinary Designer</p><p>Raman explores how interaction, illustration, sound and technology can turn everyday memories into digital experiences.</p><div>{creatorLinks.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div></div></section><section className="disclosure"><h2>Illustration and AI-assisted production</h2><p>Some illustrations and production elements are created with the assistance of generative tools and are art-directed, selected, edited and integrated by Raman. These scenes are artistic interpretations, not documentary photographs.</p></section></article></>
}

export function ContactPage() {
  return <><SEO title="Contact" description="Contact Raman, creator of 90s Yaadein, through verified social channels." canonicalPath="/contact" /><section className="contact-page"><p className="eyebrow">Say hello</p><h1>Contact</h1><p>For thoughtful feedback, corrections, collaborations or questions about the archive, reach Raman through one of the verified profiles below.</p><div>{creatorLinks.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"><span>{link.label}</span><ArrowRight size={18} /></a>)}</div><small>No contact form is used, so this page does not collect message data.</small></section></>
}

export const PrivacyPage = () => <TextPage title="Privacy" eyebrow="Your privacy" intro="This page explains the limited data and browser storage used by 90s Yaadein." updated="14 August 2026" sections={[
  { heading: 'What the site uses', paragraphs: ['Google Analytics is installed to measure visits and page use when analytics consent is granted. It may process device, browser and approximate location information, including IP-derived information, according to Google’s own terms.', 'The immersive player stores Spotify/player preferences in local storage and session details such as intro state and volume in session storage. This information remains in your browser. Hosting providers may keep standard server logs for security and delivery.'] },
  { heading: 'Advertising', paragraphs: ['Google AdSense is not active by default. If it is enabled after approval, advertising storage will remain subject to the site’s consent configuration and the selected Google-certified consent platform where required.'] },
  { heading: 'Third parties and contact', paragraphs: ['Spotify, Google, and external social links have their own privacy practices. No contact form is currently used, and 90s Yaadein does not receive message data through this site. You can manage optional storage through Cookie Settings or clear site data in your browser.'] },
]} />

export const TermsPage = () => <TextPage title="Terms" eyebrow="Using the archive" intro="These concise terms describe the purpose and reasonable use of 90s Yaadein." updated="14 August 2026" sections={[
  { heading: 'Purpose and interpretation', paragraphs: ['90s Yaadein is an artistic and editorial project about everyday memories of 1990s India. Illustrated scenes are interpretive and should not be treated as documentary photographs or definitive historical records.'] },
  { heading: 'Intellectual property', paragraphs: ['Original illustrations, interactions, writing, branding and production elements belong to their respective rights holders and may not be republished as your own. External music and services remain subject to their providers’ terms.'] },
  { heading: 'Availability and links', paragraphs: ['The project may change, pause or remove features as it evolves. External links are provided for context or convenience; 90s Yaadein does not control their content. To the extent reasonably permitted, the site is provided without guarantees of uninterrupted availability.'] },
]} />

export const EditorialPolicyPage = () => <TextPage title="Editorial Policy" eyebrow="How we publish" intro="90s Yaadein publishes original writing about memory, culture and everyday life." updated="14 August 2026" sections={[
  { heading: 'Originality and context', paragraphs: ['Articles are written for this archive. Material is not copied, scraped or mass-produced from other publications. Historical claims should be verified where appropriate; personal memory and opinion are identified by their context and may differ between families, cities and regions.'] },
  { heading: 'Human editorial responsibility', paragraphs: ['AI may assist research organisation, image generation, editing and development. Human editorial judgment remains responsible for what is published. Some illustrations and production elements are created with the assistance of generative tools and are art-directed, selected, edited and integrated by Raman.'] },
  { heading: 'Sources and corrections', paragraphs: ['Factual articles can include a sources section and links to original or authoritative material. Errors can be corrected and the updated date changed. Corrections and thoughtful feedback can be sent through the verified links on the Contact page.'] },
]} />

export const AccessibilityPage = () => <TextPage title="Accessibility" eyebrow="A more welcoming archive" intro="90s Yaadein aims to make its editorial pages and interactive memories usable by as many people as practical." updated="14 August 2026" sections={[
  { heading: 'What we support', paragraphs: ['Editorial pages use semantic headings, keyboard-accessible links and controls, visible focus styles, descriptive image text and readable contrast. Layouts adapt to smaller screens. Motion is reduced when your operating system requests reduced motion.', 'The immersive scenes include keyboard-focusable hotspots, labeled audio and fullscreen controls, static scene options and reduced-motion fallbacks. Some highly visual or audio-led parts may still present limitations.'] },
  { heading: 'Feedback', paragraphs: ['Accessibility is an ongoing process. If something prevents you from using the archive, contact Raman through a verified profile on the Contact page and describe the page and issue.'] },
]} />

export function CookiesPage() {
  return <><TextPage title="Cookies" eyebrow="Preference guide" intro="90s Yaadein separates browser storage into necessary, analytics and advertising choices." updated="14 August 2026" sections={[
    { heading: 'Necessary', paragraphs: ['Used for consent choices, player preferences, intro state and volume. These support core site behavior and do not require advertising to function.'] },
    { heading: 'Analytics', paragraphs: ['Google Analytics measurement is requested only after analytics consent. It helps understand which pages are visited and how the archive is used.'] },
    { heading: 'Advertising', paragraphs: ['Reserved for a future approved AdSense configuration. Advertising is currently disabled by default and no empty ad spaces are shown. A Google-certified consent platform can be connected before production advertising where required.'] },
  ]} /><div className="cookie-page-action"><button className="button-primary" onClick={openCookieSettings}>Open Cookie Settings</button></div></>
}

export function NotFoundPage() {
  return <><SEO title="Memory not found" description="This memory could not be found." canonicalPath="/404" noindex /><section className="not-found"><p>404</p><h1>यह याद शायद<br />कहीं खो गई।</h1><p>The page you were looking for is no longer here—or perhaps it only existed in memory.</p><div><Link className="button-primary" to="/memories">Explore Memories</Link><Link to="/journal">Read Journal <ArrowRight size={15} /></Link></div></section></>
}
