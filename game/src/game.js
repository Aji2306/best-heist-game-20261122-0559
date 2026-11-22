// Main game controller and state machine

import { CANVAS_WIDTH, CANVAS_HEIGHT, STATES, TOOLS } from './constants.js';
import { Input } from './input.js';
import { SoundFX } from './audio.js';
import { World } from './world.js';
import { CameraSystem } from './cameras.js';
import { GuardSystem } from './guards.js';
import { Thief } from './thief.js';
import { Renderer } from './render.js';
import { UI } from './ui.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.state = STATES.TITLE;

    this.world = new World();
    this.cameras = new CameraSystem();
    this.guards = new GuardSystem();
    this.thief = new Thief(140, 160);

    this.alarmMeter = 0;
    this.warningTimer = 0;
    this.score = 0;
    this.gameOverReason = '';

    const urlParams = new URLSearchParams(window.location.search);
    const shot = urlParams.get('shot');
    if (shot === 'start') {
      this.state = STATES.TITLE;
    } else if (shot === 'play') {
      this.start();
      this.thief.x = 520;
      this.thief.y = 390;
      this.alarmMeter = 15;
    } else if (shot === 'end') {
      this.state = STATES.VICTORY;
      this.score = 5000;
    }

    Input.init(this.canvas);
  }

  start() {
    this.world.reset();
    this.cameras.reset();
    this.guards.reset();
    this.thief.reset(140, 160);
    this.alarmMeter = 0;
    this.warningTimer = 0;
    this.state = STATES.PLAYING;
  }

  update() {
    if (this.state === STATES.TITLE) {
      if (Input.keys['Space'] || Input.mouse.clicked) {
        SoundFX.beep(600, 0.1);
        this.start();
      }
      return;
    }

    if (this.state === STATES.CAUGHT || STATES.VICTORY === this.state) {
      if (Input.keys['KeyR'] || Input.mouse.clicked) {
        SoundFX.beep(500, 0.1);
        this.start();
      }
      return;
    }

    if (this.state === STATES.PLAYING) {
      // Tool inputs (1 for EMP, 2 for Smoke)
      if (Input.keys['Digit1'] && this.thief.tools.emp.count > 0) {
        this.thief.tools.emp.count--;
        this.cameras.triggerEMP(360);
        this.world.lasers.forEach(l => l.active = false);
        SoundFX.emp();
        Input.keys['Digit1'] = false; // consume key
      }
      if (Input.keys['Digit2'] && this.thief.tools.smoke.count > 0) {
        this.thief.tools.smoke.count--;
        this.thief.smokeClouds.push({ x: this.thief.x, y: this.thief.y, radius: 60, timer: 300 });
        SoundFX.smoke();
        Input.keys['Digit2'] = false; // consume key
      }

      // Update entities
      this.thief.update(Input, this.world);
      this.cameras.update();
      this.world.lasers.forEach(l => {
        if (!l.active && Math.random() < 0.001) l.active = true; // lasers eventually reactivate unless EMP active
      });
      this.guards.update(this.world, this.cameras.empTimer > 0);

      // Check laser collisions
      if (this.world.checkLasers(this.thief.x, this.thief.y, this.thief.radius)) {
        this.alarmMeter += 1.5;
        SoundFX.alarm();
      }

      // Check camera & guard vision detection (fair caught moment with warning timer)
      let spotted = false;
      const inSmoke = this.thief.isInsideSmoke(this.thief.x, this.thief.y);
      if (!inSmoke && !this.thief.crouching) {
        for (const cam of this.cameras.cameras) {
          if (this.cameras.isPointInCone(this.thief.x, this.thief.y, cam, this.world)) {
            spotted = true;
            break;
          }
        }
        if (!spotted && this.guards.isPlayerSeen(this.thief.x, this.thief.y, this.world, inSmoke)) {
          spotted = true;
        }
      }

      if (spotted) {
        if (this.warningTimer === 0) SoundFX.alarm();
        this.warningTimer = 90; // 1.5 second fair warning window
        this.alarmMeter += 0.8;
      } else {
        if (this.warningTimer > 0) this.warningTimer--;
        // Alarm gradually cools down when not spotted
        if (this.alarmMeter > 0) this.alarmMeter -= 0.1;
      }

      if (this.alarmMeter >= 100) {
        this.state = STATES.CAUGHT;
        this.gameOverReason = 'Alarm reached 100%! Security lockdown engaged.';
        SoundFX.alarm();
      }

      // Check loot collection
      if (!this.world.loot.collected) {
        const dx = this.thief.x - this.world.loot.x;
        const dy = this.thief.y - this.world.loot.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.thief.radius + this.world.loot.radius) {
          this.world.loot.collected = true;
          this.world.extraction.active = true;
          this.score += 5000;
          SoundFX.loot();
        }
      }

      // Check extraction
      if (this.world.extraction.active) {
        const ex = this.world.extraction;
        if (
          this.thief.x > ex.x &&
          this.thief.x < ex.x + ex.w &&
          this.thief.y > ex.y &&
          this.thief.y < ex.y + ex.h
        ) {
          this.score += Math.max(1000, 5000 - Math.round(this.alarmMeter * 20));
          this.state = STATES.VICTORY;
          SoundFX.win();
        }
      }
    }

    Input.clearFrame();
  }

  render() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (this.state === STATES.TITLE) {
      UI.drawTitleScreen(this.ctx);
    } else {
      Renderer.draw(
        this.ctx,
        this.world,
        this.cameras,
        this.guards,
        this.thief,
        this.alarmMeter,
        this.world.loot.collected,
        this.world.extraction.active,
        this.thief.tools,
        this.warningTimer
      );
      UI.drawHUD(
        this.ctx,
        this.alarmMeter,
        this.world.loot.collected,
        this.world.extraction.active,
        this.thief.tools,
        this.warningTimer
      );

      if (this.state === STATES.CAUGHT) {
        UI.drawGameOver(this.ctx, this.gameOverReason);
      } else if (this.state === STATES.VICTORY) {
        UI.drawVictory(this.ctx, this.score);
      }
    }
  }

  run() {
    const loop = () => {
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.addEventListener('load', () => {
  const game = new Game();
  game.run();
});
