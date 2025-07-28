import { electric } from '@/lib/electric'

/**
 * Service for storing and retrieving character traits.
 * Traits are persisted per project in the ElectricSQL settings table.
 */
export class TraitService {
  private static key(projectId: string) {
    return `traits_${projectId}`
  }

  static async getTraits(projectId: string): Promise<string[]> {
    const row = await electric.settings.get(this.key(projectId))
    if (row?.value) {
      try {
        return JSON.parse(row.value) as string[]
      } catch {
        return []
      }
    }
    return []
  }

  static async addTrait(projectId: string, trait: string): Promise<string[]> {
    const traits = await this.getTraits(projectId)
    if (!traits.includes(trait)) {
      const updated = [...traits, trait]
      await electric.settings.put({
        key: this.key(projectId),
        value: JSON.stringify(updated)
      })
      return updated
    }
    return traits
  }

  static async removeTrait(projectId: string, trait: string): Promise<string[]> {
    const traits = await this.getTraits(projectId)
    const updated = traits.filter(t => t !== trait)
    await electric.settings.put({
      key: this.key(projectId),
      value: JSON.stringify(updated)
    })
    return updated
  }
}

