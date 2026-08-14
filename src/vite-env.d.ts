/// <reference types="vite/client" />

declare module 'virtual:published-blog' {
  const articles: Record<string, string>
  export default articles
}

interface ImportMetaEnv {
  readonly SITE_URL: string
}
