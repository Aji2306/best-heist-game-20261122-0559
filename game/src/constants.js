// Game Constants and Configuration

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

export const STATES = {
  TITLE: 'TITLE',
  PLAYING: 'PLAYING',
  CAUGHT: 'CAUGHT',
  VICTORY: 'VICTORY'
};

export const TOOLS = {
  EMP: { id: 'emp', name: 'EMP Disrupter', count: 2, cooldown: 0, maxCooldown: 300, desc: 'Disables cameras & lasers for 6s' },
  SMOKE: { id: 'smoke', name: 'Smoke Grenade', count: 2, cooldown: 0, maxCooldown: 240, desc: 'Creates vision-blocking smoke' },
  DECRYPT: { id: 'decrypt', name: 'Keycard Hacker', count: 1, cooldown: 0, maxCooldown: 180, desc: 'Instantly unlocks secure doors' }
};

export const COLORS = {
  bg: '#0a0f1d',
  grid: '#131e38',
  wall: '#1e293b',
  wallTop: '#334155',
  floor: '#0f172a',
  floorAlt: '#162035',
  laser: '#ef4444',
  laserGlow: 'rgba(239, 68, 68, 0.4)',
  cameraBody: '#475569',
  cameraLens: '#38bdf8',
  visionCone: 'rgba(56, 189, 248, 0.15)',
  visionAlert: 'rgba(239, 68, 68, 0.25)',
  thief: '#22c55e',
  thiefShadow: 'rgba(34, 197, 94, 0.3)',
  guard: '#f97316',
  guardAlert: '#ef4444',
  loot: '#eab308',
  lootGlow: 'rgba(234, 179, 8, 0.5)',
  extraction: '#3b82f6',
  extractionGlow: 'rgba(59, 130, 246, 0.4)',
  smoke: 'rgba(148, 163, 184, 0.6)',
  text: '#f8fafc',
  textMuted: '#94a3b8'
};
