import { connect, send } from '@/lib/waku'
import { wakuTopics } from '@/lib/wakuTopics'
import { x25519 } from '@noble/curves/ed25519'

export interface WakuIdentity {
  pubKey: string
  privKey: string
}

const STORAGE_KEY = 'waku-keypair'

export class WakuIdentityService {
  static getIdentity(): WakuIdentity | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as WakuIdentity
    } catch {
      return null
    }
  }

  static async createIdentity(profile: any = {}, config: any = {}): Promise<WakuIdentity> {
    const existing = this.getIdentity()
    if (existing) return existing

    const priv = x25519.utils.randomPrivateKey()
    const pub = x25519.getPublicKey(priv)
    const identity: WakuIdentity = {
      privKey: Buffer.from(priv).toString('hex'),
      pubKey: Buffer.from(pub).toString('hex')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identity))

    try {
      await connect()
      await send({ profile }, wakuTopics.userProfile(identity.pubKey))
      await send({ config }, wakuTopics.userConfig(identity.pubKey))
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[waku] failed to publish identity', err)
    }

    return identity
  }

  static clearIdentity() {
    localStorage.removeItem(STORAGE_KEY)
  }
}
