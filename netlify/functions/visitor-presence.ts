import { handleVisitorPresence } from '../../server/presence-api'
import { requestFromEvent, responseForNetlify } from './_blog-adapter'
import { netlifyPresenceStore } from './_presence-store'

export const handler = async (event: Parameters<typeof requestFromEvent>[0]) => responseForNetlify(
  await handleVisitorPresence(requestFromEvent(event), netlifyPresenceStore()),
)
