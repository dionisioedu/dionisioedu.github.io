/**
 * Knowledge Graph 3D Visualization
 * 
 * A Three.js-based interactive graph showing the organization
 * of learning topics, with force-directed layout and hover effects.
 */

import * as THREE from "three";
import { graphData, computeGraphPositions, getAllNodes } from "./KnowledgeGraphData.js";

export function mountKnowledgeGraph3D(root) {
  if (!root) return;

  const frame = root.querySelector("[data-graph3d-frame]");
  const canvas = root.querySelector("[data-graph3d-canvas]");
  const tooltip = root.querySelector("[data-graph3d-tooltip]");

  if (!frame || !canvas) return;

  // Guard against double-mount
  if (canvas.dataset.mounted === "1") return;
  canvas.dataset.mounted = "1";

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // ===== THREE.JS SETUP =====
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0.5, 8);

  // Lighting
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
  keyLight.position.set(5, 5, 8);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
  fillLight.position.set(-5, -2, 5);
  scene.add(fillLight);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // Get accent color from CSS
  const css = getComputedStyle(root);
  const accentCss = (css.getPropertyValue("--accent") || "#3b82f6").trim();
  const accentColor = new THREE.Color(accentCss);

  // Main group
  const graphGroup = new THREE.Group();
  scene.add(graphGroup);

  // Background starfield
  const starsGeo = new THREE.BufferGeometry();
  const starCount = 800;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 12 * Math.random();
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
  }
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starsMat = new THREE.PointsMaterial({
    size: 0.02,
    color: new THREE.Color(1, 1, 1),
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });
  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);

  // ===== GRAPH DATA =====
  const { nodes, nodeMap, edges: graphEdges } = computeGraphPositions(graphData);

  // ===== MATERIALS =====
  const defaultNodeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xd1d5db),
    roughness: 0.5,
    metalness: 0.1,
  });

  const centerNodeMat = new THREE.MeshStandardMaterial({
    color: accentColor.clone(),
    roughness: 0.3,
    metalness: 0.2,
    emissive: accentColor.clone().multiplyScalar(0.2),
  });

  const lineMat = new THREE.LineBasicMaterial({
    color: accentColor.clone(),
    transparent: true,
    opacity: 0.2,
    linewidth: 1,
  });

  const nodeGeo = new THREE.SphereGeometry(1, 24, 24);

  // ===== CREATE NODES =====
  const nodeMeshes = new Map();
  const nodeData = new Map();

  nodes.forEach((node) => {
    const isCentral = node.level === 0;
    const mat = isCentral ? centerNodeMat : defaultNodeMat.clone();

    // Create a container for the node and any glow
    const container = new THREE.Group();
    container.position.set(...node.position);

    // Main mesh
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.scale.setScalar(node.radius);
    mesh.userData = {
      id: node.id,
      level: node.level,
      baseScale: node.radius,
      isInteractive: !!node.url,
    };

    // Glow halo for interactive nodes
    if (node.url) {
      const haloGeo = new THREE.SphereGeometry(1, 16, 16);
      const haloMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color || 0x3b82f6),
        transparent: true,
        opacity: 0.0,
        roughness: 0.8,
        metalness: 0,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.scale.setScalar(node.radius * 1.3);
      halo.userData.isHalo = true;
      container.add(halo);
    }

    container.add(mesh);
    graphGroup.add(container);

    nodeMeshes.set(node.id, { container, mesh });
    nodeData.set(node.id, {
      ...node,
      originalPosition: new THREE.Vector3(...node.position),
    });
  });

  // ===== CREATE EDGES =====
  const edgeGroup = new THREE.Group();
  graphGroup.add(edgeGroup);

  graphEdges.forEach(([fromId, toId]) => {
    const fromNode = nodeData.get(fromId);
    const toNode = nodeData.get(toId);

    if (!fromNode || !toNode) return;

    const from = new THREE.Vector3(...fromNode.position);
    const to = new THREE.Vector3(...toNode.position);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(
      new Float32Array([from.x, from.y, from.z, to.x, to.y, to.z]),
      3
    ));

    const line = new THREE.Line(geo, lineMat);
    edgeGroup.add(line);
  });

  // ===== INTERACTION =====
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let rotX = 0.2;
  let rotY = 0.5;
  const controlSpeed = 0.005;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredNode = null;
  let hoveredNodeColor = null;

  function onMouseMove(e) {
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      rotY += dx * controlSpeed;
      rotX -= dy * controlSpeed;

      rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));

      lastX = e.clientX;
      lastY = e.clientY;
    } else {
      // Raycasting for hover
      raycaster.setFromCamera(mouse, camera);

      const allMeshes = Array.from(nodeMeshes.values())
        .map((m) => m.mesh)
        .filter((m) => m && m.parent);

      const intersects = raycaster.intersectObjects(allMeshes);

      if (hoveredNode) {
        hoveredNode.material.color.set(hoveredNodeColor);
        hoveredNode.material.emissive.setScalar(0);
      }

      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        hoveredNode = mesh;
        hoveredNodeColor = mesh.material.color.getHex();

        // Highlight on hover
        const metadata = nodeData.get(mesh.userData.id);
        mesh.material.color.set(metadata.color || 0x3b82f6);
        mesh.material.emissive.setScalar(0.15);

        // Update tooltip with richer information
        if (tooltip) {
          tooltip.innerHTML = `
            <div class="tooltip-title">${metadata.id}</div>
            <div class="tooltip-description">${metadata.description || ""}</div>
            ${metadata.url ? '<div class="tooltip-hint">Clique para explorar →</div>' : ""}
          `;
          
          // Position tooltip near cursor with offset
          tooltip.style.left = (e.clientX + 12) + "px";
          tooltip.style.top = (e.clientY + 12) + "px";
          tooltip.style.opacity = "1";
          tooltip.style.pointerEvents = "none";
        }
      } else if (tooltip) {
        tooltip.style.opacity = "0";
      }
    }
  }

  function onMouseDown(e) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseUp(e) {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  function onWheel(e) {
    e.preventDefault();
    camera.position.z += (e.deltaY > 0 ? 1 : -1) * 0.5;
    camera.position.z = Math.max(3, Math.min(15, camera.position.z));
  }

  function onClick(e) {
    raycaster.setFromCamera(mouse, camera);
    const allMeshes = Array.from(nodeMeshes.values())
      .map((m) => m.mesh)
      .filter((m) => m && m.parent);

    const intersects = raycaster.intersectObjects(allMeshes);
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      const metadata = nodeData.get(mesh.userData.id);
      if (metadata.url) {
        window.location.href = metadata.url;
      }
    }
  }

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("click", onClick);

  // ===== ANIMATION & RENDERING =====
  let animationId;

  function updateSize() {
    const w = frame.clientWidth;
    const h = frame.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  updateSize();
  window.addEventListener("resize", updateSize);

  function animate() {
    animationId = requestAnimationFrame(animate);

    // Apply rotation
    graphGroup.rotation.x = rotX;
    graphGroup.rotation.y = rotY;

    // Gentle floating animation for nodes if not dragging
    if (!isDragging && !prefersReducedMotion) {
      const time = Date.now() * 0.0003;
      nodeMeshes.forEach((nodeMesh, nodeId) => {
        const nodeInfo = nodeData.get(nodeId);
        if (nodeInfo && nodeInfo.level > 0) {
          const offset = Math.sin(time + nodeId.length) * 0.1;
          nodeMesh.container.position.y =
            nodeInfo.originalPosition.y + offset;
        }
      });
    }

    renderer.render(scene, camera);
  }

  animate();

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("click", onClick);
    window.removeEventListener("resize", updateSize);
    renderer.dispose();
  };
}
