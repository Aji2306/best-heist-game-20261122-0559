// World definition: rooms, walls, lasers, vents, loot, extraction

export class World {
  constructor() {
    this.walls = [
      // Outer boundaries
      { x: 100, y: 100, w: 1080, h: 20 }, // Top outer
      { x: 100, y: 700, w: 1080, h: 20 }, // Bottom outer
      { x: 100, y: 100, w: 20, h: 620 },  // Left outer
      { x: 1160, y: 100, w: 20, h: 620 }, // Right outer

      // Inner partitions (creating multiple routes: Top Route, Center Vault, Bottom Vent)
      { x: 350, y: 100, w: 20, h: 220 },  // Divider 1 top
      { x: 350, y: 480, w: 20, h: 220 },  // Divider 1 bottom
      { x: 750, y: 100, w: 20, h: 220 },  // Divider 2 top
      { x: 750, y: 480, w: 20, h: 220 },  // Divider 2 bottom

      // Central Vault Room Walls
      { x: 500, y: 280, w: 280, h: 20 },  // Vault ceiling
      { x: 500, y: 500, w: 280, h: 20 },  // Vault floor
      { x: 500, y: 300, w: 20, h: 200 }   // Vault left wall (has door gap)
    ];

    // Laser grids (can be disabled via EMP)
    this.lasers = [
      { x1: 370, y1: 210, x2: 730, y2: 210, active: true }, // Top hallway laser grid
      { x1: 370, y1: 590, x2: 730, y2: 590, active: true }, // Bottom hallway laser grid
      { x1: 500, y1: 390, x2: 500, y2: 410, active: true }  // Vault entrance laser
    ];

    // Vent networks (faster sneaky paths, slower movement)
    this.vents = [
      { x: 120, y: 120, w: 210, h: 60 },
      { x: 120, y: 620, w: 210, h: 60 },
      { x: 770, y: 120, w: 380, h: 60 }
    ];

    // Loot Target (Central Vault)
    this.loot = {
      x: 640,
      y: 390,
      radius: 25,
      collected: false,
      name: 'Quantum Core'
    };

    // Extraction Zone (Top Right Corner or Start area)
    this.extraction = {
      x: 1080,
      y: 130,
      w: 60,
      h: 60,
      active: false // Unlocked after collecting loot
    };
  }

  checkCollision(x, y, radius = 12) {
    // Check walls
    for (const w of this.walls) {
      if (
        x + radius > w.x &&
        x - radius < w.x + w.w &&
        y + radius > w.y &&
        y - radius < w.y + w.h
      ) {
        return true;
      }
    }
    return false;
  }

  checkLasers(x, y, radius = 12) {
    for (const l of this.lasers) {
      if (!l.active) continue;
      // Simple line distance or bounding box check for laser beams
      const dist = pointToLineDist(x, y, l.x1, l.y1, l.x2, l.y2);
      if (dist < radius + 4) return true;
    }
    return false;
  }

  reset() {
    this.loot.collected = false;
    this.extraction.active = false;
    this.lasers.forEach(l => l.active = true);
  }
}

function pointToLineDist(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;
  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}
