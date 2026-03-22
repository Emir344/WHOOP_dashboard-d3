const { D3Node } = require('d3-node');
const d3 = require('d3');
const fs = require('fs');

// ── Data ──────────────────────────────────────────────────────────────────────
const days   = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const strain = [9.2, 12.4, 4.8, 18.1, 10.6, 7.8, 4.5];
const peakIdx = 3;

// ── Dimensions ────────────────────────────────────────────────────────────────
const W = 360, H = 580;
const pl = 22, pr = 22;

const chartX1   = pl + 14;
const chartX2   = W - pr - 14;
const chartW    = chartX2 - chartX1;
const chartTop  = 208;
const chartBot  = 370;
const chartH    = chartBot - chartTop;
const barW      = chartW / days.length;

const yMax = 20;
const yScale = d3.scaleLinear().domain([0, yMax]).range([chartH, 0]);

// ── SVG setup ─────────────────────────────────────────────────────────────────
const d3n = new D3Node();
const svg = d3n.createSVG(W, H)
  .attr('xmlns', 'http://www.w3.org/2000/svg')
  .style('background', '#050a14')
  .style('font-family', 'system-ui, -apple-system, sans-serif');

// ── Phone frame ───────────────────────────────────────────────────────────────
svg.append('rect')
  .attr('x', 4).attr('y', 4)
  .attr('width', W - 8).attr('height', H - 8)
  .attr('rx', 32).attr('fill', '#07090d')
  .attr('stroke', '#1c1c1e').attr('stroke-width', 2.5);

// Notch
svg.append('rect')
  .attr('x', W / 2 - 24).attr('y', 14)
  .attr('width', 48).attr('height', 5)
  .attr('rx', 2.5).attr('fill', '#1c1c1e');

// ── Status bar ────────────────────────────────────────────────────────────────
svg.append('text').text('9:41')
  .attr('x', pl + 12).attr('y', 36)
  .attr('fill', 'rgba(255,255,255,.3)').attr('font-size', 9);
svg.append('text').text('Load')
  .attr('x', W - pr - 12).attr('y', 36).attr('text-anchor', 'end')
  .attr('fill', 'rgba(255,255,255,.3)').attr('font-size', 9);

// ── Section label ─────────────────────────────────────────────────────────────
svg.append('text').text('WEEKLY PERFORMANCE')
  .attr('x', pl + 12).attr('y', 56)
  .attr('fill', 'rgba(255,255,255,.52)')
  .attr('font-size', 8.5).attr('font-weight', 600).attr('letter-spacing', 1.2);

// ── Hero row: Performance Score + Training Load ───────────────────────────────
svg.append('text').text('PERFORMANCE SCORE')
  .attr('x', pl + 12).attr('y', 74)
  .attr('fill', 'rgba(255,255,255,.35)').attr('font-size', 7.5).attr('letter-spacing', 0.8);
svg.append('text').text('82')
  .attr('x', pl + 12).attr('y', 112)
  .attr('fill', '#38bdf8').attr('font-size', 44).attr('font-weight', 600);

svg.append('text').text('TRAINING LOAD')
  .attr('x', W - pr - 12).attr('y', 74).attr('text-anchor', 'end')
  .attr('fill', 'rgba(255,255,255,.35)').attr('font-size', 7.5).attr('letter-spacing', 0.8);
svg.append('text').text('720')
  .attr('x', W - pr - 12).attr('y', 112).attr('text-anchor', 'end')
  .attr('fill', '#38bdf8').attr('font-size', 32).attr('font-weight', 600);
svg.append('text').text('+32% vs last wk')
  .attr('x', W - pr - 12).attr('y', 128).attr('text-anchor', 'end')
  .attr('fill', '#fb923c').attr('font-size', 8.5).attr('font-weight', 500);

// ── Divider ───────────────────────────────────────────────────────────────────
svg.append('line')
  .attr('x1', pl + 12).attr('y1', 136).attr('x2', W - pr - 12).attr('y2', 136)
  .attr('stroke', 'rgba(255,255,255,.07)').attr('stroke-width', 0.5);

// ── Chart card background ─────────────────────────────────────────────────────
svg.append('rect')
  .attr('x', pl + 4).attr('y', 144)
  .attr('width', W - pl - pr - 8).attr('height', 238)
  .attr('rx', 9).attr('fill', 'rgba(255,255,255,.04)');

svg.append('text').text('DAILY STRAIN')
  .attr('x', pl + 16).attr('y', 162)
  .attr('fill', 'rgba(255,255,255,.35)').attr('font-size', 7.5).attr('letter-spacing', 0.8);

// ── Gridlines (Bertin: position on common scale) ──────────────────────────────
svg.append('line')
  .attr('x1', chartX1).attr('y1', chartTop)
  .attr('x2', chartX2).attr('y2', chartTop)
  .attr('stroke', 'rgba(255,255,255,.08)').attr('stroke-width', 0.5);

svg.append('line')
  .attr('x1', chartX1).attr('y1', chartTop + chartH * 0.5)
  .attr('x2', chartX2).attr('y2', chartTop + chartH * 0.5)
  .attr('stroke', 'rgba(255,255,255,.05)').attr('stroke-width', 0.5);

svg.append('line')
  .attr('x1', chartX1).attr('y1', chartBot)
  .attr('x2', chartX2).attr('y2', chartBot)
  .attr('stroke', 'rgba(255,255,255,.14)').attr('stroke-width', 0.5);

