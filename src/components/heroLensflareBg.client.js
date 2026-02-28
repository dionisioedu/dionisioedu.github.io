import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

function isHomePath(pathname) {
  return (
    pathname === "/" ||
    pathname === "/pt" ||
    pathname === "/pt/" ||
    pathname === "/en" ||
    pathname === "/en/"
  );
}

function resolveHeroContainer() {
  if (!isHomePath(window.location.pathname)) return null;

  const explicitHero = document.querySelector(".sl-hero, [class*='sl-hero'], [class*='hero' i]");
  if (explicitHero instanceof HTMLElement) return explicitHero;

  const title = document.querySelector("main h1, article h1, h1");
  if (title instanceof HTMLElement) {
    return (
      title.closest("section") ||
      title.closest("header") ||
      title.parentElement
    );
  }

  return null;
}

function createFlareTexture(size = 256, hue = 210) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const center = size / 2;
  const gradient = ctx.createRadialGradient(center, center, 2, center, center, center);
  gradient.addColorStop(0.0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.18, `hsla(${hue}, 100%, 78%, 0.95)`);
  gradient.addColorStop(0.4, `hsla(${hue}, 100%, 70%, 0.42)`);
  gradient.addColorStop(1.0, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function resolveTheme() {
  const html = document.documentElement;
  const attr = html.getAttribute("data-theme") || "";
  const cls = html.className || "";

  if (attr.toLowerCase().includes("light")) return "light";
  if (attr.toLowerCase().includes("dark")) return "dark";
  if (cls.toLowerCase().includes("light")) return "light";
  if (cls.toLowerCase().includes("dark")) return "dark";

  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";
}

function shouldUseLowPowerMode() {
  const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const mobileViewport = window.matchMedia?.("(max-width: 900px)")?.matches ?? false;
  const lowMemory = (navigator.deviceMemory || 8) <= 4;
  const lowCpu = (navigator.hardwareConcurrency || 8) <= 4;

  return reducedMotion || mobileViewport || lowMemory || lowCpu;
}

export function mountHeroLensflareBackground() {
  if (typeof window === "undefined") return () => {};

  const host = resolveHeroContainer();
  if (!host) return () => {};

  host.classList.add("hero-lensflare-host");
  host.dataset.lensTheme = resolveTheme();

  host.querySelector(":scope > .hero-lensflare-bg")?.remove();

  const layer = document.createElement("div");
  layer.className = "hero-lensflare-bg";
  const canvas = document.createElement("canvas");
  canvas.className = "hero-lensflare-canvas";
  layer.appendChild(canvas);
  host.prepend(layer);

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const lowPower = shouldUseLowPowerMode();

  let renderer = null;
  let scene = null;
  let camera = null;
  let dust = null;
  let lightLeft = null;
  let lightRight = null;
  let textureA = null;
  let textureB = null;

  function buildRenderer() {
    const theme = resolveTheme();
    host.dataset.lensTheme = theme;
    const localeIntensity = window.location.pathname.startsWith("/pt") ? 0.88 : 1;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !lowPower,
      powerPreference: lowPower ? "low-power" : "high-performance",
    });

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 0, 12);

    const isLight = theme === "light";
    const intensityScale = (isLight ? 0.72 : 1.0) * localeIntensity;

    textureA = createFlareTexture(256, isLight ? 205 : 210);
    textureB = createFlareTexture(256, isLight ? 190 : 185);

    lightLeft = new THREE.PointLight(0x8fd3ff, 1.15 * intensityScale, 60, 2);
    lightLeft.position.set(-4.5, 1.4, -2.5);
    const flareLeft = new Lensflare();
    flareLeft.addElement(new LensflareElement(textureA, isLight ? 220 : 280, 0.0, new THREE.Color(0xffffff)));
    flareLeft.addElement(new LensflareElement(textureB, isLight ? 84 : 110, 0.28, new THREE.Color(0x9dd8ff)));
    flareLeft.addElement(new LensflareElement(textureA, isLight ? 56 : 72, 0.45, new THREE.Color(0xb8e6ff)));
    lightLeft.add(flareLeft);
    scene.add(lightLeft);

    lightRight = new THREE.PointLight(0x77b8ff, 0.95 * intensityScale, 60, 2);
    lightRight.position.set(5.2, -1.2, -2.0);
    const flareRight = new Lensflare();
    flareRight.addElement(new LensflareElement(textureB, isLight ? 190 : 240, 0.0, new THREE.Color(0xc8f2ff)));
    flareRight.addElement(new LensflareElement(textureA, isLight ? 72 : 96, 0.22, new THREE.Color(0x9fd2ff)));
    flareRight.addElement(new LensflareElement(textureB, isLight ? 46 : 62, 0.5, new THREE.Color(0xffffff)));
    lightRight.add(flareRight);
    scene.add(lightRight);

    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = lowPower ? 48 : 140;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        size: lowPower ? 0.032 : 0.045,
        transparent: true,
        opacity: (isLight ? 0.22 : 0.32) * localeIntensity,
        color: 0xe6f4ff,
        depthWrite: false,
      })
    );
    scene.add(dust);
  }

  function disposeRenderer() {
    if (!renderer) return;

    if (textureA) textureA.dispose();
    if (textureB) textureB.dispose();
    if (dust) {
      dust.geometry.dispose();
      dust.material.dispose();
    }

    renderer.dispose();

    renderer = null;
    scene = null;
    camera = null;
    dust = null;
    lightLeft = null;
    lightRight = null;
    textureA = null;
    textureB = null;
  }

  const enabled = true;

  function resize() {
    if (!renderer || !camera) return;

    const rect = host.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width));
    const height = Math.max(180, Math.floor(rect.height));

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.1 : 1.6));
    renderer.setSize(width, height, false);
  }

  const ro = new ResizeObserver(() => {
    requestAnimationFrame(resize);
  });
  ro.observe(host);

  let raf = 0;
  let alive = true;
  let visible = true;

  const io = new IntersectionObserver((entries) => {
    visible = !!entries[0]?.isIntersecting;
  }, { threshold: 0.05 });
  io.observe(host);

  function rebuildRenderer() {
    disposeRenderer();
    buildRenderer();
    resize();
  }

  rebuildRenderer();

  const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const onThemeMediaChange = () => rebuildRenderer();
  themeMedia.addEventListener?.("change", onThemeMediaChange);

  const htmlObserver = new MutationObserver(() => {
    const nextTheme = resolveTheme();
    if (host.dataset.lensTheme !== nextTheme) {
      rebuildRenderer();
    }
  });
  htmlObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });

  function tick(time) {
    if (!alive) return;

    if (!renderer || !scene || !camera || !visible || document.hidden) {
      raf = requestAnimationFrame(tick);
      return;
    }

    const t = time * 0.00035;

    if (!prefersReducedMotion && !lowPower) {
      lightLeft.position.y = 1.2 + Math.sin(t * 1.7) * 0.35;
      lightLeft.position.x = -4.5 + Math.cos(t * 1.2) * 0.55;

      lightRight.position.y = -1.1 + Math.cos(t * 1.4) * 0.28;
      lightRight.position.x = 5.2 + Math.sin(t * 1.6) * 0.45;

      dust.rotation.z += 0.00035;
      dust.rotation.y += 0.00025;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    htmlObserver.disconnect();
    themeMedia.removeEventListener?.("change", onThemeMediaChange);

    host.classList.remove("hero-lensflare-host");
    delete host.dataset.lensTheme;
    layer.remove();

    disposeRenderer();
  };
}
