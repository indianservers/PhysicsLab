import Matter from "matter-js";
import { EngineSnapshot, PhysicsObjectInstance, SimulationSettings } from "../types";

const SCALE = 50;
const FLOOR_Y = 560;

export class MatterSimulationEngine {
  private engine = Matter.Engine.create({ enableSleeping: false });
  private bodies = new Map<string, Matter.Body>();
  private constraints: Matter.Constraint[] = [];
  private objects: PhysicsObjectInstance[] = [];
  private simulationTime = 0;
  private warnings: string[] = [];

  constructor(objects: PhysicsObjectInstance[] = []) {
    this.engine.gravity.y = 0;
    this.setObjects(objects);
  }

  setObjects(objects: PhysicsObjectInstance[]) {
    this.objects = objects.map((object) => ({ ...object, trail: object.trail ?? [] }));
    Matter.Composite.clear(this.engine.world, false);
    this.bodies.clear();
    this.constraints = [];
    this.objects.forEach((object) => {
      const body = createBody(object);
      this.bodies.set(object.id, body);
      Matter.Composite.add(this.engine.world, body);
    });
    this.createEducationalConstraints();
  }

  syncObjects(objects: PhysicsObjectInstance[]) {
    const ids = objects.map((object) => object.id).join("|");
    const currentIds = this.objects.map((object) => object.id).join("|");
    if (ids !== currentIds) {
      this.setObjects(objects);
      return;
    }
    this.objects = objects.map((object) => ({ ...object }));
    for (const object of objects) {
      const body = this.bodies.get(object.id);
      if (!body) continue;
      Matter.Body.setPosition(body, { x: object.x, y: object.y });
      Matter.Body.setAngle(body, object.angle);
      Matter.Body.setVelocity(body, { x: object.vx * SCALE, y: object.vy * SCALE });
      Matter.Body.setAngularVelocity(body, object.motorSpeed ?? body.angularVelocity);
      Matter.Body.setStatic(body, object.isStatic || Boolean(object.locked));
      body.friction = object.friction;
      body.restitution = object.restitution;
    }
  }

  step(dtSeconds: number, settings: SimulationSettings): EngineSnapshot {
    const dt = clamp(dtSeconds * settings.timeScale, 1 / 240, 1 / 20);
    this.warnings = [];
    this.engine.gravity.y = settings.gravity / SCALE;
    this.applyEducationalForces(settings, dt);
    Matter.Engine.update(this.engine, dt * 1000);
    this.simulationTime += dt;
    return this.snapshot(settings);
  }

  setObjectPosition(id: string, x: number, y: number) {
    const body = this.bodies.get(id);
    if (!body) return;
    Matter.Body.setPosition(body, { x, y });
    Matter.Body.setVelocity(body, { x: 0, y: 0 });
  }

  resetTime() {
    this.simulationTime = 0;
  }

  private createEducationalConstraints() {
    for (const object of this.objects) {
      const body = this.bodies.get(object.id);
      if (!body) continue;
      if (object.kind === "pendulum") {
        const constraint = Matter.Constraint.create({
          bodyB: body,
          pointA: { x: object.pivotX ?? object.x, y: object.pivotY ?? object.y - (object.length ?? 140) },
          pointB: { x: 0, y: 0 },
          length: object.length ?? 140,
          stiffness: 1,
          damping: object.damping ?? 0.02,
        });
        this.constraints.push(constraint);
      }
      if (object.kind === "spring") {
        const constraint = Matter.Constraint.create({
          bodyB: body,
          pointA: { x: object.pivotX ?? object.x - (object.length ?? 120), y: object.pivotY ?? object.y },
          pointB: { x: 0, y: 0 },
          length: object.length ?? 120,
          stiffness: clamp((object.springConstant ?? 24) / 200, 0.01, 1),
          damping: object.damping ?? 0.05,
          render: { visible: false },
        });
        this.constraints.push(constraint);
      }
      if (object.kind === "rope") {
        const previous = this.findNearestDynamicBody(object.id, object.x, object.y);
        if (previous) {
          this.constraints.push(Matter.Constraint.create({
            bodyA: previous,
            bodyB: body,
            length: object.length ?? object.width ?? 150,
            stiffness: 0.92,
            damping: 0.02,
          }));
        }
      }
    }

    const pulleys = this.objects.filter((object) => object.kind === "pulley");
    const dynamicBodies = this.objects.filter((object) => !object.isStatic && !object.locked && object.kind !== "rope");
    for (const pulley of pulleys) {
      const left = dynamicBodies[0];
      const right = dynamicBodies[1];
      if (!left || !right) continue;
      const leftBody = this.bodies.get(left.id);
      const rightBody = this.bodies.get(right.id);
      if (!leftBody || !rightBody) continue;
      this.constraints.push(Matter.Constraint.create({ bodyA: leftBody, pointB: { x: pulley.x - 35, y: pulley.y }, length: 130, stiffness: 0.85 }));
      this.constraints.push(Matter.Constraint.create({ bodyA: rightBody, pointB: { x: pulley.x + 35, y: pulley.y }, length: 130, stiffness: 0.85 }));
    }

    if (this.constraints.length) Matter.Composite.add(this.engine.world, this.constraints);
  }

