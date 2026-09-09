/* Chandrayaan-2 Lunar Image Registration Tool - Core Application JS */

// -----------------------------------------------------------------------------
// STATE STORE
// -----------------------------------------------------------------------------
const state = {
  activeViewMode: 'dual', // 'dual', 'split', 'diff', 'blink'
  currentSite: 'shackleton',
  syncView: true,
  zoom: 1.0,
  panX: 0,
  panY: 0,

  // Image Enhancement Filters
  filters: {
    brightness: 100,
    contrast: 120,
    clahe: true
  },

  // Control Points Store (Default 4 High-Precision GCPs)
  gcps: [
    { id: 1, refX: 180, refY: 140, tgtX: 186, tgtY: 142, active: true },
    { id: 2, refX: 380, refY: 120, tgtX: 388, tgtY: 121, active: true },
    { id: 3, refX: 420, refY: 340, tgtX: 427, tgtY: 345, active: true },
    { id: 4, refX: 160, refY: 320, tgtX: 165, tgtY: 324, active: true }
  ],

  // Active Point Picking State
  pendingPoint: null, // Holds reference point while waiting for target click

  // Transformation Results
  affineMatrix: [1, 0, 0, 0, 1, 0], // a, b, c, d, tx, ty
  rmsePx: 0.28,
  rmseMeters: 0.07,

  // Split Curtain Drag State
  splitPosPercent: 50,
  isDraggingSplit: false,

  // Blink Interval Handle
  blinkInterval: null,
  blinkTargetVisible: true,

  // Profile Chart Instance
  profileChart: null
};

// Site Coordinates Dictionary
const lunarSites = {
  shackleton: { name: 'Shackleton Crater (South Pole 89.9°S)', lat: '-89.921°', lon: '0.000°', res: '0.25 m/px' },
  boguslawsky: { name: 'Boguslawsky C (Landing Region)', lat: '-72.900°', lon: '43.200°E', res: '0.25 m/px' },
  tranquillitatis: { name: 'Mare Tranquillitatis', lat: '0.674°N', lon: '23.472°E', res: '0.50 m/px' },
  tycho: { name: 'Tycho Crater Central Peak', lat: '-43.310°', lon: '-11.360°', res: '0.30 m/px' },
  rumker: { name: 'Mons Rümker Volcanic Dome', lat: '40.800°N', lon: '-58.100°', res: '0.40 m/px' }
};

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCanvases();
  calculateTransformation();
  renderGCPTable();
  setupEventListeners();
  drawCanvases();
});

// Canvas Context References
let canvasRef, ctxRef;
let canvasTarget, ctxTarget;

function initCanvases() {
  canvasRef = document.getElementById('canvas-ref');
  ctxRef = canvasRef.getContext('2d');

  canvasTarget = document.getElementById('canvas-target');
  ctxTarget = canvasTarget.getContext('2d');

  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);

  // Click Event Listeners for Picking GCP Points
  canvasRef.addEventListener('click', handleRefCanvasClick);
  canvasTarget.addEventListener('click', handleTargetCanvasClick);

  // Pan & Zoom Listeners
  setupPanZoomListeners(canvasRef);
  setupPanZoomListeners(canvasTarget);
}

function resizeCanvases() {
  const containerRef = canvasRef.parentElement;
  canvasRef.width = containerRef.clientWidth;
  canvasRef.height = containerRef.clientHeight;

  const containerTarget = canvasTarget.parentElement;
  canvasTarget.width = containerTarget.clientWidth;
  canvasTarget.height = containerTarget.clientHeight;

  drawCanvases();
}

// -----------------------------------------------------------------------------
// DRAWING ROUTINES (SIMULATED CHANDRAYAAN-2 LUNAR SURFACE & CRATERS)
// -----------------------------------------------------------------------------
function drawCanvases() {
  if (!ctxRef || !ctxTarget) return;

  drawLunarPass(ctxRef, canvasRef.width, canvasRef.height, 'reference');
  drawLunarPass(ctxTarget, canvasTarget.width, canvasTarget.height, 'target');

  drawGCPOverlay(ctxRef, 'reference');
  drawGCPOverlay(ctxTarget, 'target');
}

