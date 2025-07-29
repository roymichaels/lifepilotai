export const wakuTopics = {
  chat: '/lifepilot/1/chat',
  instagramAccounts: '/aura/instagram-agent/accounts/1/app',
  instagramIdeas: '/aura/instagram-agent/ideas/1/app',
  instagramEngagements: '/aura/instagram-agent/engagements/1/app',
  userProfile: (pubkey: string) => `/aura/users/${pubkey}/profile`,
  userConfig: (pubkey: string) => `/aura/users/${pubkey}/config`,
  userTraits: (pubkey: string) => `/aura/users/${pubkey}/traits`
} as const;

export type WakuTopic = typeof wakuTopics[keyof typeof wakuTopics];