// ── Bars ──────────────────────────────────────────────────────────────────────
days.forEach((day, i) => {
  const barHeight = (strain[i] / yMax) * chartH;
  const bx        = chartX1 + i * barW + barW * 0.15;
  const bww       = barW * 0.7;
  const by        = chartBot - barHeight;
  const isPeak    = i === peakIdx;

  svg.append('rect')
    .attr('x', bx).attr('y', by)
    .attr('width', bww).attr('height', barHeight)
    .attr('rx', 2)
    .attr('fill', isPeak ? '#7df4ff' : 'rgba(56,189,248,.35)');

  const labelY = by - 5;
  if (isPeak) {
    svg.append('text').text('18.1')
      .attr('x', bx + bww / 2 - 10).attr('y', labelY)
      .attr('text-anchor', 'end')
      .attr('fill', '#ffffff').attr('font-size', 7).attr('font-weight', 700);
    svg.append('text').text('← Peak')
      .attr('x', bx + bww / 2 - 8).attr('y', labelY)
      .attr('text-anchor', 'start')
      .attr('fill', '#7df4ff').attr('font-size', 7).attr('font-weight', 700);
  } else {
    svg.append('text').text(strain[i].toString())
      .attr('x', bx + bww / 2).attr('y', labelY)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,.3)').attr('font-size', 6.5);
  }

  svg.append('text').text(day)
    .attr('x', bx + bww / 2).attr('y', chartBot + 14)
    .attr('text-anchor', 'middle')
    .attr('fill', isPeak ? '#7df4ff' : 'rgba(255,255,255,.28)')
    .attr('font-size', 7).attr('font-weight', isPeak ? 600 : 400);
});

// ── Divider ───────────────────────────────────────────────────────────────────
svg.append('line')
  .attr('x1', pl + 12).attr('y1', 396).attr('x2', W - pr - 12).attr('y2', 396)
  .attr('stroke', 'rgba(255,255,255,.07)').attr('stroke-width', 0.5);

// ── Weekly Summary label ──────────────────────────────────────────────────────
svg.append('text').text('WEEKLY SUMMARY')
  .attr('x', pl + 12).attr('y', 414)
  .attr('fill', 'rgba(255,255,255,.52)')
  .attr('font-size', 8.5).attr('font-weight', 600).attr('letter-spacing', 1.2);

// ── Metric tiles ──────────────────────────────────────────────────────────────
const tiles = [
  { val: '75',     sub: 'Avg recovery', bar: 0.75, denom: '/ 100'  },
  { val: '82%',    sub: 'Completion',   bar: 0.82, denom: '/ 100%' },
  { val: '7h 10m', sub: 'Avg sleep',    bar: 0.72, denom: '/ 10h'  },
];

const tileY   = 422;
const tileH   = 72;
const tileW   = (W - pl - pr - 24) / 3;
const tileGap = 6;

tiles.forEach((t, i) => {
  const tx = pl + 12 + i * (tileW + tileGap);

  svg.append('rect')
    .attr('x', tx).attr('y', tileY)
    .attr('width', tileW).attr('height', tileH)
    .attr('rx', 9).attr('fill', 'rgba(255,255,255,.05)');

  const fontSize = t.val.length > 4 ? 12 : 16;
  svg.append('text').text(t.val)
    .attr('x', tx + tileW / 2).attr('y', tileY + 22)
    .attr('text-anchor', 'middle')
    .attr('fill', '#38bdf8').attr('font-size', fontSize).attr('font-weight', 600);

  svg.append('text').text(t.sub)
    .attr('x', tx + tileW / 2).attr('y', tileY + 36)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(255,255,255,.35)').attr('font-size', 7);

  const barTrackX = tx + 8;
  const barTrackW = tileW - 16;

  svg.append('rect')
    .attr('x', barTrackX).attr('y', tileY + 44)
    .attr('width', barTrackW).attr('height', 3)
    .attr('rx', 1.5).attr('fill', 'rgba(255,255,255,.07)');

  svg.append('rect')
    .attr('x', barTrackX).attr('y', tileY + 44)
    .attr('width', barTrackW * t.bar).attr('height', 3)
    .attr('rx', 1.5).attr('fill', '#38bdf8');

  svg.append('text').text(t.denom)
    .attr('x', tx + tileW / 2).attr('y', tileY + 59)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(255,255,255,.18)').attr('font-size', 6)
    .attr('font-family', 'monospace');
});

// ── Alert card ────────────────────────────────────────────────────────────────
const alertY = 506;
svg.append('rect')
  .attr('x', pl + 12).attr('y', alertY)
  .attr('width', W - pl - pr - 24).attr('height', 36)
  .attr('rx', 9)
  .attr('fill', 'rgba(251,146,60,.08)')
  .attr('stroke', 'rgba(251,146,60,.25)').attr('stroke-width', 0.5);

svg.append('circle')
  .attr('cx', pl + 24).attr('cy', alertY + 18)
  .attr('r', 3.5).attr('fill', '#fb923c');

svg.append('text').text('Load spike detected — consider a recovery day this week.')
  .attr('x', pl + 34).attr('y', alertY + 22)
  .attr('fill', '#fde68a').attr('font-size', 7.5).attr('font-weight', 600);

// ── Write output ──────────────────────────────────────────────────────────────
fs.writeFileSync('whoop_dashboard3.svg', d3n.svgString());
console.log('SVG written to whoop_dashboard3.svg');
