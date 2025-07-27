import {
  createLightNode,
  waitForRemotePeer,
  createEncoder,
  createDecoder,
  LightNode,
  DecodedMessage
} from '@waku/sdk'

import type { ChatMessage } from '@/types/chat'

const CONTENT_TOPIC = '/lifepilot/1/chat'

let node: LightNode | null = null

export async function connect(): Promise<LightNode> {
  if (node) return node
  node = await createLightNode({ defaultBootstrap: true })
  await node.start()
  await waitForRemotePeer(node)
  return node
}

export async function send(message: ChatMessage): Promise<void> {
  if (!node) throw new Error('Waku not connected')
  const encoder = createEncoder({ contentTopic: CONTENT_TOPIC })
  const payload = new TextEncoder().encode(JSON.stringify(message))
  await node.lightPush.send(encoder, { payload })
}

export async function listen(
  callback: (msg: ChatMessage, raw: DecodedMessage) => void
) {
  if (!node) throw new Error('Waku not connected')
  const decoder = createDecoder(CONTENT_TOPIC)
  const sub = await node.filter.subscribe(decoder, msg => {
    if (!msg.payload) return
    try {
      const text = new TextDecoder().decode(msg.payload)
      const data = JSON.parse(text) as ChatMessage
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
