import { World, Entity } from './ecs'
import type { Position } from './movement'

export type InteractionCallback = (other: Entity) => void

export function interactionSystem(world: World) {
  const entities = world.query('position', 'onInteract')
  for (let i = 0; i < entities.length; i++) {
    const a = entities[i]
    for (let j = i + 1; j < entities.length; j++) {
      const b = entities[j]
      const pa = a.components.position as Position
      const pb = b.components.position as Position
      if (Math.abs(pa.x - pb.x) < 1 && Math.abs(pa.y - pb.y) < 1) {
        const ia = a.components.onInteract as InteractionCallback
        const ib = b.components.onInteract as InteractionCallback
        ia(b.entity)
        ib(a.entity)
      }
    }
  }
}
