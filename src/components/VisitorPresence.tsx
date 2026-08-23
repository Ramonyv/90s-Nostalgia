import { useVisitorPresence } from '../hooks/useVisitorPresence'

export function VisitorPresence() {
  const presence = useVisitorPresence()
  const visitorLabel = presence.count === 1 ? 'person' : 'people'
  const title = presence.available
    ? `${presence.count} ${visitorLabel} active now. Each active visitor adds 100 nostalgia points.`
    : 'You add 100 nostalgia points while you are here.'

  return <aside className="visitor-presence" aria-label={title} title={title}>
    <i aria-hidden="true" />
    <span>{presence.available ? <><strong>{presence.count}</strong> {visitorLabel} here now</> : <>You’re here</>}</span>
    <b>{presence.points.toLocaleString()} nostalgia points</b>
  </aside>
}
