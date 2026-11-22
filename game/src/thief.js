// Thief player character mechanics and tools

export class Thief {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 14;
    this.speed = 2.8;
    this.crouching = false;
    this.tools = {
      emp: { count: 2, cooldown: 0 },
      smoke: { count: 2, cooldown: 0 }
    };
    this.smokeClouds = []; // active smoke grenades {x, y, radius, timer}
  }

  update(input, world) {
    let dx = 0;
    let dy = 0;

    if (input.keys['KeyW'] || input.keys['ArrowUp']) dy -= 1;
    if (input.keys['KeyS'] || input.keys['ArrowDown']) dy += 1;
    if (input.keys['KeyA'] || input.keys['ArrowLeft']) dx -= 1;
    if (input.keys['KeyD'] || input.keys['ArrowRight']) dx += 1;

    this.crouching = !!input.keys['ShiftLeft'] || !!input.keys['ShiftRight'];
    const currentSpeed = this.crouching ? this.speed * 0.5 : this.speed;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    const nextX = this.x + dx * currentSpeed;
    const nextY = this.y + dy * currentSpeed;

    // Separate axis collision for smooth sliding against walls
    if (!world.checkCollision(nextX, this.y, this.radius)) {
      this.x = nextX;
    }
    if (!world.checkCollision(this.x, nextY, this.radius)) {
      this.y = nextY;
    }

    // Update smoke clouds
    for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
      const s = this.smokeClouds[i];
      s.timer--;
      if (s.timer <= 0) {
        this.smokeClouds.splice(i, 1);
      }
    }

    // Tool cooldowns
    if (this.tools.emp.cooldown > 0) this.tools.emp.cooldown--;
    if (this.tools.smoke.cooldown > 0) this.tools.smoke.cooldown--;
  }

  isInsideSmoke(px, py) {
    for (const s of this.smokeClouds) {
      const dx = px - s.x;
      const dy = py - s.y;
      if (Math.sqrt(dx * dx + dy * dy) < s.radius) return true;
    }
    return false;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.crouching = false;
    this.tools.emp.count = 2;
    this.tools.emp.cooldown = 0;
    this.tools.smoke.count = 2;
    this.tools.smoke.cooldown = 0;
    this.smokeClouds = [];
  }
}
