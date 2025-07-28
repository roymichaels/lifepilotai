export class TraitService {
  private static storageKey(projectId: string) {
    return `traits_${projectId}`;
  }

  static async getTraits(projectId: string): Promise<string[]> {
    if (!projectId) return [];
    try {
      const raw = localStorage.getItem(this.storageKey(projectId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static async addTrait(projectId: string, trait: string): Promise<void> {
    const traits = await this.getTraits(projectId);
    if (!traits.includes(trait)) {
      traits.push(trait);
      localStorage.setItem(this.storageKey(projectId), JSON.stringify(traits));
    }
  }

  static async removeTrait(projectId: string, trait: string): Promise<void> {
    const traits = await this.getTraits(projectId);
    const updated = traits.filter(t => t !== trait);
    localStorage.setItem(this.storageKey(projectId), JSON.stringify(updated));
  }
}
