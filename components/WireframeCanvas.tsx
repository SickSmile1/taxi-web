'use client';

import { useEffect, useRef } from 'react';

type ShapeName = 'sedan' | 'estate' | 'cube' | 'octa' | 'tetra' | 'icosa';
type Tone = 'gold' | 'white' | 'black';

interface WireframeCanvasProps {
  shape: ShapeName;
  tone?: Tone;
  /** Enables mouse/touch drag-to-rotate. Set false for purely decorative, click-through backgrounds. */
  interactive?: boolean;
  /** Plays a brief, one-time "you can rotate this" hint on mount. Use on small thumbnails. */
  showHint?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

type Vec3 = [number, number, number];
type EdgeTag = 'body' | 'wheel' | 'spoke' | 'taxi';
type Edge = [number, number] | [number, number, EdgeTag];
type PanelTag = 'body' | 'glass';
interface PanelEntry {
  idx: number[];
  tag: PanelTag;
}
type Point2D = [number, number];

interface WheelPoint {
  vertIndex: number;
  cx: number;
  cy: number;
  r: number;
  baseAngle: number;
  z: number;
}

interface ShapeData {
  verts: Vec3[];
  edges: Edge[];
  panels: PanelEntry[];
  taxiPanels: number[][];
  wheelPoints: WheelPoint[];
  hubIndices: number[];
  car: boolean;
  lightDots?: [number, string][];
}

function catmullRom1D(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
): number {
  const t2 = t * t,
    t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

function smoothProfile(
  pts: Point2D[],
  samplesPerSeg = 2,
): { points: Point2D[]; segmentOf: number[] } {
  const rawN = pts.length;
  const points: Point2D[] = [];
  const segmentOf: number[] = [];
  for (let i = 0; i < rawN - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[Math.min(rawN - 1, i + 2)];
    for (let s = 0; s < samplesPerSeg; s++) {
      const t = s / samplesPerSeg;
      points.push([
        catmullRom1D(p0[0], p1[0], p2[0], p3[0], t),
        catmullRom1D(p0[1], p1[1], p2[1], p3[1], t),
      ]);
      segmentOf.push(i);
    }
  }
  points.push(pts[rawN - 1]);
  segmentOf.push(rawN - 2);
  return { points, segmentOf };
}

function buildEdges(verts: Vec3[]): Edge[] {
  let min = Infinity;
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const dx = verts[i][0] - verts[j][0];
      const dy = verts[i][1] - verts[j][1];
      const dz = verts[i][2] - verts[j][2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < min) min = d;
    }
  }
  const edges: Edge[] = [];
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const dx = verts[i][0] - verts[j][0];
      const dy = verts[i][1] - verts[j][1];
      const dz = verts[i][2] - verts[j][2];
      if (dx * dx + dy * dy + dz * dz <= min * 1.12) edges.push([i, j]);
    }
  }
  return edges;
}

const CAR_SCALE = 0.52;
const CAR_YC = 0.55;
function carPoint(x: number, y: number, z: number): Vec3 {
  return [x * CAR_SCALE, (CAR_YC - y) * CAR_SCALE, z * CAR_SCALE];
}

