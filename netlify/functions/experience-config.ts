import { handleExperienceConfig } from '../../server/experience-api'
import { requestFromEvent, responseForNetlify, serverEnv } from './_blog-adapter'
import { netlifyExperienceStore } from './_experience-store'

export const handler = async (event: Parameters<typeof requestFromEvent>[0]) => responseForNetlify(await handleExperienceConfig(requestFromEvent(event), serverEnv(), netlifyExperienceStore()))