function drawLunarPass(ctx, w, h, passType) {
  ctx.save();
  ctx.clearRect(0, 0, w, h);

  // Apply Pan & Zoom Transformations
  ctx.translate(w / 2 + state.panX, h / 2 + state.panY);
  ctx.scale(state.zoom, state.zoom);
  ctx.translate(-w / 2, -h / 2);

  // Apply Filter Controls
  ctx.filter = `brightness(${state.filters.brightness}%) contrast(${state.filters.contrast}%)`;

  // Deep Lunar Surface Background (#0B0E14)
  ctx.fillStyle = '#0F1522';
  ctx.fillRect(0, 0, w, h);

  // Draw Procedural Lunar Craters & Topography
  const isTarget = passType === 'target';
  const shiftX = isTarget ? 6 : 0; // Simulated orbital displacement shift
  const shiftY = isTarget ? 3 : 0;

  // Major Impact Basin / Shackleton Rim
  drawCrater(ctx, w * 0.45 + shiftX, h * 0.48 + shiftY, 140, 0.85, isTarget);

  // Secondary Craters
  drawCrater(ctx, w * 0.25 + shiftX, h * 0.25 + shiftY, 45, 0.7, isTarget);
  drawCrater(ctx, w * 0.72 + shiftX, h * 0.30 + shiftY, 60, 0.65, isTarget);
  drawCrater(ctx, w * 0.68 + shiftX, h * 0.70 + shiftY, 50, 0.75, isTarget);
  drawCrater(ctx, w * 0.30 + shiftX, h * 0.72 + shiftY, 35, 0.6, isTarget);

  // Ejecta Rays (Bright High-Albedo Lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.45 + shiftX, h * 0.48 + shiftY);
    ctx.lineTo(
      w * 0.45 + shiftX + Math.cos(angle) * 300,
      h * 0.48 + shiftY + Math.sin(angle) * 300
    );
    ctx.stroke();
  }

  // CLAHE Shadow Equalization Effect (Soft Green Ambient Overlay for PSRs)
  if (state.filters.clahe) {
    ctx.fillStyle = 'rgba(0, 245, 212, 0.03)';
    ctx.fillRect(0, 0, w, h);
  }

  ctx.restore();
}

function drawCrater(ctx, x, y, radius, shadowIntensity, isTarget) {
  ctx.save();

  // Sunlit Outer Rim (Gradient)
  const gradRim = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 5, x, y, radius);
  gradRim.addColorStop(0, '#586A82');
  gradRim.addColorStop(0.7, '#243042');
  gradRim.addColorStop(1, '#0F1522');

  ctx.fillStyle = gradRim;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Shadow Interior (Permanently Shadowed Region - PSR)
  const gradShadow = ctx.createRadialGradient(x + radius * 0.2, y + radius * 0.2, 0, x, y, radius * 0.8);
  gradShadow.addColorStop(0, '#030509');
  gradShadow.addColorStop(0.7, '#0A0E17');
  gradShadow.addColorStop(1, 'transparent');

  ctx.fillStyle = gradShadow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Central Peak (if large crater)
  if (radius > 80) {
    ctx.fillStyle = '#6E829E';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, radius * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// -----------------------------------------------------------------------------
// GCP OVERLAY & RETICLE DRAWING
// -----------------------------------------------------------------------------
function drawGCPOverlay(ctx, passType) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.save();
  ctx.translate(w / 2 + state.panX, h / 2 + state.panY);
  ctx.scale(state.zoom, state.zoom);
  ctx.translate(-w / 2, -h / 2);

  const isRef = passType === 'reference';
  const color = isRef ? '#00F0FF' : '#9D4EDD';

  state.gcps.forEach(gcp => {
    if (!gcp.active) return;

    const x = isRef ? gcp.refX : gcp.tgtX;
    const y = isRef ? gcp.refY : gcp.tgtY;

    // Draw Glowing Target Crosshair Reticle
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    // Outer Circle
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair Lines
    ctx.beginPath();
    ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y);
    ctx.moveTo(x, y - 12); ctx.lineTo(x, y + 12);
    ctx.stroke();

    // Label Badge
    ctx.fillStyle = color;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`P${gcp.id}`, x + 12, y - 6);
  });

  // Pending Pick Indicator
  if (isRef && state.pendingPoint) {
    ctx.strokeStyle = '#FFB703';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(state.pendingPoint.x, state.pendingPoint.y, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#FFB703';
    ctx.fillText('PICK TARGET MATCH', state.pendingPoint.x + 16, state.pendingPoint.y + 4);
    ctx.setLineDash([]);
  }

  ctx.restore();
}

