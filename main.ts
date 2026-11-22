// make.fun competition entry runner: Midnight Heist: Protocol Zero
// Pass 2: Validates paths, copies static game assets and screenshots, and generates canonical dossier.json.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

console.log(`[make.fun] Initializing build for Midnight Heist to: ${out}`);

mkdirSync(out, { recursive: true });

const gameSrc = join(here, 'game');
const gameDest = join(out, 'game');
if (!existsSync(gameSrc)) {
  console.error('[make.fun] Error: game/ directory not found!');
  process.exit(1);
}

cpSync(gameSrc, gameDest, { recursive: true });
console.log('[make.fun] Copied game/ assets successfully.');

const shotsSrc = join(here, 'screenshots');
const shotsDest = join(out, 'screenshots');
mkdirSync(shotsDest, { recursive: true });
if (existsSync(shotsSrc)) {
  cpSync(shotsSrc, shotsDest, { recursive: true });
  console.log('[make.fun] Copied screenshots/ successfully.');
} else {
  console.warn('[make.fun] Warning: No screenshots/ directory found.');
}

const dossierPath = join(out, 'dossier.json');
const dossierBytes = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

writeFileSync(dossierPath, dossierBytes);
console.log(`[make.fun] Generated dossier.json (${dossierBytes.length} bytes). Build complete.`);
