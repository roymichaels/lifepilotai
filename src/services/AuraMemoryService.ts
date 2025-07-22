import { electric } from '@/lib/electric'
import type { ChatMessage } from '@/types/chat'

export class AuraMemoryService {
  private static readonly MEMORY_THRESHOLD = 20

  /** add one message to the project conversation */
  static async addMessage(
    projectId: string,
    message: { sender: 'user' | 'aura'; text: string; timestamp?: string }
  ) {
    await electric.messages.add({
      projectId,
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp ?? new Date().toISOString()
    })
    await this.summarizeIfNeeded(projectId)
  }

  /** get full array of all messages for a project */
  static async getConversation(projectId: string): Promise<ChatMessage[]> {
    return await electric.messages
      .where('projectId')
      .equals(projectId)
      .sortBy('timestamp')
  }

  /** wipe conversation for a project */
  static async clearConversation(projectId: string) {
    await electric.messages.where('projectId').equals(projectId).delete()
  }

  /**
   * Generate a text summary of the conversation and persist it
   * in the ElectricSQL summaries table using the provided project id.
   */
  static async persistSummary(projectId: string) {
    const convo = await this.getConversation(projectId)
    const summary = await this.generateSummary(convo)
    await electric.summaries.put({
      id: projectId,
      summary,
      createdAt: new Date().toISOString()
    })
  }

  /** summarize old messages when over threshold */
  private static async summarizeIfNeeded(projectId: string) {
    const convo = await this.getConversation(projectId)
    if (convo.length <= this.MEMORY_THRESHOLD) return

    const excess = convo.length - this.MEMORY_THRESHOLD
    const toSummarize = convo.slice(0, excess)
    const summary = await this.generateSummary(toSummarize)
    await electric.summaries.add({
      id: crypto.randomUUID(),
      summary,
      createdAt: new Date().toISOString()
    })
    const ids = toSummarize.map((m: any) => m.id)
    await electric.messages.bulkDelete(ids)
  }

  /** helper to call OpenAI to summarize text */
  private static async generateSummary(messages: ChatMessage[]): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    const prompt = messages
      .map(m => `${m.sender}: ${m.text}`)
      .join('\n')

    if (!apiKey) {
      return prompt.slice(0, 200)
    }

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Summarize: \n${prompt}` }],
          max_tokens: 150
        })
      })
      const data = await res.json()
      return data.choices?.[0]?.message?.content?.trim() ?? ''
    } catch {
      return prompt.slice(0, 200)
    }
  }
}
