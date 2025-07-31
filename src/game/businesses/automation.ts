import { useCallback } from 'react'
import { IpfsService } from '@/services/IpfsService'
import { sendMessage, wakuTopics } from '@/lib/wakuTopics'

/**
 * Publish a marketing task for a business. Agents listening on the
 * marketing topic can pick these up and automate outreach.
 */
export async function publishMarketingTask(
  businessId: string,
  task: Record<string, any>
): Promise<string | undefined> {
  try {
    const hash = await IpfsService.uploadJson({ businessId, task })
    await sendMessage(wakuTopics.businessMarketing, {
      businessId,
      hash,
      createdAt: new Date().toISOString()
    })
    return hash
  } catch (err) {
    console.error('[Automation] failed to publish marketing task', err)
    return undefined
  }
}

export function useBusinessAutomation(businessId: string) {
  return {
    publishMarketingTask: useCallback(
      async (task: Record<string, any>) =>
        publishMarketingTask(businessId, task),
      [businessId]
    )
  }
}
