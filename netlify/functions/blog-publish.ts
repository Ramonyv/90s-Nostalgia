import { handleBlogPublish } from '../../server/blog-api'
import { requestFromEvent, responseForNetlify, serverEnv } from './_blog-adapter'

export const handler = async (event: Parameters<typeof requestFromEvent>[0]) => responseForNetlify(await handleBlogPublish(requestFromEvent(event), serverEnv()))
