/// --- Set up a system ---

/ Initiate event manager
const events = new EventManager()

// Define an event type
@EventConstructor()
class UpdateEvent {
  entity: Entity
  dt: number
  constructor(public entity: Entity, public dt: number) {
    this.entity = entity
    this.dt = dt
  }
}

// Define a system
export class RotatorSystem implements ISystem {
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    for (let entity of this.group.entities) {
      // Emit custom event
      events.fireEvent(new UpdateEvent(entity, dt))
    }
  }
}

engine.addSystem(new RotatorSystem())

// Add a listener
events.addListener(UpdateEvent, null, ({ entity, dt }) => {
  const transform = entity.getComponent(Transform)
  const euler = transform.rotation.eulerAngles
  euler.y += dt * 10
  transform.rotation.eulerAngles = euler
})

// Add an entity to work with
const cube = new Entity()
const transform = new Transform()

cube.addComponentOrReplace(transform)
transform.position.set(5, 0, 5)

const boxShape = new BoxShape()
cube.addComponentOrReplace(boxShape)

engine.addEntity(cube)