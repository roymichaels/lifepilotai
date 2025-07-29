import {
  createLightNode,
  waitForRemotePeer,
  createEncoder,
  createDecoder,
  LightNode,
  DecodedMessage
} from '@waku/sdk'
import type { WakuTopic } from './wakuTopics'
import { loadConfig } from '@/services/ConfigService'

const CONTENT_TOPIC = '/lifepilot/1/chat'

let node: LightNode | null = null

let VITE_WAKU_RELAY_URL: string | undefined
loadConfig().then(cfg => {
  VITE_WAKU_RELAY_URL = cfg?.wakuRelayUrl
})

export async function connect(): Promise<LightNode> {
  if (node) return node
  node = await createLightNode(
    VITE_WAKU_RELAY_URL
      ? { bootstrapPeers: [VITE_WAKU_RELAY_URL] }
      : { defaultBootstrap: true }
  )
  await node.start()
  await waitForRemotePeer(node)
  return node
}

export async function send(message: any, topic: WakuTopic = CONTENT_TOPIC): Promise<void> {
  if (!node) throw new Error('Waku not connected')
  const encoder = createEncoder({ contentTopic: topic })
  const payload = new TextEncoder().encode(JSON.stringify(message))
  await node.lightPush.send(encoder, { payload })
}

export async function sendOnTopic(topic: string, data: any): Promise<void> {
  if (!node) throw new Error('Waku not connected')
  const encoder = createEncoder({ contentTopic: topic })
  const payload = new TextEncoder().encode(JSON.stringify(data))
  await node.lightPush.send(encoder, { payload })
}

export async function listen(
  callback: (msg: any, raw: DecodedMessage) => void,
  topic: WakuTopic = CONTENT_TOPIC
) {
  if (!node) throw new Error('Waku not connected')
  const decoder = createDecoder(topic)
  const sub = await node.filter.subscribe(decoder, msg => {
    if (!msg.payload) return
    try {
      const text = new TextDecoder().decode(msg.payload)
      const data = JSON.parse(text)
      callback(data, msg)
    } catch (err) {
      console.error('[waku] failed to decode message', err)
    }
  })
  return sub
}

export async function disconnect() {
  if (node) {
    await node.stop()
    node = null
  }
}
