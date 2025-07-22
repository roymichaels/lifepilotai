import { electric } from '@/lib/electric'

export class AuraMemoryService {
  private static readonly STORAGE_KEY = 'aura_conversation'

  /** add one message (user or aura) to end of the log */
  static addMessage(message: { sender: 'user' | 'aura'; text: string; timestamp?: string }) {
    const convo = this.getConversation()
    convo.push({
      ...message,
      timestamp: message.timestamp ?? new Date().toISOString()
    })
    this.saveConversation(convo)
  }

  /** get full array of all messages */
  static getConversation(): Array<{ sender: string; text: string; timestamp: string }> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  /** overwrite entire conversation */
  private static saveConversation(convo: any[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(convo))
  }

  /** completely wipe memory */
  static clearConversation() {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * Generate a simple text summary of the conversation and persist it
   * in the ElectricSQL summaries table using the provided project id.
   */
  static persistSummary(projectId: string) {
    const convo = this.getConversation()
    const summary = convo.map(m => m.text).join(' ').slice(0, 200)
    electric.summaries.put({ id: projectId, summary, createdAt: new Date().toISOString() })
  }
}
