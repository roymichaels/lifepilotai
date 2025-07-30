import { connect } from './waku'
import { createEncoder, createDecoder } from '@waku/sdk'

export const wakuTopics = {
  chat: '/lifepilot/1/chat',
  instagramAccounts: '/aura/instagram-agent/accounts/1/app',
  instagramIdeas: '/aura/instagram-agent/ideas/1/app',
  instagramEngagements: '/aura/instagram-agent/engagements/1/app',
  instagramCaptions: '/aura/instagram-agent/captions/1/app',
  userProfile: (pubkey: string) => `/aura/users/${pubkey}/profile`,
  userConfig: (pubkey: string) => `/aura/users/${pubkey}/config`,
  userTraits: (pubkey: string) => `/aura/users/${pubkey}/traits`
} as const;

export const ACCOUNT_TOPIC = wakuTopics.instagramAccounts;
export const IDEAS_TOPIC = wakuTopics.instagramIdeas;
export const CAPTIONS_TOPIC = wakuTopics.instagramCaptions;

export type WakuTopic = typeof wakuTopics[keyof typeof wakuTopics];

export async function sendMessage(topic: string, data: any) {
  const node: any = await connect()
  const encoder = createEncoder({ contentTopic: topic })
  const payload = new TextEncoder().encode(JSON.stringify(data))
  await node.lightPush.send(encoder, { payload })
}

export async function subscribeToTopic<T>(
  topic: string,
  handler: (data: T, raw: any) => void
) {
  const node: any = await connect()
  const decoder = createDecoder(topic)
  const sub = await node.filter.subscribe(decoder, (msg: any) => {
    if (!msg.payload) return
    try {
      const text = new TextDecoder().decode(msg.payload)
      const data = JSON.parse(text) as T
      handler(data, msg)
    } catch (err) {
      console.error('[waku] failed to decode message', err)
    }
  })
  return sub
}
