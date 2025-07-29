import { electric } from '@/lib/electric'

export interface WakuIdentity {
  id: string
  createdAt: string
}

const STORAGE_KEY = 'waku-identity'

export class WakuIdentityService {
  static async getIdentity(): Promise<WakuIdentity | null> {
    const row = await electric.settings.get(STORAGE_KEY)
    if (!row?.value) return null
    try {
      return JSON.parse(row.value) as WakuIdentity
    } catch {
      return null
    }
  }

  static async createIdentity(): Promise<WakuIdentity> {
    const identity: WakuIdentity = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    await electric.settings.put({ key: STORAGE_KEY, value: JSON.stringify(identity) })
    return identity
  }

  static async clearIdentity(): Promise<void> {
    await electric.settings.delete(STORAGE_KEY)
  }
}