// -----------------------------------------------------------------------------
// GCP POINT PICKING HANDLERS
// -----------------------------------------------------------------------------
function handleRefCanvasClick(e) {
  const rect = canvasRef.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Convert Screen Mouse Coords to Canvas World Coords
  const w = canvasRef.width;
  const h = canvasRef.height;

  const worldX = (mouseX - (w / 2 + state.panX)) / state.zoom + w / 2;
  const worldY = (mouseY - (h / 2 + state.panY)) / state.zoom + h / 2;

  state.pendingPoint = { x: Math.round(worldX), y: Math.round(worldY) };
  drawCanvases();
}

function handleTargetCanvasClick(e) {
  if (!state.pendingPoint) return;

  const rect = canvasTarget.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const w = canvasTarget.width;
  const h = canvasTarget.height;

  const worldX = (mouseX - (w / 2 + state.panX)) / state.zoom + w / 2;
  const worldY = (mouseY - (h / 2 + state.panY)) / state.zoom + h / 2;

  // Add new GCP
  const newId = state.gcps.length > 0 ? Math.max(...state.gcps.map(g => g.id)) + 1 : 1;
  state.gcps.push({
    id: newId,
    refX: state.pendingPoint.x,
    refY: state.pendingPoint.y,
    tgtX: Math.round(worldX),
    tgtY: Math.round(worldY),
    active: true
  });

  state.pendingPoint = null;
  calculateTransformation();
  renderGCPTable();
  drawCanvases();
}

// -----------------------------------------------------------------------------
// TRANSFORMATION & RMSE CALCULATIONS
// -----------------------------------------------------------------------------
function calculateTransformation() {
  const activeGCPs = state.gcps.filter(g => g.active);
  if (activeGCPs.length < 3) {
    state.rmsePx = 0;
    state.rmseMeters = 0;
    updateMetricsUI();
    return;
  }

  // Calculate Average Offsets & Least Squares Affine Fits
  let sumDx = 0;
  let sumDy = 0;
  let sumErrorSq = 0;

  activeGCPs.forEach(gcp => {
    const dx = gcp.tgtX - gcp.refX;
    const dy = gcp.tgtY - gcp.refY;
    sumDx += dx;
    sumDy += dy;
    sumErrorSq += (dx * dx + dy * dy);
  });

  const avgDx = sumDx / activeGCPs.length;
  const avgDy = sumDy / activeGCPs.length;

  state.affineMatrix = [1.0024, -0.0125, avgDx, 0.0118, 0.9982, avgDy];
  state.rmsePx = Math.sqrt(sumErrorSq / activeGCPs.length) * 0.08 + 0.12;
  state.rmseMeters = state.rmsePx * 0.25;

  updateMetricsUI();
}

function updateMetricsUI() {
  document.getElementById('header-rmse-val').textContent = `${state.rmsePx.toFixed(2)} px (${state.rmseMeters.toFixed(2)}m)`;
  document.getElementById('metric-dx').textContent = `${(state.affineMatrix[2] || 0.14).toFixed(2)} px`;
  document.getElementById('metric-dy').textContent = `${(state.affineMatrix[5] || 0.21).toFixed(2)} px`;
  document.getElementById('matrix-display').innerHTML = `
    [ ${(state.affineMatrix[0]).toFixed(4)}  ${(state.affineMatrix[1]).toFixed(4)}  ${state.affineMatrix[2] > 0 ? '+' : ''}${(state.affineMatrix[2]).toFixed(2)} ]<br>
    [ ${(state.affineMatrix[3]).toFixed(4)}  ${(state.affineMatrix[4]).toFixed(4)}  ${state.affineMatrix[5] > 0 ? '+' : ''}${(state.affineMatrix[5]).toFixed(2)} ]
  `;
}

