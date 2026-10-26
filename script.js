/* ── Tropical Hill, Ocean & Butterfly Landscape Backdrop ── */
(function() {
  const canvas = document.getElementById('backdrop-canvas') || document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0;
  let startTime = performance.now();

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  // Butterfly color palettes (inspired by BrizSey / SeyMeteo)
  const palettes = [
    {
      name: 'GoldenSwallowtail',
      topColor: '#FDE047',
      baseColor: '#F59E0B',
      edgeColor: '#0F172A',
      spotColor: '#FFFFFF',
      accentSpot: '#38BDF8'
    },
    {
      name: 'CeruleanCruiser',
      topColor: '#38BDF8',
      baseColor: '#0284C7',
      edgeColor: '#0B192C',
      spotColor: '#FFFFFF',
      accentSpot: '#FEF08A'
    },
    {
      name: 'EmeraldSwallowtail',
      topColor: '#4ADE80',
      baseColor: '#059669',
      edgeColor: '#064E3B',
      spotColor: '#D9F99D',
      accentSpot: '#FDE047'
    },
    {
      name: 'SunsetMonarch',
      topColor: '#FB923C',
      baseColor: '#EA580C',
      edgeColor: '#18181B',
      spotColor: '#FFFBEB',
      accentSpot: '#FDE047'
    }
  ];

  // Ambient flyer class
  class ButterflyFlyer {
    constructor(palette, scale) {
      this.palette = palette;
      this.scale = scale;
      this.reset();
    }

    reset() {
      // Start randomly offscreen or across width
      this.x = Math.random() < 0.5 ? -60 : w + 60;
      this.direction = this.x < 0 ? 1 : -1;
      this.targetX = this.direction > 0 ? w + 80 : -80;
      this.y = h * (0.2 + Math.random() * 0.45);
      this.baseY = this.y;
      this.speedX = (45 + Math.random() * 40) * this.direction;
      this.waveFreq = 1.2 + Math.random() * 1.6;
      this.waveAmp = 15 + Math.random() * 25;
      this.flapSpeed = 12 + Math.random() * 6;
      this.timeOffset = Math.random() * 100;
    }

    update(dt, t) {
      this.x += (this.speedX * dt);
      const wave = Math.sin((t + this.timeOffset) * this.waveFreq) * this.waveAmp;
      this.y = this.baseY + wave;

      // Wrap around when past boundary
      if ((this.direction > 0 && this.x > w + 100) || (this.direction < 0 && this.x < -100)) {
        this.reset();
      }
    }

    draw(ctx, t) {
      const flap = Math.sin((t + this.timeOffset) * this.flapSpeed);
      const heading = this.direction > 0 ? (flap * 6 + 10) : (flap * 6 - 190);
      drawButterfly(ctx, this.x, this.y, flap, heading, this.scale, this.palette);
    }
  }

  // Draw vectorized butterfly wings and slender body matching SeyMeteo specification
  function drawButterfly(ctx, cx, cy, flapFactor, rotationDeg, scale, palette) {
    const absFlap = Math.max(0.12, Math.abs(flapFactor));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    const wingW = 22 * scale * absFlap;
    const wingH = 20 * scale;
    const hindW = 16 * scale * absFlap;
    const hindH = 16 * scale;
    const bodyLength = 15 * scale;
    const bodyWidth = 3 * scale;

    // 1. Left Hindwing
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-2, 2);
    ctx.bezierCurveTo(-hindW * 0.8, 4, -hindW, hindH * 0.7, -hindW * 0.7, hindH);
    ctx.lineTo(-hindW * 0.75, hindH + 4 * scale);
    ctx.lineTo(-hindW * 0.6, hindH + 1);
    ctx.bezierCurveTo(-hindW * 0.3, hindH * 0.8, -2, hindH * 0.5, -1, 8);
    ctx.closePath();
    ctx.fillStyle = palette.baseColor;
    ctx.fill();
    ctx.strokeStyle = palette.edgeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 2. Right Hindwing
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.bezierCurveTo(hindW * 0.8, 4, hindW, hindH * 0.7, hindW * 0.7, hindH);
    ctx.lineTo(hindW * 0.75, hindH + 4 * scale);
    ctx.lineTo(hindW * 0.6, hindH + 1);
    ctx.bezierCurveTo(hindW * 0.3, hindH * 0.8, 2, hindH * 0.5, 1, 8);
    ctx.closePath();
    ctx.fillStyle = palette.baseColor;
    ctx.fill();
    ctx.strokeStyle = palette.edgeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 3. Left Forewing
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-2, -2);
    ctx.bezierCurveTo(-wingW * 0.6, -wingH * 0.9, -wingW * 1.1, -wingH * 0.6, -wingW, -2);
    ctx.bezierCurveTo(-wingW * 0.7, wingH * 0.3, -wingW * 0.3, wingH * 0.2, -2, 4);
    ctx.closePath();
    const lGrad = ctx.createRadialGradient(-wingW * 0.5, -wingH * 0.3, 2, -wingW * 0.5, -wingH * 0.3, wingW);
    lGrad.addColorStop(0, palette.topColor);
    lGrad.addColorStop(0.7, palette.baseColor);
    lGrad.addColorStop(1, palette.edgeColor);
    ctx.fillStyle = lGrad;
    ctx.fill();
    ctx.strokeStyle = palette.edgeColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // 4. Right Forewing
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(2, -2);
    ctx.bezierCurveTo(wingW * 0.6, -wingH * 0.9, wingW * 1.1, -wingH * 0.6, wingW, -2);
    ctx.bezierCurveTo(wingW * 0.7, wingH * 0.3, wingW * 0.3, wingH * 0.2, 2, 4);
    ctx.closePath();
    const rGrad = ctx.createRadialGradient(wingW * 0.5, -wingH * 0.3, 2, wingW * 0.5, -wingH * 0.3, wingW);
    rGrad.addColorStop(0, palette.topColor);
    rGrad.addColorStop(0.7, palette.baseColor);
    rGrad.addColorStop(1, palette.edgeColor);
    ctx.fillStyle = rGrad;
    ctx.fill();
    ctx.strokeStyle = palette.edgeColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // Spots on wings
    if (absFlap > 0.4) {
      ctx.fillStyle = palette.spotColor;
      ctx.beginPath(); ctx.arc(-wingW * 0.82, -wingH * 0.4, 1.2 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(wingW * 0.82, -wingH * 0.4, 1.2 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = palette.accentSpot;
      ctx.beginPath(); ctx.arc(-hindW * 0.65, hindH * 0.7, 1.1 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hindW * 0.65, hindH * 0.7, 1.1 * scale, 0, Math.PI * 2); ctx.fill();
    }

    // 5. Body & Head
    ctx.fillStyle = palette.edgeColor;
    ctx.beginPath();
    ctx.roundRect(-bodyWidth * 0.5, -bodyLength * 0.45, bodyWidth, bodyLength, bodyWidth * 0.5);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -bodyLength * 0.48, bodyWidth * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    const antLength = 8 * scale;
    ctx.strokeStyle = palette.edgeColor;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(-1, -bodyLength * 0.48);
    ctx.lineTo(-antLength * 0.6, -bodyLength * 0.48 - antLength);
    ctx.moveTo(1, -bodyLength * 0.48);
    ctx.lineTo(antLength * 0.6, -bodyLength * 0.48 - antLength);
    ctx.stroke();

    ctx.fillStyle = palette.topColor;
    ctx.beginPath(); ctx.arc(-antLength * 0.6, -bodyLength * 0.48 - antLength, 1.0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(antLength * 0.6, -bodyLength * 0.48 - antLength, 1.0, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  // Floating dandelions / spore seeds
  const spores = [];
  function initSpores() {
    spores.length = 0;
    for (let i = 0; i < 28; i++) {
      spores.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speedX: 12 + Math.random() * 20,
        bobFreq: 0.8 + Math.random() * 1.4,
        bobAmp: 8 + Math.random() * 16,
        size: 1.5 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.45,
        offset: Math.random() * 50
      });
    }
  }

  const butterflies = [
    new ButterflyFlyer(palettes[0], 1.05), // Golden Swallowtail
    new ButterflyFlyer(palettes[1], 0.95), // Cerulean Cruiser
    new ButterflyFlyer(palettes[2], 0.85), // Emerald Swallowtail
    new ButterflyFlyer(palettes[3], 0.90)  // Sunset Monarch
  ];

  let lastTime = performance.now();

  function render(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    const t = (now - startTime) / 1000;

    ctx.clearRect(0, 0, w, h);

    // ─── 1. SKY GRADIENT (Nightfall tropical palette) ───
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    skyGrad.addColorStop(0, '#040814');
    skyGrad.addColorStop(0.5, '#071226');
    skyGrad.addColorStop(1, '#0c1e38');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle twinkling stars in the high sky
    const starCount = 65;
    for (let i = 0; i < starCount; i++) {
      const sx = ((i * 137.5) % w);
      const sy = ((i * 83.1) % (h * 0.48));
      const sAlpha = (Math.sin(t * 1.5 + i) * 0.5 + 0.5) * 0.6 + 0.15;
      ctx.fillStyle = `rgba(224, 242, 254, ${sAlpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 3 === 0) ? 1.2 : 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // ─── 2. DISTANT SEYCHELLES GRANITIC ISLAND HORIZON ───
    const oceanTopY = h * 0.56;
    ctx.fillStyle = 'rgba(7, 28, 48, 0.85)';
    ctx.beginPath();
    ctx.moveTo(0, oceanTopY + 10);
    ctx.bezierCurveTo(w * 0.18, oceanTopY - 22, w * 0.35, oceanTopY - 32, w * 0.52, oceanTopY - 8);
    ctx.bezierCurveTo(w * 0.68, oceanTopY + 12, w * 0.82, oceanTopY - 18, w, oceanTopY + 6);
    ctx.lineTo(w, oceanTopY + 30);
    ctx.lineTo(0, oceanTopY + 30);
    ctx.closePath();
    ctx.fill();

    // ─── 3. TROPICAL OCEAN WATER LAYER ───
    const oceanBottomY = h * 0.74;
    const oceanGrad = ctx.createLinearGradient(0, oceanTopY, 0, oceanBottomY);
    oceanGrad.addColorStop(0, '#042749');
    oceanGrad.addColorStop(0.35, '#034575');
    oceanGrad.addColorStop(0.7, '#02588f');
    oceanGrad.addColorStop(1, '#0369a1');

    ctx.fillStyle = oceanGrad;
    ctx.beginPath();
    ctx.moveTo(0, oceanTopY);
    for (let x = 0; x <= w + 40; x += 40) {
      const y = oceanTopY + Math.sin(t * 1.2 + x * 0.015) * 3.5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, oceanBottomY + 30);
    ctx.lineTo(0, oceanBottomY + 30);
    ctx.closePath();
    ctx.fill();

    // Ocean light reflections / wave crest shimmers
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (let row = 0; row < 6; row++) {
      const rowY = oceanTopY + 12 + row * 16;
      const waveOffset = Math.sin(t * 0.8 + row * 1.1) * 22;
      const glintX = (w * 0.62) + waveOffset;
      const glintW = 40 + row * 35;
      ctx.beginPath();
      ctx.moveTo(glintX - glintW * 0.5, rowY);
      ctx.lineTo(glintX + glintW * 0.5, rowY);
      ctx.stroke();
    }

    // ─── 4. BACK GRANITIC MOSS HILL SLOPE ───
    const backHillP0 = h * 0.66;
    const backHillP1 = h * 0.58;
    const backHillP2 = h * 0.62;
    const backHillP3 = h * 0.72;

    const backHillGrad = ctx.createLinearGradient(0, backHillP1, 0, h);
    backHillGrad.addColorStop(0, '#064e3b');
    backHillGrad.addColorStop(0.5, '#033327');
    backHillGrad.addColorStop(1, '#021e17');

    ctx.fillStyle = backHillGrad;
    ctx.beginPath();
    ctx.moveTo(0, backHillP0);
    ctx.bezierCurveTo(w * 0.32, backHillP1, w * 0.68, backHillP2, w, backHillP3);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // ─── 5. FOREGROUND LUSH COASTAL BLUFF / HILL ───
    const frontHillP0 = h * 0.76;
    const frontHillP1 = h * 0.67;
    const frontHillP2 = h * 0.72;
    const frontHillP3 = h * 0.83;

    const frontHillGrad = ctx.createLinearGradient(0, frontHillP1, 0, h);
    frontHillGrad.addColorStop(0, '#059669'); // Emerald crest
    frontHillGrad.addColorStop(0.3, '#047857');
    frontHillGrad.addColorStop(0.7, '#064e3b');
    frontHillGrad.addColorStop(1, '#022c22');

    ctx.fillStyle = frontHillGrad;
    ctx.beginPath();
    ctx.moveTo(0, frontHillP0);
    ctx.bezierCurveTo(w * 0.35, frontHillP1, w * 0.72, frontHillP2, w, frontHillP3);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Fine swaying wind grass blades along the front crest
    const grassBlades = 36;
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < grassBlades; i++) {
      const prog = i / (grassBlades - 1);
      const gx = w * prog;
      // Bezier curve height calculation
      const u = 1 - prog;
      const gy = (u*u*u*frontHillP0) + (3*u*u*prog*frontHillP1) + (3*u*prog*prog*frontHillP2) + (prog*prog*prog*frontHillP3);
      const sway = Math.sin(t * 1.8 + i * 0.3) * (7 + (i % 4) * 2);
      ctx.beginPath();
      ctx.moveTo(gx, gy + 3);
      ctx.quadraticCurveTo(gx - sway * 0.5, gy - 12, gx - sway, gy - 24 - (i % 5) * 3);
      ctx.stroke();
    }

    // ─── 6. FLOATING DANDELION / SEED SPORES ───
    spores.forEach(s => {
      s.x += s.speedX * dt;
      if (s.x > w + 20) s.x = -20;
      const sy = s.y + Math.sin(t * s.bobFreq + s.offset) * s.bobAmp;
      ctx.fillStyle = `rgba(240, 253, 250, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, sy, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // ─── 7. ANIMATED BUTTERFLIES ───
    butterflies.forEach(b => {
      b.update(dt, t);
      b.draw(ctx, t);
    });

    requestAnimationFrame(render);
  }

  resize();
  initSpores();
  requestAnimationFrame(render);
  window.addEventListener('resize', () => { resize(); initSpores(); });
})();

/* ── Typing Effect ── */
(function() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = [
    "Infrastructure Engineer.",
    "AI-Assisted Developer.",
    "Systems Thinker.",
    "20+ Years in the Field."
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 75);
  }
  setTimeout(tick, 800);
})();

/* ── Counter Animation ── */
(function() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0;
      const inc = target / 40;
      const tick = () => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.ceil(cur);
        if (cur < target) requestAnimationFrame(tick);
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── Scroll Reveal ── */
(function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();
