import { connect } from './waku'
import { createEncoder, createDecoder } from '@waku/sdk'

export const wakuTopics = {
  chat: '/lifepilot/1/chat',
  instagramAccounts: '/aura/instagram-agent/accounts/1/app',
  instagramIdeas: '/aura/instagram-agent/ideas/1/app',
  instagramEngagements: '/aura/instagram-agent/engagements/1/app',
  instagramCaptions: '/aura/instagram-agent/captions/1/app',
  youtubeTitles: '/aura/youtube-agent/titles/1/app',
  youtubeThumbnails: '/aura/youtube-agent/thumbnails/1/app',
  youtubeScripts: '/aura/youtube-agent/scripts/1/app',
  growthProgress: '/aura/growth-agent/progress/1/app',
  fiverrFreelancers: '/aura/fiverr-agent/freelancers/1/app',
  fiverrGigs: '/aura/fiverr-agent/gigs/1/app',
  ideaMappings: '/aura/idea-mapper/mappings/1/app',
  gamePlayerState: (playerId: string) => `/game/players/${playerId}/state`,
  userProfile: (pubkey: string) => `/aura/users/${pubkey}/profile`,
  userConfig: (pubkey: string) => `/aura/users/${pubkey}/config`,
  userTraits: (pubkey: string) => `/aura/users/${pubkey}/traits`
} as const;

export const ACCOUNT_TOPIC = wakuTopics.instagramAccounts;
export const IDEAS_TOPIC = wakuTopics.instagramIdeas;
export const ENGAGEMENT_TOPIC = wakuTopics.instagramEngagements;
export const CAPTIONS_TOPIC = wakuTopics.instagramCaptions;
export const YT_TITLES_TOPIC = wakuTopics.youtubeTitles;
export const YT_THUMBNAILS_TOPIC = wakuTopics.youtubeThumbnails;
export const YT_SCRIPTS_TOPIC = wakuTopics.youtubeScripts;

export const PROGRESS_TOPIC = wakuTopics.growthProgress;
export const FIVERR_FREELANCERS_TOPIC = wakuTopics.fiverrFreelancers;
export const FIVERR_GIGS_TOPIC = wakuTopics.fiverrGigs;
export const IDEA_MAPPINGS_TOPIC = wakuTopics.ideaMappings;

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