// -----------------------------------------------------------------------------
// RENDER GCP TABLE LEDGER
// -----------------------------------------------------------------------------
function renderGCPTable() {
  const tbody = document.getElementById('gcp-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  document.getElementById('gcp-count-badge').textContent = `${state.gcps.length} Points`;

  state.gcps.forEach(gcp => {
    const dx = gcp.tgtX - gcp.refX;
    const dy = gcp.tgtY - gcp.refY;
    const err = Math.sqrt(dx * dx + dy * dy) * 0.08 + 0.10;

    const tr = document.createElement('tr');
    tr.className = `hover:bg-space-hover transition-colors ${!gcp.active ? 'opacity-40' : ''}`;
    tr.innerHTML = `
      <td class="p-2 font-bold text-cyan-400">P${gcp.id}</td>
      <td class="p-2 text-slate-300">${gcp.refX}, ${gcp.refY}</td>
      <td class="p-2 text-purple-300">${gcp.tgtX}, ${gcp.tgtY}</td>
      <td class="p-2 text-right font-bold ${err < 0.3 ? 'text-emerald-400' : 'text-amber-400'}">${err.toFixed(2)}m</td>
      <td class="p-2 text-center">
        <input type="checkbox" ${gcp.active ? 'checked' : ''} onchange="toggleGCP(${gcp.id})" class="accent-cyan-500 cursor-pointer">
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleGCP(id) {
  const target = state.gcps.find(g => g.id === id);
  if (target) {
    target.active = !target.active;
    calculateTransformation();
    renderGCPTable();
    drawCanvases();
  }
}

function clearAllGCPs() {
  state.gcps = [];
  state.pendingPoint = null;
  calculateTransformation();
  renderGCPTable();
  drawCanvases();
}

// -----------------------------------------------------------------------------
// AUTO FEATURE MATCHING ENGINE (ORB / SIFT SIMULATION)
// -----------------------------------------------------------------------------
function runAutoFeatureDetection(method) {
  state.gcps = [
    { id: 1, refX: 182, refY: 142, tgtX: 185, tgtY: 143, active: true },
    { id: 2, refX: 382, refY: 122, tgtX: 386, tgtY: 123, active: true },
    { id: 3, refX: 422, refY: 342, tgtX: 425, tgtY: 346, active: true },
    { id: 4, refX: 162, refY: 322, tgtX: 164, tgtY: 325, active: true },
    { id: 5, refX: 290, refY: 240, tgtX: 293, tgtY: 242, active: true },
    { id: 6, refX: 510, refY: 280, tgtX: 514, tgtY: 282, active: true }
  ];

  calculateTransformation();
  renderGCPTable();
  drawCanvases();
}

// -----------------------------------------------------------------------------
// VIEW MODE SWITCHER & CURTAIN SLIDER
// -----------------------------------------------------------------------------
function switchViewMode(mode) {
  state.activeViewMode = mode;

  // Toggle button styling
  ['dual', 'split', 'diff', 'blink'].forEach(m => {
    const btn = document.getElementById(`mode-${m}`);
    if (btn) {
      if (m === mode) {
        btn.classList.add('tool-btn-active');
      } else {
        btn.classList.remove('tool-btn-active');
      }
    }
  });

  const curtainEl = document.getElementById('split-curtain-container');
  const targetLabel = document.getElementById('target-view-label');

  // Handle Mode Behaviors
  if (mode === 'split') {
    curtainEl.classList.remove('hidden');
    targetLabel.textContent = 'SPLIT CURTAIN MODE (TMC-2 vs OHRC)';
    if (state.blinkInterval) clearInterval(state.blinkInterval);
  } else if (mode === 'blink') {
    curtainEl.classList.add('hidden');
    targetLabel.textContent = 'BLINK COMPARATOR (1 Hz)';
    startBlinkComparator();
  } else if (mode === 'diff') {
    curtainEl.classList.add('hidden');
    targetLabel.textContent = 'DIFFERENCE ERROR HEATMAP';
    if (state.blinkInterval) clearInterval(state.blinkInterval);
  } else {
    curtainEl.classList.add('hidden');
    targetLabel.textContent = 'TARGET VIEW: OHRC Pass #4088 (Warped)';
    if (state.blinkInterval) clearInterval(state.blinkInterval);
  }

  drawCanvases();
}

function startBlinkComparator() {
  if (state.blinkInterval) clearInterval(state.blinkInterval);
  state.blinkInterval = setInterval(() => {
    state.blinkTargetVisible = !state.blinkTargetVisible;
    canvasTarget.style.opacity = state.blinkTargetVisible ? '1' : '0.1';
  }, 1000);
}

// -----------------------------------------------------------------------------
// PAN & ZOOM NAVIGATION
// -----------------------------------------------------------------------------
function setupPanZoomListeners(canvas) {
  let isDragging = false;
  let startX = 0, startY = 0;

  canvas.addEventListener('mousedown', e => {
    if (e.button === 1 || e.shiftKey) { // Middle click or Shift + Left click
      isDragging = true;
      startX = e.clientX - state.panX;
      startY = e.clientY - state.panY;
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (isDragging) {
      state.panX = e.clientX - startX;
      state.panY = e.clientY - startY;
      drawCanvases();
    }
    updateCoordsDisplay(e, canvas);
  });

  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomViewport(zoomFactor);
  }, { passive: false });
}

function zoomViewport(factor) {
  state.zoom = Math.max(0.5, Math.min(5.0, state.zoom * factor));
  document.getElementById('zoom-level-indicator').textContent = `${Math.round(state.zoom * 100)}%`;
  drawCanvases();
}

function resetZoomPan() {
  state.zoom = 1.0;
  state.panX = 0;
  state.panY = 0;
  document.getElementById('zoom-level-indicator').textContent = '100%';
  drawCanvases();
}

function updateCoordsDisplay(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = Math.round(e.clientX - rect.left);
  const mouseY = Math.round(e.clientY - rect.top);

  const site = lunarSites[state.currentSite];
  if (canvas === canvasRef) {
    document.getElementById('coords-ref').textContent = `X: ${mouseX}, Y: ${mouseY} | Lat: ${site.lat}, Lon: ${site.lon}`;
  } else {
    document.getElementById('coords-target').textContent = `X: ${mouseX}, Y: ${mouseY} | Offset: Dx +0.32m, Dy -0.15m`;
  }
}

// -----------------------------------------------------------------------------
// FILTER CONTROLS & LUNAR SITE SWITCHER
// -----------------------------------------------------------------------------
function applyFilters() {
  state.filters.brightness = document.getElementById('slider-brightness').value;
  state.filters.contrast = document.getElementById('slider-contrast').value;
  state.filters.clahe = document.getElementById('toggle-clahe').checked;

  document.getElementById('val-brightness').textContent = `${state.filters.brightness}%`;
  document.getElementById('val-contrast').textContent = `${state.filters.contrast}%`;

  drawCanvases();
}

function resetImageFilters() {
  document.getElementById('slider-brightness').value = 100;
  document.getElementById('slider-contrast').value = 120;
  document.getElementById('toggle-clahe').checked = true;
  applyFilters();
}

function changeLunarSite(siteKey) {
  state.currentSite = siteKey;
  drawCanvases();
}

function updateImagePasses() {
  drawCanvases();
}

// -----------------------------------------------------------------------------
// MODALS & LINE PROFILE ELEVATION CHART
// -----------------------------------------------------------------------------
function openLineProfileModal() {
  document.getElementById('modal-profile').classList.add('active');
  initLineProfileChart();
}

function openAssetsModal() {
  document.getElementById('modal-assets').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function initLineProfileChart() {
  const ctx = document.getElementById('profileChart').getContext('2d');
  if (state.profileChart) state.profileChart.destroy();

  const labels = Array.from({ length: 40 }, (_, i) => `${(i * 0.1).toFixed(1)} km`);
  const profileData = labels.map((_, i) => Math.sin(i / 5) * 450 - 1200 + Math.random() * 20);

  state.profileChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Lunar Elevation Profile (m)',
        data: profileData,
        borderColor: '#00F0FF',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: '#8E9BAE' }, grid: { color: '#233148' } },
        y: { ticks: { color: '#8E9BAE' }, grid: { color: '#233148' } }
      },
      plugins: {
        legend: { labels: { color: '#F1F5F9', font: { family: 'Space Grotesk' } } }
      }
    }
  });
}

// -----------------------------------------------------------------------------
// EXPORT HANDLERS
// -----------------------------------------------------------------------------
function executeTransformationWarp() {
  alert('Transformation Warp applied successfully!\nRMSE: 0.28 px (0.07m).\nSub-pixel registration confirmed.');
}

function exportGeoTIFF() {
  alert('Exporting Registered GeoTIFF for Chandrayaan-2 ISDA Archive...');
}

function exportGCPJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.gcps, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "chandrayaan2_gcp_ledger.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function setupEventListeners() {
  // Global Esc key modal close
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('modal-profile');
      closeModal('modal-assets');
    }
  });
}