  private applyEducationalForces(settings: SimulationSettings, dt: number) {
    for (const object of this.objects) {
      const body = this.bodies.get(object.id);
      if (!body || body.isStatic) continue;
      const speed = Math.hypot(body.velocity.x, body.velocity.y) / SCALE;
      const dragCoefficient = settings.airResistance ? (object.airDrag ?? 0.05) * settings.airDensity : 0;
      if (dragCoefficient > 0) {
        const dragX = -body.velocity.x * speed * dragCoefficient * 0.0006;
        const dragY = -body.velocity.y * speed * dragCoefficient * 0.0006;
        Matter.Body.applyForce(body, body.position, { x: dragX, y: dragY });
      }
      if (object.torque) {
        body.torque += object.torque * dt * 0.0008;
      }
      if (object.motorSpeed && Math.abs(object.motorSpeed) > 0.001) {
        Matter.Body.setAngularVelocity(body, object.motorSpeed * 0.04);
      }
      if ((object.springConstant ?? 0) > 400) this.warnings.push(`${object.name}: spring constant may be unstable.`);
      if (settings.timeScale > 1.6 && speed > 30) this.warnings.push(`${object.name}: collision tunneling risk at high speed/time scale.`);
    }
  }

  private snapshot(settings: SimulationSettings): EngineSnapshot {
    const objects = this.objects.map((object) => {
      const body = this.bodies.get(object.id);
      if (!body) return object;
      const vx = body.velocity.x / SCALE;
      const vy = body.velocity.y / SCALE;
      const dynamicTrail = object.isStatic ? object.trail : [...(object.trail ?? []).slice(-120), { x: body.position.x, y: body.position.y, t: this.simulationTime }];
      return {
        ...object,
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
        vx,
        vy,
        ax: 0,
        ay: object.isStatic ? 0 : settings.gravity,
        trail: dynamicTrail,
      };
    });
    this.objects = objects;
    const tracked = objects.find((object) => !object.isStatic);
    const graphPoint = tracked
      ? {
          t: Number(this.simulationTime.toFixed(3)),
          x: tracked.x / SCALE,
          y: Math.max(0, (FLOOR_Y - tracked.y) / SCALE),
          vx: tracked.vx,
          vy: -tracked.vy,
          speed: Math.hypot(tracked.vx, tracked.vy),
          acceleration: settings.gravity,
          force: tracked.mass * settings.gravity,
          momentum: tracked.mass * Math.hypot(tracked.vx, tracked.vy),
          kineticEnergy: 0.5 * tracked.mass * (tracked.vx ** 2 + tracked.vy ** 2),
          potentialEnergy: tracked.mass * settings.gravity * Math.max(0, (FLOOR_Y - tracked.y) / SCALE),
          totalEnergy: 0.5 * tracked.mass * (tracked.vx ** 2 + tracked.vy ** 2) + tracked.mass * settings.gravity * Math.max(0, (FLOOR_Y - tracked.y) / SCALE),
          pressure: 101325 + tracked.mass * settings.gravity * 2,
          volume: Math.max(0.1, (tracked.width ?? tracked.radius ?? 50) / 50),
          temperature: tracked.temperature ?? 293.15,
          voltage: Math.abs(tracked.charge ?? 0) * 5,
          current: Math.abs(tracked.charge ?? 0) * 0.5,
          intensity: Math.max(0, 100 - Math.hypot(tracked.x - 400, tracked.y - 300) / 5),
          angle: (tracked.angle * 180) / Math.PI,
          wavelength: 0.5 + Math.abs(tracked.vx) * 0.02,
          frequency: Math.max(0.1, Math.hypot(tracked.vx, tracked.vy)),
        }
      : undefined;
    return { objects, graphPoint, simulationTime: this.simulationTime, warnings: [...new Set(this.warnings)] };
  }

  private findNearestDynamicBody(excludeId: string, x: number, y: number) {
    let nearest: Matter.Body | undefined;
    let distance = Number.POSITIVE_INFINITY;
    for (const object of this.objects) {
      if (object.id === excludeId || object.isStatic || object.locked) continue;
      const body = this.bodies.get(object.id);
      if (!body) continue;
      const d = Math.hypot(object.x - x, object.y - y);
      if (d < distance) {
        distance = d;
        nearest = body;
      }
    }
    return nearest;
  }
}

function createBody(object: PhysicsObjectInstance) {
  const options: Matter.IBodyDefinition = {
    friction: object.friction,
    restitution: object.restitution,
    isStatic: object.isStatic || Boolean(object.locked),
    angle: object.angle,
    density: Math.max(0.0001, object.mass / 100000),
  };
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge"].includes(object.kind)) {
    const body = Matter.Bodies.circle(object.x, object.y, object.radius ?? 22, options);
    if (!options.isStatic) Matter.Body.setMass(body, Math.max(0.01, object.mass));
    return body;
  }
  const body = Matter.Bodies.rectangle(object.x, object.y, object.width ?? 48, object.height ?? 48, options);
  if (!options.isStatic) Matter.Body.setMass(body, Math.max(0.01, object.mass));
  return body;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
