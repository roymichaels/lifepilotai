export const wakuTopics = {
  chat: '/lifepilot/1/chat',
  instagramAccounts: '/aura/instagram-agent/accounts/1/app',
  instagramIdeas: '/aura/instagram-agent/ideas/1/app',
  instagramEngagements: '/aura/instagram-agent/engagements/1/app'
} as const;

export type WakuTopic = typeof wakuTopics[keyof typeof wakuTopics];
