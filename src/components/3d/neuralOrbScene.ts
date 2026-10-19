// Imperative Three.js scene for the neural orb. Loaded with a dynamic import so
// three.js lands in its own chunk and never blocks the first paint. Named imports
// keep the bundle tree-shaken (a full `import * as THREE` pulls in everything).
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Timer,
  Vector3,
  WebGLRenderer,
} from 'three';

export type OrbDetail = 'full' | 'lite';

export interface NeuralOrbOptions {
  detail: OrbDetail;
  reducedMotion: boolean;
  /** Follow the pointer with a gentle tilt (desktop only). */
  interactive: boolean;
}

export interface NeuralOrbController {
  setActive(active: boolean): void;
  dispose(): void;
}

const PALETTE = {
  blue: new Color('#3B82F6'),
  bright: new Color('#60A5FA'),
  cyan: new Color('#22D3EE'),
  ice: new Color('#D7E2EA'),
};

const SETTINGS: Record<OrbDetail, { nodes: number; particles: number; pulses: number; links: number; maxDpr: number }> = {
  full: { nodes: 56, particles: 180, pulses: 10, links: 3, maxDpr: 1.5 },
  lite: { nodes: 28, particles: 70, pulses: 5, links: 2, maxDpr: 1.25 },
};

/** Soft radial dot used for nodes, particles and the core glow. */
function createGlowTexture(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.65)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Evenly spread points on a sphere with a little organic jitter. */
function fibonacciSphere(count: number, radius: number): Vector3[] {
  const points: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = radius * (0.88 + Math.random() * 0.24);
    points.push(new Vector3(Math.cos(theta) * r * jitter, y * jitter, Math.sin(theta) * r * jitter));
  }
  return points;
}

/** Connect every node to its nearest neighbours (deduplicated). */
function nearestEdges(nodes: Vector3[], links: number): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, d: node.distanceToSquared(other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, links)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      });
  });
  return edges;
}

