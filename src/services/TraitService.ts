import { electric } from '@/lib/electric'

export interface Trait {
  id: string
  trait: string
  source: string
  createdAt: string
}

/**
 * Simple storage for user traits discovered during onboarding or chat.
 * Traits are persisted in the ElectricSQL `settings` table under the `traits` key
 * as a JSON encoded array.
 */
export class TraitService {
  private static readonly STORAGE_KEY = 'traits'

  private static async getAll(): Promise<Trait[]> {
    const row = await electric.settings.get(this.STORAGE_KEY)
    if (!row?.value) return []
    try {
      return JSON.parse(row.value) as Trait[]
    } catch {
      return []
    }
  }

  private static async saveAll(traits: Trait[]) {
    await electric.settings.put({ key: this.STORAGE_KEY, value: JSON.stringify(traits) })
  }

  /**
   * Store a single trait with an optional source label.
   */
  static async addTrait(trait: string, source = 'unknown') {
    const traits = await this.getAll()
    traits.push({
      id: crypto.randomUUID(),
      trait,
      source,
      createdAt: new Date().toISOString()
    })
    await this.saveAll(traits)
  }

  /**
   * Extract traits from free form text and store them.
   * Currently uses a simple keyword match against a small set of common traits.
   * Returns the traits that were found.
   */
  static async addFromInput(input: string, source = 'input'): Promise<string[]> {
    const traits = this.extractTraits(input)
    for (const t of traits) {
      await this.addTrait(t, source)
    }
    return traits
  }

  /**
   * Naive trait extraction based on a list of keywords.
   */
  private static extractTraits(text: string): string[] {
    const keywords = [
      'organized',
      'creative',
      'reliable',
      'punctual',
      'curious',
      'disciplined',
      'empathetic',
      'ambitious',
      'patient',
      'adaptable'
    ]
    const lower = text.toLowerCase()
    const found = keywords.filter(k => lower.includes(k))
    return Array.from(new Set(found))
  }
}
