// HUD and UI Overlay rendering

export const UI = {
  drawHUD(ctx, alarmMeter, lootCollected, extractionActive, tools, warningTimer) {
    ctx.save();

    // Top Header Bar background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, 1280, 70);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.lineTo(1280, 70);
    ctx.stroke();

    // Mission Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('VAULT SYNDICATE: MIDNIGHT HEIST', 30, 42);

    // Objective Status
    ctx.font = '14px monospace';
    ctx.fillStyle = lootCollected ? '#22c55e' : '#eab308';
    const objText = lootCollected ? (extractionActive ? 'OBJECTIVE: REACH EXTRACTION' : 'OBJECTIVE: SECURE EXTRACTION') : 'OBJECTIVE: STEAL QUANTUM CORE';
    ctx.fillText(objText, 420, 42);

    // Alarm Meter
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ALARM HEAT:', 780, 42);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(900, 26, 180, 22);
    ctx.fillStyle = alarmMeter > 50 ? '#ef4444' : '#eab308';
    ctx.fillRect(900, 26, (alarmMeter / 100) * 180, 22);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(900, 26, 180, 22);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(alarmMeter)}%`, 990, 42);

    // Tools bar at bottom
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(400, 725, 480, 60);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(400, 725, 480, 60);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`[1] EMP (${tools.emp.count}) - Press 1`, 420, 750);
    ctx.fillText(`[2] SMOKE (${tools.smoke.count}) - Press 2`, 420, 772);
    ctx.fillText('[WASD/Arrows] Move | [Shift] Crouch', 670, 750);
    ctx.fillText('[Mouse] Aim / Click to throw', 670, 772);

    // Warning alert flash if spotted
    if (warningTimer > 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(0, 0, 1280, 800);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`! GUARD ALERT ! (${(warningTimer / 60).toFixed(1)}s)`, 640, 120);
    }

    ctx.restore();
  },

  drawTitleScreen(ctx) {
    ctx.fillStyle = 'rgba(10, 15, 29, 0.95)';
    ctx.fillRect(0, 0, 1280, 800);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MIDNIGHT HEIST: PROTOCOL ZERO', 640, 260);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText('Infiltrate the corporate vault, bypass lasers and cameras, steal the Quantum Core, and escape.', 640, 330);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px monospace';
    ctx.fillText('Controls: WASD / Arrows to Move, SHIFT to Crouch (Evade cameras), 1 for EMP, 2 for Smoke.', 640, 420);
    ctx.fillText('Press SPACEBAR or CLICK anywhere to begin heist.', 640, 500);

    // Decorative graphic
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(440, 560, 400, 60);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('CLICK TO START', 640, 597);
  },

  drawGameOver(ctx, reason) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, 1280, 800);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION FAILED: BUSTED', 640, 300);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '20px monospace';
    ctx.fillText(reason || 'The alarm triggered and security detained you.', 640, 380);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '18px monospace';
    ctx.fillText('Press R to Retry', 640, 460);
  },

  drawVictory(ctx, score) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(0, 0, 1280, 800);

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HEIST SUCCESSFUL: CLEAN GETAWAY', 640, 280);

    ctx.fillStyle = '#eab308';
    ctx.font = '24px monospace';
    ctx.fillText(`Quantum Core Secured! Score: ${score}`, 640, 360);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('You successfully infiltrated, bypassed security, and escaped without a trace.', 640, 430);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '18px monospace';
    ctx.fillText('Press R to Play Again', 640, 520);
  }
};
