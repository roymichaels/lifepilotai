import { World, Entity } from './ecs'

export interface Position { x: number; y: number }
export interface Velocity { x: number; y: number }

export function movementSystem(world: World, dt: number) {
  const entities = world.query('position', 'velocity')
  for (const { entity, components } of entities) {
    const pos = components.position as Position
    const vel = components.velocity as Velocity
    pos.x += vel.x * dt
    pos.y += vel.y * dt
    world.addComponent(entity, 'position', pos)
  }
}