function buildCar(
  rawProfile: Point2D[],
  nz: number,
  glassSegments: Set<number> = new Set([3, 5]),
): ShapeData {
  const { points: profile, segmentOf } = smoothProfile(rawProfile, 2);
  const zH = 0.85;
  const P = carPoint;
  const wf = (y: number) => (y > 0.72 ? 0.7 : 1);
  const verts: Vec3[] = [];
  const edges: Edge[] = [];
  const panels: PanelEntry[] = [];
  const wheelPoints: WheelPoint[] = [];
  const hubIndices: number[] = [];
  const n = profile.length;
  const NZ = Math.max(2, nz);

  for (let j = 0; j < NZ; j++) {
    const t = (j / (NZ - 1)) * 2 - 1;
    for (let i = 0; i < n; i++) {
      verts.push(P(profile[i][0], profile[i][1], t * zH * wf(profile[i][1])));
    }
  }

  for (let j = 0; j < NZ; j++) {
    for (let i = 0; i < n; i++) {
      if (glassSegments.has(segmentOf[i])) continue;
      edges.push([j * n + i, j * n + ((i + 1) % n), 'body']);
    }
  }
  for (let j = 0; j < NZ - 1; j++) {
    for (let i = 0; i < n; i++) {
      edges.push([j * n + i, (j + 1) * n + i, 'body']);
      const tag: PanelTag = glassSegments.has(segmentOf[i]) ? 'glass' : 'body';
      panels.push({
        idx: [
          j * n + i,
          j * n + ((i + 1) % n),
          (j + 1) * n + ((i + 1) % n),
          (j + 1) * n + i,
        ],
        tag,
      });
    }
  }

  const capLo = Math.min(...glassSegments);
  const capHi = Math.max(...glassSegments);
  const capIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    if (segmentOf[i] >= capLo && segmentOf[i] <= capHi) capIdx.push(i);
  }
  if (capIdx.length >= 3) {
    panels.push({ idx: capIdx.map((i) => i), tag: 'glass' });
    panels.push({ idx: capIdx.map((i) => (NZ - 1) * n + i), tag: 'glass' });
  }

  const zW = 0.82,
    segs = 10;
  const wheel = (cxw: number) => {
    const r = 0.33,
      cyw = 0.23,
      base = verts.length;
    for (let k = 0; k < segs; k++) {
      const a = (k / segs) * Math.PI * 2;
      wheelPoints.push({
        vertIndex: verts.length,
        cx: cxw,
        cy: cyw,
        r,
        baseAngle: a,
        z: zW,
      });
      verts.push(P(cxw + r * Math.cos(a), cyw + r * Math.sin(a), zW));
    }
    for (let k = 0; k < segs; k++) {
      const a = (k / segs) * Math.PI * 2;
      wheelPoints.push({
        vertIndex: verts.length,
        cx: cxw,
        cy: cyw,
        r,
        baseAngle: a,
        z: -zW,
      });
      verts.push(P(cxw + r * Math.cos(a), cyw + r * Math.sin(a), -zW));
    }
    const hubO = verts.length;
    verts.push(P(cxw, cyw, zW));
    hubIndices.push(hubO);
    const hubI = verts.length;
    verts.push(P(cxw, cyw, -zW));
    hubIndices.push(hubI);
    for (let k = 0; k < segs; k++) {
      edges.push([base + k, base + ((k + 1) % segs), 'wheel']);
      edges.push([base + segs + k, base + segs + ((k + 1) % segs), 'wheel']);
      edges.push([base + k, base + segs + k, 'wheel']);
      if (k % 2 === 0) {
        edges.push([hubO, base + k, 'spoke']);
        edges.push([hubI, base + segs + k, 'spoke']);
      }
    }
  };
  wheel(-1.25);
  wheel(1.2);

  const tx0 = 0.05,
    tx1 = 0.5,
    ty0 = 1.02,
    ty1 = 1.2,
    tz = 0.2,
    tb = verts.length;
  const taxiBox: Vec3[] = [
    [tx0, ty0, tz],
    [tx1, ty0, tz],
    [tx1, ty1, tz],
    [tx0, ty1, tz],
    [tx0, ty0, -tz],
    [tx1, ty0, -tz],
    [tx1, ty1, -tz],
    [tx0, ty1, -tz],
  ];
  taxiBox.forEach((b) => verts.push(P(b[0], b[1], b[2])));
  const taxiEdgeIdx: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
  taxiEdgeIdx.forEach((e) => edges.push([tb + e[0], tb + e[1], 'taxi']));
  const taxiPanels: number[][] = [
    [tb + 3, tb + 2, tb + 6, tb + 7],
    [tb + 0, tb + 1, tb + 2, tb + 3],
  ];

  const lightDots: [number, string][] = [];
  const addLight = (x: number, y: number, z: number, kind: string) => {
    lightDots.push([verts.length, kind]);
    verts.push(P(x, y, z));
  };
  addLight(-2.0, 0.5, 0.6, 'head');
  addLight(-2.0, 0.5, -0.6, 'head');
  addLight(2.0, 0.52, 0.62, 'tail');
  addLight(2.0, 0.52, -0.62, 'tail');

  return {
    verts,
    edges,
    panels,
    taxiPanels,
    wheelPoints,
    hubIndices,
    car: true,
    lightDots,
  };
}

