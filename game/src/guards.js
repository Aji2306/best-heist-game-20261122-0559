// Guard patrols, vision cones, and alert states

export class GuardSystem {
  constructor() {
    this.guards = [
      {
        x: 200, y: 160,
        waypoints: [{x: 200, y: 160}, {x: 640, y: 160}, {x: 640, y: 240}, {x: 200, y: 240}],
        wpIndex: 0,
        speed: 1.5,
        angle: 0,
        range: 160,
        arc: Math.PI / 3,
        state: 'patrol', // patrol, suspect, alert
        suspectTimer: 0
      },
      {
        x: 1040, y: 560,
        waypoints: [{x: 1040, y: 560}, {x: 820, y: 560}, {x: 820, y: 640}, {x: 1040, y: 640}],
        wpIndex: 0,
        speed: 1.5,
        angle: Math.PI,
        range: 160,
        arc: Math.PI / 3,
        state: 'patrol',
        suspectTimer: 0
      },
      {
        x: 640, y: 640,
        waypoints: [{x: 640, y: 640}, {x: 380, y: 640}, {x: 380, y: 560}, {x: 640, y: 560}],
        wpIndex: 0,
        speed: 1.4,
        angle: -Math.PI / 2,
        range: 150,
        arc: Math.PI / 3,
        state: 'patrol',
        suspectTimer: 0
      }
    ];
  }

  update(world, empActive) {
    for (const g of this.guards) {
      if (empActive) continue; // Guards paused/blinded during EMP

      const targetWp = g.waypoints[g.wpIndex];
      const dx = targetWp.x - g.x;
      const dy = targetWp.y - g.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        g.wpIndex = (g.wpIndex + 1) % g.waypoints.length;
      } else {
        const moveAngle = Math.atan2(dy, dx);
        g.angle = moveAngle;
        g.x += Math.cos(moveAngle) * g.speed;
        g.y += Math.sin(moveAngle) * g.speed;
      }
    }
  }

  isPlayerSeen(px, py, world, smokeActive) {
    if (smokeActive) return false; // Smoke hides player

    for (const g of this.guards) {
      const dx = px - g.x;
      const dy = py - g.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > g.range) continue;

      const angleToPlayer = Math.atan2(dy, dx);
      let diff = angleToPlayer - g.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      if (Math.abs(diff) <= g.arc / 2) {
        // Line of sight check
        if (!this.hasWallBetween(g.x, g.y, px, py, world)) {
          return true;
        }
      }
    }
    return false;
  }

  hasWallBetween(x1, y1, x2, y2, world) {
    const steps = 12;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const mx = x1 + (x2 - x1) * t;
      const my = y1 + (y2 - y1) * t;
      if (world.checkCollision(mx, my, 4)) return true;
    }
    return false;
  }

  reset() {
    this.guards.forEach((g, idx) => {
      g.wpIndex = 0;
      g.x = g.waypoints[0].x;
      g.y = g.waypoints[0].y;
      g.state = 'patrol';
      g.suspectTimer = 0;
    });
  }
}
