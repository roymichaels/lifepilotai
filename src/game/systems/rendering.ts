import { World } from './ecs'
import type { Position } from './movement'

export type RenderCallback = (pos: Position) => void

export function renderingSystem(world: World) {
  const entities = world.query('position', 'render')
  for (const { components } of entities) {
    const pos = components.position as Position
    const render = components.render as RenderCallback
    render({ ...pos })
  }
}
