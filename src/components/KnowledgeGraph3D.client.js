import * as THREE from "three";

const AREA_COLORS = [
  0x60a5fa,
  0x34d399,
  0xf59e0b,
  0xa78bfa,
  0xf472b6,
  0x22d3ee,
  0xfb7185,
  0x4ade80,
];

function getLocaleFromPath() {
  if (typeof window === "undefined") return "pt";
  return window.location.pathname.startsWith("/en/") ? "en" : "pt";
}

function buildLocaleConfig(locale) {
  if (locale === "en") {
    return {
      ui: {
        kicker: "3D Knowledge Map",
        initialTitle: "Navigate by area",
        initialDescription:
          "Explore the main knowledge areas in one place. Select a node to read details and jump straight into that section.",
        openArea: "Open area",
        viewAll: "View all docs",
        hint: "Drag to rotate · Scroll to zoom · Click to open",
        allDocsHref: "/en/",
      },
      areas: [
        {
          id: "getting-started",
          title: "Where to Start",
          short: "Start here",
          description:
            "A clear learning order for beginners: what to study first and why it matters.",
          href: "/en/reference/getting-started/",
        },
        {
          id: "data-types",
          title: "Data Types",
          short: "Correct data modeling",
          description:
            "Choose the right type for each value, avoid conversion pitfalls, and write safer code.",
          href: "/en/reference/tipos-de-dados/",
        },
        {
          id: "data-structures",
          title: "Data Structures",
          short: "Organize for performance",
          description:
            "Pick the right structures for lookup, insertion, and scalability in real projects.",
          href: "/en/reference/estruturas-de-dados/",
        },
        {
          id: "programming-logic",
          title: "Programming Logic",
          short: "Think in steps",
          description:
            "Break down problems into clear steps and produce consistent, testable solutions.",
          href: "/en/reference/logica-de-programacao/",
        },
        {
          id: "algorithms",
          title: "Algorithms",
          short: "Solve efficiently",
          description:
            "Build solutions that remain correct, readable, and efficient as input grows.",
          href: "/en/reference/algoritmos/",
        },
        {
          id: "ascii-table",
          title: "ASCII Table",
          short: "Text and bytes",
          description:
            "Understand how characters map to numbers and strengthen your mental model of text representation.",
          href: "/en/reference/tabela-ascii/",
        },
        {
          id: "articles",
          title: "Technical Articles",
          short: "Deep dives",
          description:
            "In-depth engineering content on clean code, SRE, complexity, and software design.",
          href: "/en/artigos-tecnicos/clean-code/",
        },
        {
          id: "projects",
          title: "Projects",
          short: "See applied engineering",
          description:
            "Navigate real project pages and understand practical architecture decisions.",
          href: "/en/projects/",
        },
      ],
    };
  }

  return {
    ui: {
      kicker: "Mapa 3D de Conhecimento",
      initialTitle: "Navegue por áreas",
      initialDescription:
        "Explore as principais áreas de conhecimento em um único lugar. Selecione um nó para ler os detalhes e entrar direto na seção.",
      openArea: "Abrir área",
      viewAll: "Ver documentação",
      hint: "Arraste para girar · Scroll para zoom · Clique para abrir",
      allDocsHref: "/pt/",
    },
    areas: [
      {
        id: "getting-started",
        title: "Por Onde Começar",
        short: "Comece por aqui",
        description:
          "Roteiro claro para iniciantes: o que estudar primeiro e por que essa ordem faz diferença.",
        href: "/pt/reference/getting-started/",
      },
      {
        id: "data-types",
        title: "Tipos de Dados",
        short: "Modelagem correta",
        description:
          "Escolha o tipo certo para cada valor, evite erros de conversão e escreva código mais seguro.",
        href: "/pt/reference/tipos-de-dados/",
      },
      {
        id: "data-structures",
        title: "Estruturas de Dados",
        short: "Organize para performance",
        description:
          "Escolha estruturas ideais para busca, inserção e escalabilidade em cenários reais.",
        href: "/pt/reference/estruturas-de-dados/",
      },
      {
        id: "programming-logic",
        title: "Lógica de Programação",
        short: "Pense em etapas",
        description:
          "Quebre problemas em passos objetivos e construa soluções consistentes e testáveis.",
        href: "/pt/reference/logica-de-programacao/",
      },
      {
        id: "algorithms",
        title: "Algoritmos",
        short: "Resolva com eficiência",
        description:
          "Crie soluções corretas, legíveis e eficientes conforme a entrada cresce.",
        href: "/pt/reference/algoritmos/",
      },
      {
        id: "ascii-table",
        title: "Tabela ASCII",
        short: "Texto e bytes",
        description:
          "Entenda como caracteres viram números e melhore sua base de representação textual.",
        href: "/pt/reference/tabela-ascii/",
      },
      {
        id: "articles",
        title: "Artigos Técnicos",
        short: "Aprofundamento",
        description:
          "Conteúdos aprofundados sobre clean code, SRE, complexidade e engenharia de software.",
        href: "/pt/artigos-tecnicos/clean-code/",
      },
      {
        id: "projects",
        title: "Projetos",
        short: "Engenharia aplicada",
        description:
          "Navegue por projetos reais e veja decisões de arquitetura aplicadas em produção.",
        href: "/pt/projects/",
      },
    ],
  };
}

