import { createEncoder, createDecoder, DecodedMessage } from '@waku/sdk'
import { connect } from './waku'

export const ACCOUNT_TOPIC = '/aura/instagram-agent/accounts/1/app'
export const IDEAS_TOPIC = '/aura/instagram-agent/ideas/1/app'

export type MessageHandler<T = any> = (data: T, raw: DecodedMessage) => void

export async function sendMessage(topic: string, payload: any): Promise<void> {
  const node = await connect()
  const encoder = createEncoder({ contentTopic: topic })
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  await node.lightPush.send(encoder, { payload: bytes })
}

export async function subscribeToTopic<T = any>(
  topic: string,
  handler: MessageHandler<T>
) {
  const node = await connect()
  const decoder = createDecoder(topic)
  const sub = await node.filter.subscribe(decoder, msg => {
    if (!msg.payload) return
    try {
      const text = new TextDecoder().decode(msg.payload)
      const data = JSON.parse(text) as T
      handler(data, msg)
    } catch (err) {
      console.error('[wakuTopics] failed to decode message', err)
    }
  })
  return sub
}