function makeShape(type: ShapeName, nz: number): ShapeData {
  const p = 1.618;
  const glassSegments = new Set([3, 5]);
  if (type === 'sedan') {
    return buildCar(
      [
        [-2.0, 0.28],
        [-2.0, 0.5],
        [-1.3, 0.62],
        [-0.55, 0.66],
        [-0.15, 1.0],
        [0.75, 1.0],
        [1.15, 0.66],
        [2.0, 0.56],
        [2.0, 0.3],
      ],
      nz,
      glassSegments,
    );
  }
  if (type === 'estate') {
    return buildCar(
      [
        [-2.0, 0.28],
        [-2.0, 0.5],
        [-1.3, 0.62],
        [-0.55, 0.66],
        [-0.15, 1.0],
        [1.35, 1.0],
        [1.75, 0.92],
        [2.0, 0.82],
        [2.0, 0.3],
      ],
      nz,
      glassSegments,
    );
  }
  let v: Vec3[];
  if (type === 'cube') {
    v = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];
  } else if (type === 'octa') {
    v = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];
  } else if (type === 'tetra') {
    v = [
      [1, 1, 1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
    ];
  } else {
    v = [
      [0, 1, p],
      [0, 1, -p],
      [0, -1, p],
      [0, -1, -p],
      [1, p, 0],
      [1, -p, 0],
      [-1, p, 0],
      [-1, -p, 0],
      [p, 0, 1],
      [p, 0, -1],
      [-p, 0, 1],
      [-p, 0, -1],
    ];
  }
  return {
    verts: v,
    edges: buildEdges(v),
    panels: [],
    taxiPanels: [],
    wheelPoints: [],
    hubIndices: [],
    car: false,
  };
}

