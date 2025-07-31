export type Entity = number

export class World {
  private nextId = 1
  private components = new Map<string, Map<Entity, any>>()

  createEntity(): Entity {
    return this.nextId++
  }

  addComponent<T>(entity: Entity, name: string, data: T): void {
    let bucket = this.components.get(name)
    if (!bucket) {
      bucket = new Map<Entity, T>()
      this.components.set(name, bucket)
    }
    bucket.set(entity, data)
  }

  getComponent<T>(entity: Entity, name: string): T | undefined {
    return this.components.get(name)?.get(entity)
  }

  removeComponent(entity: Entity, name: string): void {
    this.components.get(name)?.delete(entity)
  }

  removeEntity(entity: Entity): void {
    for (const bucket of this.components.values()) {
      bucket.delete(entity)
    }
  }

  query(...names: string[]) {
    const results: Array<{ entity: Entity; components: Record<string, any> }> = []
    const first = this.components.get(names[0])
    if (!first) return results
    for (const [entity, data] of first.entries()) {
      const components: Record<string, any> = { [names[0]]: data }
      let ok = true
      for (let i = 1; i < names.length; i++) {
        const bucket = this.components.get(names[i])
        if (!bucket) {
          ok = false
          break
        }
        const comp = bucket.get(entity)
        if (comp === undefined) {
          ok = false
          break
        }
        components[names[i]] = comp
      }
      if (ok) results.push({ entity, components })
    }
    return results
  }
}
