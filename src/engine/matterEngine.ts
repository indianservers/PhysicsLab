import Matter from "matter-js";
import { EngineSnapshot, PhysicsObjectInstance, SimulationSettings } from "../types";
import { playTone, stopTone } from "../lib/audioEngine";
import { stepDoublePendulum } from "./doublePendulumSolver";
import { sanitizeGraphPoint } from "./measurementAdapters";

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
      if (isFieldOnly(object)) return;
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
    this.applyFluidForces(settings);
    Matter.Engine.update(this.engine, dt * 1000);
    this.objects = this.objects.map((object) => object.kind === "double-pendulum" ? stepDoublePendulum(object, dt, settings.gravity) : object);
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
      if (object.kind === "spring") {
        const rest = object.length ?? object.width ?? 120;
        const current = Math.hypot(body.position.x - (object.pivotX ?? object.x), body.position.y - (object.pivotY ?? object.y));
        const extension = Math.abs(current - rest) / SCALE;
        const f = (1 / (2 * Math.PI)) * Math.sqrt(Math.max(0.01, object.springConstant ?? 24) / Math.max(0.01, object.mass));
        if (extension > 0.01 && f >= 20 && f <= 2000) playTone(object.id, f, Math.min(extension / 0.5, 1), "sine");
        if (extension < 0.001) stopTone(object.id);
      }
      if (object.kind === "pendulum") {
        const length = Math.max(0.1, (object.length ?? 120) / SCALE);
        const angle = Math.atan2(body.position.x - (object.pivotX ?? object.x), body.position.y - (object.pivotY ?? object.y - (object.length ?? 120)));
        const f = (1 / (2 * Math.PI)) * Math.sqrt(settings.gravity / length);
        if (Math.abs(angle) > 0.05) playTone(object.id, f, Math.min(Math.abs(angle), 1), "sine");
        else stopTone(object.id);
      }
      if ((object.springConstant ?? 0) > 400) this.warnings.push(`${object.name}: spring constant may be unstable.`);
      if (settings.timeScale > 1.6 && speed > 30) this.warnings.push(`${object.name}: collision tunneling risk at high speed/time scale.`);
    }
  }

  private applyFluidForces(settings: SimulationSettings) {
    const fluids = this.objects.filter((object) => object.kind === "fluid-region");
    if (!fluids.length) return;
    for (const object of this.objects) {
      const body = this.bodies.get(object.id);
      if (!body || body.isStatic) continue;
      for (const fluid of fluids) {
        const fraction = overlapFraction(body.bounds, fluid);
        if (fraction <= 0) continue;
        const objectDensity = Math.max(1, object.density ?? 500);
        const volume = Math.max(0.001, object.mass / objectDensity);
        const buoyancy = fraction * (fluid.density ?? 1000) * settings.gravity * volume;
        Matter.Body.applyForce(body, body.position, { x: 0, y: -buoyancy * 0.00002 });

        const vx = body.velocity.x / SCALE;
        const vy = body.velocity.y / SCALE;
        const speed = Math.hypot(vx, vy);
        if (speed <= 0.0001) continue;
        const viscosity = fluid.viscosity ?? 0.001;
        let drag = 0;
        if (object.radius) {
          drag = 6 * Math.PI * viscosity * Math.max(0.01, object.radius / SCALE) * speed;
        } else {
          const area = Math.max(0.01, ((object.width ?? 48) * (object.height ?? 48)) / (SCALE * SCALE));
          drag = 0.5 * 0.47 * (fluid.density ?? 1000) * area * speed * speed;
        }
        Matter.Body.applyForce(body, body.position, { x: -Math.sign(vx) * drag * 0.00002, y: -Math.sign(vy) * drag * 0.00002 });
      }
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
      ? sanitizeGraphPoint({
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
          volume: tracked.density ? tracked.mass / tracked.density : undefined,
          temperature: tracked.temperature,
          angle: (tracked.angle * 180) / Math.PI,
        })
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
    isStatic: object.isStatic || Boolean(object.locked) || ["battery", "resistor", "bulb", "switch", "ammeter", "voltmeter"].includes(object.kind),
    angle: object.angle,
    density: Math.max(0.0001, object.mass / 100000),
  };
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge", "bulb", "ammeter", "voltmeter"].includes(object.kind)) {
    const body = Matter.Bodies.circle(object.x, object.y, object.radius ?? 22, options);
    if (!options.isStatic) Matter.Body.setMass(body, Math.max(0.01, object.mass));
    return body;
  }
  const body = Matter.Bodies.rectangle(object.x, object.y, object.width ?? 48, object.height ?? 48, options);
  if (!options.isStatic) Matter.Body.setMass(body, Math.max(0.01, object.mass));
  return body;
}

function isFieldOnly(object: PhysicsObjectInstance) {
  return ["double-pendulum", "wire", "fluid-region", "wave-source", "wave-barrier", "light-ray", "plane-mirror", "convex-lens", "concave-mirror", "prism"].includes(object.kind);
}

function overlapFraction(bounds: Matter.Bounds, fluid: PhysicsObjectInstance) {
  const left = fluid.x - (fluid.width ?? 0) / 2;
  const right = fluid.x + (fluid.width ?? 0) / 2;
  const top = fluid.y - (fluid.height ?? 0) / 2;
  const bottom = fluid.y + (fluid.height ?? 0) / 2;
  const overlapX = Math.max(0, Math.min(bounds.max.x, right) - Math.max(bounds.min.x, left));
  const overlapY = Math.max(0, Math.min(bounds.max.y, bottom) - Math.max(bounds.min.y, top));
  const overlapArea = overlapX * overlapY;
  const bodyArea = Math.max(1, (bounds.max.x - bounds.min.x) * (bounds.max.y - bounds.min.y));
  return clamp(overlapArea / bodyArea, 0, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