export function createNeuralOrb(container: HTMLElement, options: NeuralOrbOptions): NeuralOrbController {
  const settings = SETTINGS[options.detail];

  const renderer = new WebGLRenderer({
    antialias: options.detail === 'full',
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, settings.maxDpr));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 6.2);

  const root = new Group();
  const network = new Group();
  root.add(network);
  scene.add(root);

  const glow = createGlowTexture();
  const disposables: { dispose(): void }[] = [glow];
  const track = <T extends { dispose(): void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  // Luminous core: a dark-blue sphere, a faint wire shell and a soft halo.
  const coreGeo = track(new SphereGeometry(0.62, options.detail === 'full' ? 40 : 24, options.detail === 'full' ? 28 : 16));
  const coreMat = track(new MeshBasicMaterial({ color: new Color('#0B1F3A'), transparent: true, opacity: 0.95 }));
  network.add(new Mesh(coreGeo, coreMat));

  const shellGeo = track(new SphereGeometry(0.66, 18, 12));
  const shellMat = track(
    new MeshBasicMaterial({ color: PALETTE.bright, wireframe: true, transparent: true, opacity: 0.12, blending: AdditiveBlending }),
  );
  const shell = new Mesh(shellGeo, shellMat);
  network.add(shell);

  const haloMat = track(
    new SpriteMaterial({ map: glow, color: PALETTE.blue, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false }),
  );
  const halo = new Sprite(haloMat);
  halo.scale.setScalar(3.1);
  network.add(halo);

  const innerHaloMat = track(
    new SpriteMaterial({ map: glow, color: PALETTE.cyan, transparent: true, opacity: 0.45, blending: AdditiveBlending, depthWrite: false }),
  );
  const innerHalo = new Sprite(innerHaloMat);
  innerHalo.scale.setScalar(1.4);
  network.add(innerHalo);

  // Neural nodes on an outer shell.
  const nodes = fibonacciSphere(settings.nodes, 1.75);
  const nodeGeo = track(new BufferGeometry().setFromPoints(nodes));
  const nodeMat = track(
    new PointsMaterial({
      map: glow,
      color: PALETTE.bright,
      size: options.detail === 'full' ? 0.16 : 0.2,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  network.add(new Points(nodeGeo, nodeMat));

  // Fine connecting lines between neighbouring nodes, plus a few spokes to the core.
  const edges = nearestEdges(nodes, settings.links);
  const linePositions: number[] = [];
  for (const [a, b] of edges) {
    linePositions.push(nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z);
  }
  for (let i = 0; i < nodes.length; i += 5) {
    const inner = nodes[i].clone().setLength(0.7);
    linePositions.push(inner.x, inner.y, inner.z, nodes[i].x, nodes[i].y, nodes[i].z);
  }
  const lineGeo = track(new BufferGeometry());
  lineGeo.setAttribute('position', new Float32BufferAttribute(linePositions, 3));
  const lineMat = track(
    new LineBasicMaterial({ color: PALETTE.blue, transparent: true, opacity: 0.28, blending: AdditiveBlending, depthWrite: false }),
  );
  network.add(new LineSegments(lineGeo, lineMat));

  // Signals travelling along the edges.
  const pulseState = Array.from({ length: settings.pulses }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.35 + Math.random() * 0.5,
  }));
  const pulsePositions = new Float32Array(settings.pulses * 3);
  const pulseGeo = track(new BufferGeometry());
  pulseGeo.setAttribute('position', new Float32BufferAttribute(pulsePositions, 3));
  const pulseMat = track(
    new PointsMaterial({ map: glow, color: PALETTE.cyan, size: 0.22, transparent: true, depthWrite: false, blending: AdditiveBlending }),
  );
  network.add(new Points(pulseGeo, pulseMat));

  const scratch = new Vector3();
  const updatePulses = (delta: number) => {
    pulseState.forEach((pulse, i) => {
      pulse.t += delta * pulse.speed;
      if (pulse.t >= 1) {
        pulse.t = 0;
        pulse.edge = Math.floor(Math.random() * edges.length);
      }
      const [a, b] = edges[pulse.edge];
      scratch.lerpVectors(nodes[a], nodes[b], pulse.t);
      pulsePositions[i * 3] = scratch.x;
      pulsePositions[i * 3 + 1] = scratch.y;
      pulsePositions[i * 3 + 2] = scratch.z;
    });
    pulseGeo.attributes.position.needsUpdate = true;
  };
  updatePulses(0);

  // Floating dust in a wider shell, rotating independently.
  const dust = new Float32Array(settings.particles * 3);
  for (let i = 0; i < settings.particles; i++) {
    const r = 2.1 + Math.random() * 1.1;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    dust[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dust[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dust[i * 3 + 2] = r * Math.cos(phi);
  }
  const dustGeo = track(new BufferGeometry());
  dustGeo.setAttribute('position', new Float32BufferAttribute(dust, 3));
  const dustMat = track(
    new PointsMaterial({ map: glow, color: PALETTE.ice, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending }),
  );
  const dustPoints = new Points(dustGeo, dustMat);
  root.add(dustPoints);

  network.rotation.set(0.35, 0.4, 0);

  // Sizing ------------------------------------------------------------------
  const resize = () => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (!running) renderer.render(scene, camera);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  // Pointer tilt --------------------------------------------------------------
  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (options.interactive && !options.reducedMotion) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  // Loop ----------------------------------------------------------------------
  const timer = new Timer();
  let frame = 0;
  let running = false;
  let active = false;

  const tick = (time: number) => {
    frame = requestAnimationFrame(tick);
    timer.update(time);
    const delta = Math.min(timer.getDelta(), 0.05);
    const elapsed = timer.getElapsed();

    network.rotation.y += delta * 0.18;
    shell.rotation.y -= delta * 0.25;
    dustPoints.rotation.y -= delta * 0.04;
    dustPoints.rotation.x += delta * 0.015;
    root.position.y = Math.sin(elapsed * 0.8) * 0.08;
    const breathe = 1 + Math.sin(elapsed * 1.6) * 0.04;
    halo.scale.setScalar(3.1 * breathe);
    updatePulses(delta);

    root.rotation.x += (pointer.y * 0.25 - root.rotation.x) * 0.04;
    root.rotation.y += (pointer.x * 0.35 - root.rotation.y) * 0.04;

    renderer.render(scene, camera);
  };

  const start = () => {
    if (running || options.reducedMotion) return;
    running = true;
    timer.reset();
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (active) start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  resize();
  renderer.render(scene, camera);

  return {
    setActive(next) {
      active = next;
      if (next && !document.hidden) start();
      else stop();
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