const DEFAULT_AX = -0.16;
const DEFAULT_AY = 0.62;
const PITCH_MIN = -0.6;
const PITCH_MAX = 0.5;
const ROTATE_SPEED_YAW = 0.01;
const ROTATE_SPEED_PITCH = 0.008;
const DAMPING = 0.94;
const STOP_EPS = 0.0002;
const HINT_DURATION_MS = 2500;
const WHEEL_SPIN_STEP = 0.22;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export default function WireframeCanvas({
  shape,
  tone = 'gold',
  interactive = true,
  showHint = false,
  style,
  className,
}: WireframeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const shapeData = makeShape(shape, 7);
    const effectiveVerts: Vec3[] = shapeData.verts.slice();
    let ax = DEFAULT_AX;
    let ay = DEFAULT_AY;
    const angVel = { vx: 0, vy: 0 };
    let dragging = false;
    let activePointerId: number | null = null;
    let lastPointer: { x: number; y: number } | null = null;
    let dpr = 1;
    let rafId: number | null = null;
    let hintStart: number | null =
      interactive && showHint ? performance.now() : null;
    let spinAngle = 0;
    let spinActive = false;
    let hoverIO: IntersectionObserver | null = null;

    const updateSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, r.width * dpr);
      canvas.height = Math.max(1, r.height * dpr);
    };

    const ensureLoopRunning = () => {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    const renderFrame = (hintAlpha: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const w of shapeData.wheelPoints) {
        const a = w.baseAngle + spinAngle;
        effectiveVerts[w.vertIndex] = carPoint(
          w.cx + w.r * Math.cos(a),
          w.cy + w.r * Math.sin(a),
          w.z,
        );
      }

      const ca = Math.cos(ax),
        sa = Math.sin(ax);
      const cb = Math.cos(ay),
        sb = Math.sin(ay);
      const R = Math.min(W, H) * (shapeData.car ? 0.4 : 0.34);
      const cx = W / 2,
        cy = H / 2,
        fov = 5;

      const pts = effectiveVerts.map(([x, y, z]) => {
        const y1 = y * ca - z * sa;
        const z1 = y * sa + z * ca;
        const x1 = x * cb + z1 * sb;
        const z2 = -x * sb + z1 * cb;
        const sc = fov / (fov + z2);
        return { x: cx + x1 * R * sc, y: cy + y1 * R * sc, z2 };
      });

      let minZ = Infinity,
        maxZ = -Infinity;
      for (const p of pts) {
        if (p.z2 < minZ) minZ = p.z2;
        if (p.z2 > maxZ) maxZ = p.z2;
      }
      const zRange = Math.max(1e-6, maxZ - minZ);
      const depthT = (z2: number) => (z2 - minZ) / zRange;

      if (shapeData.car) {
        const isBlackTone = tone === 'black';
        const bodyCol = isBlackTone ? '102,104,110' : '234,234,234';
        const TIRE_RGB = '58,58,58';
        const SPOKE_RGB = '210,210,212';
        const GLASS_RGB = '34,46,60';
        const TAXI_FILL_RGB = '242,194,76';

        const pitchFactor = 0.55 + 0.45 * Math.cos(ax);
        const shadowRx = R * 0.95;
        const shadowRy = R * 0.22 * pitchFactor;
        const shadowCx = cx + Math.sin(ay) * R * 0.08;
        const shadowCy = cy + R * 0.62;
        const shadowGrad = ctx.createRadialGradient(
          shadowCx,
          shadowCy,
          0,
          shadowCx,
          shadowCy,
          shadowRx,
        );
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.45)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.translate(shadowCx, shadowCy);
        ctx.scale(1, shadowRy / shadowRx);
        ctx.translate(-shadowCx, -shadowCy);
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(shadowCx, shadowCy, shadowRx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
        if (isBlackTone) {
          fillGrad.addColorStop(0, 'rgba(80,80,84,0.30)');
          fillGrad.addColorStop(1, 'rgba(22,22,24,0.40)');
        } else {
          fillGrad.addColorStop(0, 'rgba(255,255,255,0.20)');
          fillGrad.addColorStop(1, 'rgba(255,255,255,0.04)');
        }
        const sortedPanels = shapeData.panels
          .map((p) => ({
            p,
            depth: p.idx.reduce((s, k) => s + pts[k].z2, 0) / p.idx.length,
          }))
          .sort((a, b) => b.depth - a.depth);
        for (const { p, depth } of sortedPanels) {
          const t = depthT(depth);
          if (p.tag === 'glass') {
            ctx.globalAlpha = lerp(0.7, 0.4, t);
            ctx.fillStyle = `rgba(${GLASS_RGB},1)`;
          } else {
            ctx.globalAlpha = lerp(0.3, 0.1, t);
            ctx.fillStyle = fillGrad;
          }
          ctx.beginPath();
          ctx.moveTo(pts[p.idx[0]].x, pts[p.idx[0]].y);
          for (let k = 1; k < p.idx.length; k++)
            ctx.lineTo(pts[p.idx[k]].x, pts[p.idx[k]].y);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        for (const face of shapeData.taxiPanels) {
          ctx.globalAlpha = 0.78;
          ctx.fillStyle = `rgba(${TAXI_FILL_RGB},1)`;
          ctx.beginPath();
          ctx.moveTo(pts[face[0]].x, pts[face[0]].y);
          for (let k = 1; k < face.length; k++)
            ctx.lineTo(pts[face[k]].x, pts[face[k]].y);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        const drawEdgeGroupShaded = (
          tag: EdgeTag,
          rgb: string,
          lw: number,
          baseAlpha: number,
          minAlpha: number,
        ) => {
          const BINS = 5;
          const bins: Edge[][] = Array.from({ length: BINS }, () => []);
          for (const e of shapeData.edges) {
            if (e[2] !== tag) continue;
            const t = depthT((pts[e[0]].z2 + pts[e[1]].z2) / 2);
            bins[clamp(Math.floor(t * BINS), 0, BINS - 1)].push(e);
          }
          bins.forEach((bin, i) => {
            if (!bin.length) return;
            ctx.globalAlpha = lerp(baseAlpha, minAlpha, i / (BINS - 1));
            ctx.lineWidth = lw;
            ctx.strokeStyle = `rgba(${rgb},1)`;
            ctx.beginPath();
            for (const e of bin) {
              ctx.moveTo(pts[e[0]].x, pts[e[0]].y);
              ctx.lineTo(pts[e[1]].x, pts[e[1]].y);
            }
            ctx.stroke();
          });
          ctx.globalAlpha = 1;
        };

        drawEdgeGroupShaded('wheel', TIRE_RGB, dpr * 1.5, 0.95, 0.55);
        drawEdgeGroupShaded('spoke', SPOKE_RGB, dpr * 0.9, 0.7, 0.25);
        drawEdgeGroupShaded(
          'body',
          bodyCol,
          dpr,
          isBlackTone ? 0.78 : 0.9,
          isBlackTone ? 0.28 : 0.35,
        );
        drawEdgeGroupShaded('taxi', TAXI_FILL_RGB, dpr * 1.4, 0.96, 0.5);

        if (shapeData.hubIndices.length) {
          ctx.fillStyle = 'rgba(225,225,225,0.9)';
          for (const idx of shapeData.hubIndices) {
            ctx.beginPath();
            ctx.arc(pts[idx].x, pts[idx].y, dpr * 1.6, 0, 7);
            ctx.fill();
          }
        }

        for (const [idx, kind] of shapeData.lightDots ?? []) {
          ctx.save();
          ctx.fillStyle = kind === 'head' ? '#FFFFFF' : '#FF4242';
          ctx.shadowColor =
            kind === 'head' ? 'rgba(255,255,255,0.95)' : 'rgba(255,66,66,0.95)';
          ctx.shadowBlur = dpr * 6;
          ctx.beginPath();
          ctx.arc(pts[idx].x, pts[idx].y, dpr * 2.1, 0, 7);
          ctx.fill();
          ctx.restore();
        }
      } else {
        ctx.lineWidth = dpr;
        ctx.strokeStyle = 'rgba(230,176,50,0.7)';
        ctx.beginPath();
        for (const e of shapeData.edges) {
          ctx.moveTo(pts[e[0]].x, pts[e[0]].y);
          ctx.lineTo(pts[e[1]].x, pts[e[1]].y);
        }
        ctx.stroke();
        ctx.fillStyle = 'rgba(246,212,112,0.9)';
        for (const pt of pts) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dpr * 1.3, 0, 7);
          ctx.fill();
        }
      }

      if (hintAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = hintAlpha;
        const size = Math.max(14, Math.min(W, H) * 0.16);
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = dpr * 3;
        ctx.fillText('⟲', W - 8 * dpr, 8 * dpr);
        ctx.restore();
      }
    };

    const tick = (now: number) => {
      let needsAnotherFrame = false;

      if (dragging) {
        needsAnotherFrame = true;
      } else {
        angVel.vx *= DAMPING;
        angVel.vy *= DAMPING;
        ay += angVel.vx;
        ax = clamp(ax + angVel.vy, PITCH_MIN, PITCH_MAX);
        if (Math.abs(angVel.vx) > STOP_EPS || Math.abs(angVel.vy) > STOP_EPS) {
          needsAnotherFrame = true;
        } else {
          angVel.vx = 0;
          angVel.vy = 0;
        }
      }

      if (spinActive) {
        spinAngle += WHEEL_SPIN_STEP;
        needsAnotherFrame = true;
      }

      let hintAlpha = 0;
      if (hintStart != null) {
        const elapsed = now - hintStart;
        if (elapsed < HINT_DURATION_MS) {
          hintAlpha = 1 - elapsed / HINT_DURATION_MS;
          needsAnotherFrame = true;
        } else {
          hintStart = null;
        }
      }

      renderFrame(hintAlpha);
      rafId = needsAnotherFrame ? requestAnimationFrame(tick) : null;
    };

    updateSize();
    renderFrame(hintStart != null ? 1 : 0);
    if (hintStart != null) ensureLoopRunning();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      renderFrame(0);
    });
    resizeObserver.observe(canvas);

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== activePointerId) return;
      dragging = false;
      activePointerId = null;
      lastPointer = null;
      canvas.style.cursor = 'grab';
      ensureLoopRunning();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      canvas.setPointerCapture(e.pointerId);
      activePointerId = e.pointerId;
      dragging = true;
      lastPointer = { x: e.clientX, y: e.clientY };
      angVel.vx = 0;
      angVel.vy = 0;
      canvas.style.cursor = 'grabbing';
      ensureLoopRunning();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointerId || !lastPointer) return;
      const dx = e.clientX - lastPointer.x;
      const dy = e.clientY - lastPointer.y;
      lastPointer = { x: e.clientX, y: e.clientY };

      const dYaw = dx * ROTATE_SPEED_YAW;
      const dPitch = -dy * ROTATE_SPEED_PITCH;

      ay += dYaw;
      ax = clamp(ax + dPitch, PITCH_MIN, PITCH_MAX);

      angVel.vx = lerp(angVel.vx, dYaw, 0.5);
      angVel.vy = lerp(angVel.vy, dPitch, 0.5);
    };

    const onWheelHoverEnter = () => {
      if (!spinActive) {
        spinActive = true;
        ensureLoopRunning();
      }
    };
    const onWheelHoverLeave = () => {
      spinActive = false;
    };

    if (interactive) {
      canvas.style.cursor = 'grab';
      canvas.style.touchAction = 'none';
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', endDrag);
      canvas.addEventListener('pointercancel', endDrag);

      if (shapeData.car) {
        const hoverCapable = window.matchMedia(
          '(hover: hover) and (pointer: fine)',
        ).matches;
        if (hoverCapable) {
          canvas.addEventListener('mouseenter', onWheelHoverEnter);
          canvas.addEventListener('mouseleave', onWheelHoverLeave);
        } else {
          hoverIO = new IntersectionObserver(
            (entries) => {
              const visible = entries[0]?.isIntersecting ?? false;
              if (visible) {
                if (!spinActive) {
                  spinActive = true;
                  ensureLoopRunning();
                }
              } else {
                spinActive = false;
              }
            },
            { threshold: 0.1 },
          );
          hoverIO.observe(canvas);
        }
      }
    }

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', endDrag);
        canvas.removeEventListener('pointercancel', endDrag);
        canvas.removeEventListener('mouseenter', onWheelHoverEnter);
        canvas.removeEventListener('mouseleave', onWheelHoverLeave);
        hoverIO?.disconnect();
      }
    };
  }, [shape, tone, interactive, showHint]);

  return <canvas ref={canvasRef} style={style} className={className} />;
}
