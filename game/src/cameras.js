// Security Cameras with oscillating vision cones

export class CameraSystem {
  constructor() {
    this.cameras = [
      { x: 360, y: 110, angle: Math.PI / 2, range: 180, arc: Math.PI / 3, speed: 0.015, minAngle: 0, maxAngle: Math.PI },
      { x: 740, y: 110, angle: Math.PI / 2, range: 180, arc: Math.PI / 3, speed: -0.012, minAngle: 0, maxAngle: Math.PI },
      { x: 360, y: 690, angle: -Math.PI / 2, range: 180, arc: Math.PI / 3, speed: 0.018, minAngle: -Math.PI, maxAngle: 0 },
      { x: 740, y: 690, angle: -Math.PI / 2, range: 180, arc: Math.PI / 3, speed: -0.014, minAngle: -Math.PI, maxAngle: 0 }
    ];
    this.empTimer = 0;
  }

  update() {
    if (this.empTimer > 0) {
      this.empTimer--;
      return;
    }
    for (const cam of this.cameras) {
      cam.angle += cam.speed;
      if (cam.angle > cam.maxAngle || cam.angle < cam.minAngle) {
        cam.speed *= -1;
      }
    }
  }

  isPointInCone(px, py, cam, world) {
    if (this.empTimer > 0) return false;
    const dx = px - cam.x;
    const dy = py - cam.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > cam.range) return false;

    const angleToPlayer = Math.atan2(dy, dx);
    let diff = angleToPlayer - cam.angle;
    // Normalize diff to -PI to PI
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    if (Math.abs(diff) <= cam.arc / 2) {
      // Line of sight check (simple step raycast against walls)
      return !this.hasWallBetween(cam.x, cam.y, px, py, world);
    }
    return false;
  }

  hasWallBetween(x1, y1, x2, y2, world) {
    const steps = 10;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const mx = x1 + (x2 - x1) * t;
      const my = y1 + (y2 - y1) * t;
      if (world.checkCollision(mx, my, 4)) return true;
    }
    return false;
  }

  triggerEMP(duration = 360) {
    this.empTimer = duration;
  }

  reset() {
    this.empTimer = 0;
  }
}
