// Canvas rendering engine

import { COLORS } from './constants.js';

export const Renderer = {
  draw(ctx, world, cameras, guards, thief, alarmMeter, lootCollected, extractionActive, tools, warningTimer) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, 1280, 800);

    // Draw Blueprint Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let x = 100; x < 1180; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 100; y < 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(100, y);
      ctx.lineTo(1180, y);
      ctx.stroke();
    }

    // Draw Vents
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (const v of world.vents) {
      ctx.fillRect(v.x, v.y, v.w, v.h);
      ctx.strokeRect(v.x, v.y, v.w, v.h);
      // Vent grate hatch pattern
      ctx.beginPath();
      for (let gx = v.x + 20; gx < v.x + v.w; gx += 20) {
        ctx.moveTo(gx, v.y);
        ctx.lineTo(gx, v.y + v.h);
      }
      ctx.stroke();
    }

    // Draw Extraction Zone
    ctx.fillStyle = COLORS.extractionGlow;
    ctx.fillRect(world.extraction.x, world.extraction.y, world.extraction.w, world.extraction.h);
    ctx.strokeStyle = COLORS.extraction;
    ctx.lineWidth = 3;
    ctx.strokeRect(world.extraction.x, world.extraction.y, world.extraction.w, world.extraction.h);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXTRACT', world.extraction.x + 30, world.extraction.y + 35);

    // Draw Loot Target (Quantum Core)
    if (!world.loot.collected) {
      ctx.fillStyle = COLORS.lootGlow;
      ctx.beginPath();
      ctx.arc(world.loot.x, world.loot.y, world.loot.radius + 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = COLORS.loot;
      ctx.beginPath();
      ctx.arc(world.loot.x, world.loot.y, world.loot.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CORE', world.loot.x, world.loot.y + 4);
    }

    // Draw Walls
    for (const w of world.walls) {
      ctx.fillStyle = COLORS.wall;
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.strokeStyle = COLORS.wallTop;
      ctx.lineWidth = 3;
      ctx.strokeRect(w.x, w.y, w.w, w.h);
    }

    // Draw Lasers
    for (const l of world.lasers) {
      if (!l.active) continue;
      ctx.strokeStyle = COLORS.laserGlow;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();

      ctx.strokeStyle = COLORS.laser;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
    }

    // Draw Security Cameras & Cones
    for (const cam of cameras.cameras) {
      // Vision cone
      ctx.fillStyle = cameras.empTimer > 0 ? 'rgba(100, 100, 100, 0.1)' : COLORS.visionCone;
      ctx.beginPath();
      ctx.moveTo(cam.x, cam.y);
      ctx.arc(cam.x, cam.y, cam.range, cam.angle - cam.arc / 2, cam.angle + cam.arc / 2);
      ctx.lineTo(cam.x, cam.y);
      ctx.fill();

      // Camera body
      ctx.fillStyle = COLORS.cameraBody;
      ctx.beginPath();
      ctx.arc(cam.x, cam.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = cameras.empTimer > 0 ? '#64748b' : COLORS.cameraLens;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw Guards & Vision Cones
    for (const g of guards.guards) {
      // Vision cone
      ctx.fillStyle = COLORS.visionAlert;
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.arc(g.x, g.y, g.range, g.angle - g.arc / 2, g.angle + g.arc / 2);
      ctx.lineTo(g.x, g.y);
      ctx.fill();

      // Guard body
      ctx.fillStyle = COLORS.guard;
      ctx.beginPath();
      ctx.arc(g.x, g.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Guard direction indicator
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x + Math.cos(g.angle) * 18, g.y + Math.sin(g.angle) * 18);
      ctx.stroke();
    }

    // Draw Smoke Clouds
    for (const s of thief.smokeClouds) {
      ctx.fillStyle = COLORS.smoke;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Thief Player
    ctx.fillStyle = COLORS.thiefShadow;
    ctx.beginPath();
    ctx.arc(thief.x, thief.y, thief.radius + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = thief.crouching ? '#15803d' : COLORS.thief;
    ctx.beginPath();
    ctx.arc(thief.x, thief.y, thief.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Thief gear indicator
    if (thief.crouching) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('STEALTH', thief.x, thief.y + 3);
    }
  }
};