function makeNodePositions(areas) {
  const positions = [];
  const total = areas.length;

  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2;
    const radius = 2.5 + (i % 2) * 0.35;
    positions.push({
      x: Math.cos(angle) * radius,
      y: ((i % 3) - 1) * 0.38,
      z: Math.sin(angle) * radius,
    });
  }

  return positions;
}

export function mountKnowledgeGraph3D(root) {
  if (!root) return () => {};

  const frame = root.querySelector("[data-graph3d-frame]");
  const canvas = root.querySelector("[data-graph3d-canvas]");

  if (!frame || !canvas) return () => {};

  const locale = getLocaleFromPath();
  const config = buildLocaleConfig(locale);
  const areas = config.areas;

  const kickerEl = root.querySelector("[data-graph3d-kicker]");
  const titleEl = root.querySelector("[data-graph3d-title]");
  const descriptionEl = root.querySelector("[data-graph3d-description]");
  const hintEl = root.querySelector("[data-graph3d-hint]");
  const openEl = root.querySelector("[data-graph3d-open]");
  const indexEl = root.querySelector("[data-graph3d-index]");
  const listEl = root.querySelector("[data-graph3d-list]");

  if (kickerEl) kickerEl.textContent = config.ui.kicker;
  if (titleEl) titleEl.textContent = config.ui.initialTitle;
  if (descriptionEl) descriptionEl.textContent = config.ui.initialDescription;
  if (hintEl) hintEl.textContent = config.ui.hint;

  if (openEl) {
    openEl.textContent = config.ui.openArea;
    openEl.setAttribute("href", areas[0].href);
  }

  if (indexEl) {
    indexEl.textContent = config.ui.viewAll;
    indexEl.setAttribute("href", config.ui.allDocsHref);
  }

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0.15, 7.5);

  const ambient = new THREE.AmbientLight(0xffffff, 0.78);
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(3, 5, 8);
  const fill = new THREE.DirectionalLight(0x8ab8ff, 0.55);
  fill.position.set(-4, -2, -5);

  scene.add(ambient);
  scene.add(key);
  scene.add(fill);

  const cloud = new THREE.Group();
  scene.add(cloud);

  const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.85, 0.02, 16, 160),
    new THREE.MeshBasicMaterial({
      color: 0x99b7ff,
      transparent: true,
      opacity: 0.26,
    })
  );
  orbitRing.rotation.x = Math.PI * 0.42;
  cloud.add(orbitRing);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 1),
    new THREE.MeshStandardMaterial({
      color: 0x8ec5ff,
      roughness: 0.25,
      metalness: 0.32,
      emissive: new THREE.Color(0x2a4f85),
      emissiveIntensity: 0.4,
    })
  );
  cloud.add(core);

  const starsGeo = new THREE.BufferGeometry();
  const starsCount = 420;
  const starsPos = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount; i++) {
    const radius = 10 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starsPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starsPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starsPos[i * 3 + 2] = radius * Math.cos(phi);
  }
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starsPos, 3));
  const stars = new THREE.Points(
    starsGeo,
    new THREE.PointsMaterial({
      size: 0.03,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      color: 0xffffff,
    })
  );
  scene.add(stars);

  const nodeEntries = [];
  const positions = makeNodePositions(areas);

  const nodeGeo = new THREE.SphereGeometry(0.24, 20, 20);
  const lineGroup = new THREE.Group();
  cloud.add(lineGroup);

  areas.forEach((area, index) => {
    const color = AREA_COLORS[index % AREA_COLORS.length];
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.35,
      metalness: 0.22,
      emissive: new THREE.Color(color).multiplyScalar(0.08),
    });

    const mesh = new THREE.Mesh(nodeGeo, material);

    const pos = positions[index];
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData.areaId = area.id;
    cloud.add(mesh);

    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(pos.x, pos.y, pos.z),
    ]);

    const line = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.28,
      })
    );

    lineGroup.add(line);

    nodeEntries.push({
      area,
      mesh,
      line,
      baseScale: 1,
      color,
      phase: Math.random() * Math.PI * 2,
      basePosition: new THREE.Vector3(pos.x, pos.y, pos.z),
    });
  });

  let selectedId = areas[0].id;

  const mapButtons = new Map();
  if (listEl) {
    listEl.innerHTML = "";
    areas.slice(0, 4).forEach((area) => {
      const a = document.createElement("a");
      a.className = "area-btn";
      a.href = area.href;
      a.innerHTML = `<strong>${area.title}</strong><span>${area.short}</span>`;
      a.addEventListener("mouseenter", () => selectArea(area.id, false));
      a.addEventListener("focus", () => selectArea(area.id, false));
      a.addEventListener("click", (event) => {
        event.preventDefault();
        navigateTo(area.href);
      });
      listEl.appendChild(a);
      mapButtons.set(area.id, a);
    });
  }

  function navigateTo(href) {
    window.location.assign(href);
  }

  function selectArea(areaId, updateCamera = true) {
    const entry = nodeEntries.find((item) => item.area.id === areaId);
    if (!entry) return;

    selectedId = areaId;

    if (titleEl) titleEl.textContent = entry.area.title;
    if (descriptionEl) descriptionEl.textContent = entry.area.description;
    if (openEl) openEl.setAttribute("href", entry.area.href);

    mapButtons.forEach((button, id) => {
      button.classList.toggle("is-active", id === areaId);
    });

    nodeEntries.forEach((item) => {
      const selected = item.area.id === areaId;
      item.mesh.scale.setScalar(selected ? 1.24 : 1);
      item.line.material.opacity = selected ? 0.62 : 0.28;
      item.mesh.material.emissiveIntensity = selected ? 0.62 : 0.24;
    });

    if (updateCamera) {
      const target = entry.mesh.position;
      cameraTarget.set(target.x * 0.1, target.y * 0.1, camera.position.z);
    }
  }

  selectArea(selectedId, false);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let cameraTarget = new THREE.Vector3(0, 0, camera.position.z);

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pickNode(event) {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(nodeEntries.map((entry) => entry.mesh));
    if (!hits.length) return null;
    const areaId = hits[0].object.userData.areaId;
    return nodeEntries.find((entry) => entry.area.id === areaId) || null;
  }

  let dragging = false;
  let dragLastX = 0;
  let dragLastY = 0;
  let rotX = 0.18;
  let rotY = 0.58;

  function onPointerDown(event) {
    dragging = true;
    dragLastX = event.clientX;
    dragLastY = event.clientY;
  }

  function onPointerMove(event) {
    if (!dragging) {
      const hit = pickNode(event);
      canvas.style.cursor = hit ? "pointer" : "grab";
      if (hit) selectArea(hit.area.id, false);
      return;
    }

    const dx = event.clientX - dragLastX;
    const dy = event.clientY - dragLastY;
    dragLastX = event.clientX;
    dragLastY = event.clientY;

    rotY += dx * 0.0048;
    rotX -= dy * 0.0036;
    rotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotX));
  }

  function onPointerUp() {
    dragging = false;
  }

  function onClick(event) {
    const hit = pickNode(event);
    if (!hit) return;
    selectArea(hit.area.id);
    navigateTo(hit.area.href);
  }

  function onWheel(event) {
    event.preventDefault();
    camera.position.z += Math.sign(event.deltaY) * 0.45;
    camera.position.z = Math.min(12, Math.max(5.4, camera.position.z));
    cameraTarget.z = camera.position.z;
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.style.cursor = "grab";

  let animationId = null;

  function updateSize() {
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  updateSize();
  window.addEventListener("resize", updateSize);

  function animate() {
    animationId = requestAnimationFrame(animate);

    core.rotation.y += prefersReducedMotion ? 0.0012 : 0.0032;
    core.rotation.x += prefersReducedMotion ? 0.0008 : 0.0014;

    if (!prefersReducedMotion) {
      const t = performance.now() * 0.001;
      nodeEntries.forEach((entry, idx) => {
        const pulse = 1 + Math.sin(t * 1.8 + entry.phase) * 0.06;
        const y = entry.basePosition.y + Math.sin(t * 1.2 + idx) * 0.05;
        entry.mesh.position.y = y;
        if (entry.area.id !== selectedId) {
          entry.mesh.scale.setScalar(entry.baseScale * pulse);
        }
      });
      stars.rotation.y += 0.00045;
    }

    cloud.rotation.x = rotX;
    cloud.rotation.y = rotY;

    camera.position.x += (cameraTarget.x - camera.position.x) * 0.06;
    camera.position.y += (cameraTarget.y - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  return () => {
    if (animationId) cancelAnimationFrame(animationId);

    canvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("click", onClick);
    canvas.removeEventListener("wheel", onWheel);
    window.removeEventListener("resize", updateSize);

    nodeEntries.forEach((entry) => {
      entry.mesh.geometry.dispose();
      entry.mesh.material.dispose();
      entry.line.geometry.dispose();
      entry.line.material.dispose();
    });

    stars.geometry.dispose();
    stars.material.dispose();
    orbitRing.geometry.dispose();
    orbitRing.material.dispose();
    core.geometry.dispose();
    core.material.dispose();

    renderer.dispose();
  };
}
