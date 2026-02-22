/**
 * heroGraph3D.client.js
 *
 * A lightweight, premium Three.js “knowledge graph” hero.
 *
 * Goals:
 * - Look impressive (good lighting + depth + motion)
 * - Be safe in docs sites (performance + deterministic sizing)
 * - Avoid ResizeObserver feedback loops
 *
 * Key rule:
 * - Never compute render height from an element whose height is affected by the canvas
 *   intrinsic size. We use the fixed CSS height from the frame instead.
 */

import * as THREE from "three";

/**
 * Mounts the hero graph on a given root element.
 * Safe to call multiple times (guards against double-mount).
 */
export function mountHeroGraph3D(root) {
  if (!root) return;

  const frame = root.querySelector("[data-hero3d-frame]");
  const canvas = root.querySelector("[data-hero3d-canvas]");
  if (!frame || !canvas) return;

  // Guard to avoid double-mount (HMR / re-renders / navigation).
  if (canvas.dataset.mounted === "1") return;
  canvas.dataset.mounted = "1";

  // Prefer reduced motion accessibility.
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  // Scene & camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.2, 6.2);

  // Lights (soft & premium)
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(3, 4, 6);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.55);
  fill.position.set(-4, -2, 6);
  scene.add(fill);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  // Accent color from CSS
  const css = getComputedStyle(root);
  const accentCss = (css.getPropertyValue("--accent") || "currentColor").trim();
  const accentColor = new THREE.Color(
    accentCss === "currentColor" ? css.color : accentCss
  );

  // Group root
  const g = new THREE.Group();
  scene.add(g);

  // Background subtle starfield
  const starsGeo = new THREE.BufferGeometry();
  const starCount = 900;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 10 * Math.random();
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
  }
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starsMat = new THREE.PointsMaterial({
    size: 0.015,
    color: new THREE.Color(1, 1, 1),
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);

  // Graph data
  const nodes = [
    { id: "Docs", r: 0.18 },
    { id: "Projects", r: 0.16 },
    { id: "Standards", r: 0.15 },
    { id: "Playbooks", r: 0.14 },
    { id: "ADR", r: 0.12 },
    { id: "CI/CD", r: 0.12 },
    { id: "Testing", r: 0.12 },
    { id: "Patterns", r: 0.12 },
    { id: "Tooling", r: 0.12 },
  ];

  const positions = [
    new THREE.Vector3(0.0, 0.0, 0.0),
    new THREE.Vector3(1.6, 0.4, -0.2),
    new THREE.Vector3(-1.4, 0.5, 0.2),
    new THREE.Vector3(0.2, 1.35, 0.25),
    new THREE.Vector3(-0.2, -1.2, 0.35),
    new THREE.Vector3(1.1, -0.9, -0.1),
    new THREE.Vector3(-1.05, -0.75, -0.15),
    new THREE.Vector3(-0.1, 1.0, -0.85),
    new THREE.Vector3(0.6, -0.1, -1.15),
  ];

  const edges = [
    ["Docs", "Projects"],
    ["Docs", "Standards"],
    ["Docs", "Playbooks"],
    ["Standards", "Testing"],
    ["Standards", "Patterns"],
    ["Projects", "ADR"],
    ["Projects", "CI/CD"],
    ["Playbooks", "Tooling"],
    ["Playbooks", "Testing"],
    ["Patterns", "Tooling"],
  ];

  // Materials
  const coreMat = new THREE.MeshStandardMaterial({
    color: accentColor.clone(),
    roughness: 0.35,
    metalness: 0.15,
    emissive: accentColor.clone().multiplyScalar(0.15),
  });

  const nodeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    roughness: 0.45,
    metalness: 0.05,
    emissive: accentColor.clone().multiplyScalar(0.08),
  });

  const nodeHoverMat = new THREE.MeshStandardMaterial({
    color: accentColor.clone(),
    roughness: 0.25,
    metalness: 0.2,
    emissive: accentColor.clone().multiplyScalar(0.22),
  });

  const lineMat = new THREE.LineBasicMaterial({
    color: accentColor.clone(),
    transparent: true,
    opacity: 0.38,
  });

  // Core sphere
  const sphere = new THREE.SphereGeometry(1, 48, 48);
  const core = new THREE.Mesh(sphere, coreMat);
  core.scale.setScalar(0.42);
  g.add(core);

  // Nodes
  const nodeMeshes = new Map();
  const nodeGeo = new THREE.SphereGeometry(1, 28, 28);

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const m = new THREE.Mesh(nodeGeo, nodeMat.clone());
    m.scale.setScalar(n.r);
    m.position.copy(positions[i]);
    m.userData = { id: n.id, baseScale: n.r };
    g.add(m);
    nodeMeshes.set(n.id, m);
  }

  // Edges
  const lines = new THREE.Group();
  g.add(lines);

  for (const [a, b] of edges) {
    const A = nodeMeshes.get(a)?.position;
    const B = nodeMeshes.get(b)?.position;
    if (!A || !B) continue;

    const geo = new THREE.BufferGeometry().setFromPoints([A, B]);
    const line = new THREE.Line(geo, lineMat);
    lines.add(line);
  }

  // Interaction
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let rotX = 0.15;
  let rotY = -0.35;

  let targetZoom = 6.2;
  let currentZoom = 6.2;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  function setHovered(next) {
    if (hovered === next) return;

    if (hovered) {
      hovered.material = nodeMat;
      hovered.scale.setScalar(hovered.userData.baseScale);
    }

    hovered = next;

    if (hovered) {
      hovered.material = nodeHoverMat;
      hovered.scale.setScalar(hovered.userData.baseScale * 1.22);
    }
  }

  function onPointerDown(e) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    frame.style.cursor = "grabbing";
  }

  function onPointerUp() {
    isDragging = false;
    frame.style.cursor = "grab";
  }

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (isDragging && !prefersReducedMotion) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      rotY += dx * 0.005;
      rotX += dy * 0.005;
      rotX = Math.max(-0.95, Math.min(0.95, rotX));
    }
  }

  function onWheel(e) {
    const delta = Math.sign(e.deltaY);
    targetZoom = Math.max(4.3, Math.min(9.0, targetZoom + delta * 0.35));
  }

  function onClick() {
    if (!hovered) return;
    const s = hovered.userData.baseScale;
    hovered.scale.setScalar(s * 1.35);
    setTimeout(() => hovered && hovered.scale.setScalar(s * 1.22), 120);
  }

  frame.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  frame.addEventListener("pointermove", onPointerMove, { passive: true });
  frame.addEventListener("wheel", onWheel, { passive: true });
  frame.addEventListener("click", onClick, { passive: true });

  // --- Resize (NO FEEDBACK LOOP) --------------------------------------------
  // Width is responsive; height is fixed by CSS (height: var(--h)).
  // We read the *computed* height, not a height influenced by canvas intrinsic sizing.
  function getFixedHeightPx() {
    // frame is height: var(--h). computedStyle.height returns px.
    const h = parseFloat(getComputedStyle(frame).height || "0");
    return Number.isFinite(h) && h > 0 ? h : 360;
  }

  function resize() {
    const w = Math.max(320, frame.clientWidth);
    const h = Math.max(220, getFixedHeightPx());

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);

    // IMPORTANT: this sets the canvas drawing buffer size.
    // It must NOT cause layout changes (CSS controls layout size).
    renderer.setSize(w, h, false);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // Observe width changes only (height is fixed anyway).
  const ro = new ResizeObserver(() => {
    // throttle to next frame to avoid RO micro-loops
    requestAnimationFrame(resize);
  });
  ro.observe(frame);
  resize();

  // --- Animation ------------------------------------------------------------
  let raf = 0;
  let alive = true;

  function tick(t) {
    if (!alive) return;

    if (!prefersReducedMotion && !isDragging) {
      rotY += 0.00055;
      rotX += 0.00025;
      rotX = Math.max(-0.55, Math.min(0.55, rotX));
    }

    g.rotation.x = rotX;
    g.rotation.y = rotY;

    currentZoom += (targetZoom - currentZoom) * 0.08;
    camera.position.z = currentZoom;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(Array.from(nodeMeshes.values()), false);
    setHovered(hits[0]?.object ?? null);

    const pulse = prefersReducedMotion ? 0 : Math.sin(t * 0.0012) * 0.015;
    core.scale.setScalar(0.42 + pulse);

    stars.rotation.y = rotY * 0.12;
    stars.rotation.x = rotX * 0.12;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function onVisibility() {
    const hidden = document.visibilityState === "hidden";
    if (hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(tick);
  }

  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(tick);

  // Cleanup (dev HMR / navigation / unload)
  function destroy() {
    alive = false;
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    ro.disconnect();

    frame.removeEventListener("pointerdown", onPointerDown);
    frame.removeEventListener("pointermove", onPointerMove);
    frame.removeEventListener("wheel", onWheel);
    frame.removeEventListener("click", onClick);
    window.removeEventListener("pointerup", onPointerUp);

    renderer.dispose();
    starsGeo.dispose();
    starsMat.dispose();
    nodeGeo.dispose();
    sphere.dispose();
    coreMat.dispose();
    lineMat.dispose();
  }

  window.addEventListener("beforeunload", destroy, { once: true });

  // Optional: expose a debug hook in dev (no-op in prod usage).
  // root.__hero3dDestroy = destroy;
}