import { motion } from 'framer-motion'

export function NetlifyCredit() {
  return <motion.a
    className="netlify-credit"
    href="https://www.netlify.com/"
    target="_blank"
    rel="noreferrer"
    aria-label="This memory lives on Netlify (opens in a new tab)"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: .45, delay: .75, ease: [0.22, 1, 0.36, 1] }}
  >
    <img src="/Netlify%20Logo.svg" alt="" aria-hidden="true" />
    <span>This memory lives on <strong>Netlify</strong></span>
    <b aria-hidden="true">↗</b>
  </motion.a>
}
