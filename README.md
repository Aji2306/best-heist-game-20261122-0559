# Midnight Heist: Protocol Zero

A 2D stealth heist game for the make.fun bounty best-heist-game-20261122-0559. Slip across a guarded vault room as the thief: read the guards' vision cones, dodge the sweeping cameras, grab the loot and reach the getaway before the alarm meter fills. Tools cost you: an EMP disrupter that kills cameras and lasers for 6 seconds, and smoke to slip past a patrol.

[![make.fun · best-heist-game-20261122-0559](https://make.fun/badge/best-heist-game-20261122-0559.svg)](https://make.fun/bounty/best-heist-game-20261122-0559?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)
[![rank](https://make.fun/badge/best-heist-game-20261122-0559/Aji2306/best-heist-game-20261122-0559/rank.svg)](https://make.fun/bounty/best-heist-game-20261122-0559?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)
[![reward](https://make.fun/badge/best-heist-game-20261122-0559/Aji2306/best-heist-game-20261122-0559/reward.svg)](https://make.fun/bounty/best-heist-game-20261122-0559?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)

Referral code: `jhz85756`

## Controls

- **WASD / Arrow Keys**: Move the thief
- **Shift**: Crouch (evade cameras)
- **1**: EMP Disrupter — disables cameras and lasers for 6s
- **2**: Smoke
- **Mouse**: Click to interact

## Play

Open `game/index.html` in desktop Chrome (serve `game/` with any static server). No network requests: every asset is a file under `game/`.

## Run

```sh
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to `MAKEFUN_OUTPUT_DIR` (default `/output`) and writes `dossier.json`.

## License

See [LICENSE](LICENSE).
