import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useMemo } from 'react'

const directiveClasses: Record<string, string> = {
  memorycallout: 'md-callout md-callout--memory', memory: 'md-callout md-callout--memory',
  factbox: 'md-callout md-callout--fact', quote: 'md-callout md-callout--quote',
  imagewithcaption: 'md-callout md-callout--image', relatedmemory: 'md-callout md-callout--memory',
  relatedarticle: 'md-callout md-callout--article', article: 'md-callout md-callout--article',
  sources: 'md-callout md-callout--sources',
}

function expandDirectives(markdown: string) {
  return markdown.replace(/^:::(\w+)\s*\n([\s\S]*?)\n:::\s*$/gm, (_match, type: string, content: string) => {
    const className = directiveClasses[type.toLowerCase()]
    return className ? `<aside class="${className}">${marked.parse(content, { async: false, gfm: true }) as string}</aside>` : content
  })
}

export function MarkdownContent({ body }: { body: string }) {
  const html = useMemo(() => {
    const rendered = marked.parse(expandDirectives(body), { async: false, gfm: true, breaks: false }) as string
    return DOMPurify.sanitize(rendered, { ADD_ATTR: ['target', 'rel'], ADD_TAGS: ['figure', 'figcaption'] })
      .replace(/<a href="(https?:\/\/)/g, '<a target="_blank" rel="noopener noreferrer" href="$1')
  }, [body])
  return <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
}
