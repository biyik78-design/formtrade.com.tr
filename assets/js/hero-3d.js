/* =========================================================
   FORS — Cinematic 3D Hero Background
   Three.js procedural hardware rig, slowly rotating with
   mouse parallax behind the homepage hero content.
   ========================================================= */

(() => {
  const canvas = document.getElementById("heroCanvas");
  const heroSection = document.getElementById("hero");
  if (!canvas || !heroSection || typeof THREE === "undefined") return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Helpers ---------- */
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  function roundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    const x = -w / 2,
      y = -h / 2;
    shape.moveTo(x, y + r);
    shape.lineTo(x, y + h - r);
    shape.quadraticCurveTo(x, y + h, x + r, y + h);
    shape.lineTo(x + w - r, y + h);
    shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    shape.lineTo(x + w, y + r);
    shape.quadraticCurveTo(x + w, y, x + w - r, y);
    shape.lineTo(x + r, y);
    shape.quadraticCurveTo(x, y, x, y + r);
    return shape;
  }

  /* ---------- Materials ---------- */
  const matSteelLight = new THREE.MeshStandardMaterial({ color: 0xe8ecef, metalness: 0.95, roughness: 0.18 });
  const matSteelMid = new THREE.MeshStandardMaterial({ color: 0xb9bfc6, metalness: 0.92, roughness: 0.26 });
  const matSteelDark = new THREE.MeshStandardMaterial({ color: 0x6e7480, metalness: 0.9, roughness: 0.36 });
  const matSlot = new THREE.MeshStandardMaterial({ color: 0x12141a, metalness: 0.4, roughness: 0.6 });
  const matSpring = new THREE.MeshStandardMaterial({ color: 0xd8c187, metalness: 0.75, roughness: 0.28 });
  const matAccent = new THREE.MeshStandardMaterial({
    color: 0xf2a23c,
    metalness: 0.55,
    roughness: 0.32,
    emissive: 0x3a2509,
    emissiveIntensity: 0.6,
  });
  const matAccent2 = new THREE.MeshStandardMaterial({
    color: 0x43dfd0,
    metalness: 0.5,
    roughness: 0.3,
    emissive: 0x0c332f,
    emissiveIntensity: 0.5,
  });

  /* ---------- Component builders ---------- */
  function buildMountingPlate() {
    const g = new THREE.Group();
    const shape = roundedRectShape(2.6, 4.6, 0.4);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.34, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 });
    geo.rotateY(Math.PI / 2);
    geo.translate(-0.17, 0, 0);
    g.add(new THREE.Mesh(geo, matSteelMid));

    const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 28), matSteelLight);
    boss.rotation.z = Math.PI / 2;
    boss.position.set(0.4, 0.65, 0);
    g.add(boss);

    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.16), matSlot);
    slot.position.set(0.66, 0.65, 0);
    g.add(slot);

    [1.35, -1.35].forEach((zOff) => {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 20), matSlot);
      hole.rotation.z = Math.PI / 2;
      hole.position.set(0.2, -1.05, zOff);
      g.add(hole);
    });

    return g;
  }

  function buildHingeArm() {
    const g = new THREE.Group();
    const shape = roundedRectShape(6.4, 2.0, 1.0);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 });
    geo.translate(-3.2, -1.0, -0.25);
    g.add(new THREE.Mesh(geo, matSteelDark));

    const hubCup = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.62, 32), matSteelMid);
    hubCup.rotation.x = Math.PI / 2;
    hubCup.position.set(3.0, 0, 0);
    g.add(hubCup);

    const hubPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.62, 32), matSteelMid);
    hubPlate.rotation.x = Math.PI / 2;
    hubPlate.position.set(-3.0, 0, 0);
    g.add(hubPlate);

    const recess = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32), matSteelDark);
    recess.rotation.x = Math.PI / 2;
    recess.position.set(3.0, 0, 0.32);
    g.add(recess);

    return g;
  }

  function buildHingeCup() {
    const g = new THREE.Group();
    const cylGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.3, 36, 1, true);
    cylGeo.rotateZ(Math.PI / 2);
    g.add(new THREE.Mesh(cylGeo, matSteelMid));

    const capGeo = new THREE.CircleGeometry(1.6, 36);
    capGeo.rotateY(-Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, matSteelDark);
    cap.position.x = -0.65;
    g.add(cap);

    const flangeGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.22, 36);
    flangeGeo.rotateZ(Math.PI / 2);
    const flange = new THREE.Mesh(flangeGeo, matSteelLight);
    flange.position.x = 0.76;
    g.add(flange);

    [1, -1].forEach((sign) => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.95, 1.7), matSteelLight);
      ear.position.set(0.5, sign * 1.55, 0);
      g.add(ear);
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16), matSlot);
      hole.rotation.z = Math.PI / 2;
      hole.position.set(0.78, sign * 1.55, 0);
      g.add(hole);
    });

    return g;
  }

  function buildSpring() {
    const g = new THREE.Group();
    const turns = 5,
      segs = turns * 14,
      coilR = 0.34,
      tubeR = 0.05,
      height = 1.0;
    const points = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const a = t * turns * Math.PI * 2;
      points.push(V(Math.cos(a) * coilR, t * height - height / 2, Math.sin(a) * coilR));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, segs, tubeR, 8, false);
    geo.rotateZ(Math.PI / 2);
    g.add(new THREE.Mesh(geo, matSpring));

    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.1, 18), matSteelLight);
    piston.rotation.z = Math.PI / 2;
    g.add(piston);

    const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 18), matSteelDark);
    cap1.rotation.z = Math.PI / 2;
    cap1.position.x = -0.55;
    g.add(cap1);

    const cap2 = cap1.clone();
    cap2.position.x = 0.55;
    g.add(cap2);

    return g;
  }

  function buildScrew({ shaftLen = 1.0, shaftR = 0.13, headR = 0.27, headLen = 0.2, accent = false }) {
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(shaftR, shaftR * 0.45, shaftLen, 12), matSteelMid);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = -shaftLen / 2;
    g.add(shaft);

    const head = new THREE.Mesh(new THREE.CylinderGeometry(headR, headR, headLen, 24), accent ? matAccent : matSteelMid);
    head.rotation.z = Math.PI / 2;
    head.position.x = headLen / 2;
    g.add(head);

    const slotA = new THREE.Mesh(new THREE.BoxGeometry(headLen * 1.05, headR * 1.5, 0.035), matSlot);
    slotA.position.x = headLen + 0.001;
    g.add(slotA);
    const slotB = slotA.clone();
    slotB.rotation.x = Math.PI / 2;
    g.add(slotB);

    return g;
  }

  function twinScrewGroup(opts, gap, axis) {
    const g = new THREE.Group();
    [1, -1].forEach((sign) => {
      const s = buildScrew(opts);
      s.position[axis] = sign * gap;
      g.add(s);
    });
    return g;
  }

  function buildRailSegment() {
    const g = new THREE.Group();

    const outerShape = roundedRectShape(1.0, 0.55, 0.1);
    const outerGeo = new THREE.ExtrudeGeometry(outerShape, { depth: 8, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
    outerGeo.center();
    outerGeo.rotateY(Math.PI / 2);
    g.add(new THREE.Mesh(outerGeo, matSteelDark));

    const innerShape = roundedRectShape(0.62, 0.34, 0.06);
    const innerGeo = new THREE.ExtrudeGeometry(innerShape, { depth: 3.4, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 });
    innerGeo.center();
    innerGeo.rotateY(Math.PI / 2);
    const inner = new THREE.Mesh(innerGeo, matSteelLight);
    inner.position.set(2.0, 0.07, 0);
    g.add(inner);

    [-1, 0, 1].forEach((i) => {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), matAccent2);
      ball.position.set(i * 1.1, -0.06, 0.2);
      g.add(ball);
    });

    return g;
  }

  /* ---------- Environment (procedural studio reflections) ---------- */
  function buildEnvironment(renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();

    const skyGeo = new THREE.SphereGeometry(30, 32, 32);
    const top = new THREE.Color(0x3a3f4d);
    const bottom = new THREE.Color(0x07090d);
    const pos = skyGeo.attributes.position;
    const colors = [];
    for (let i = 0; i < pos.count; i++) {
      const t = clamp01((pos.getY(i) + 30) / 60);
      const c = bottom.clone().lerp(top, t);
      colors.push(c.r, c.g, c.b);
    }
    skyGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const skyMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(skyGeo, skyMat));

    const panel = (w, h, color, x, y, z) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color }));
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    };
    panel(18, 24, 0xfff4e2, -14, 8, 6);
    panel(14, 20, 0x43dfd0, 16, 6, -8);
    panel(24, 14, 0xc7d6ff, 0, -14, 10);

    const rt = pmrem.fromScene(envScene, 0.04);
    envScene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    pmrem.dispose();
    return rt.texture;
  }

  /* ---------- Scene setup ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090d, 0.035);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.4, 13);

  scene.environment = buildEnvironment(renderer);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const key = new THREE.DirectionalLight(0xfff3e0, 1.7);
  key.position.set(7, 9, 7);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8fb4ff, 0.5);
  fill.position.set(-9, 2, -5);
  scene.add(fill);

  const rimWarm = new THREE.PointLight(0xf2a23c, 1.3, 50);
  rimWarm.position.set(-6, 3, -8);
  scene.add(rimWarm);

  const rimCool = new THREE.PointLight(0x43dfd0, 1.0, 50);
  rimCool.position.set(7, -3, 6);
  scene.add(rimCool);

  /* ---------- Build floating hardware rig ---------- */
  const rig = new THREE.Group();
  rig.rotation.y = -0.3;
  scene.add(rig);

  const PARTS = [
    { mesh: buildHingeCup(), pos: V(0, 0.2, 0), rot: V(0.12, 0.7, 0), spin: V(0.04, 0.1, 0), bobAmp: 0.16, bobSpeed: 0.55, phase: 0, scale: 1.05 },
    { mesh: buildHingeArm(), pos: V(-3.2, 1.7, -1.4), rot: V(0.25, -0.5, 0.08), spin: V(-0.035, 0.07, 0.025), bobAmp: 0.22, bobSpeed: 0.42, phase: 1.4, scale: 0.85 },
    { mesh: buildMountingPlate(), pos: V(2.7, -1.6, 1.3), rot: V(-0.18, 0.85, 0.12), spin: V(0.05, -0.045, 0.02), bobAmp: 0.15, bobSpeed: 0.5, phase: 2.6, scale: 0.8 },
    { mesh: buildSpring(), pos: V(-2.5, -1.9, 1.9), rot: V(0, 0, 0.35), spin: V(0.02, 0.16, -0.025), bobAmp: 0.2, bobSpeed: 0.58, phase: 3.7, scale: 0.95 },
    { mesh: buildRailSegment(), pos: V(2.4, 2.5, -2.4), rot: V(0.15, 0.4, -0.08), spin: V(-0.025, 0.055, 0), bobAmp: 0.24, bobSpeed: 0.38, phase: 4.9, scale: 0.42 },
    {
      mesh: twinScrewGroup({ shaftLen: 1.2, shaftR: 0.13, headR: 0.27, headLen: 0.22, accent: true }, 1.4, "z"),
      pos: V(0.6, -2.9, 0.7),
      rot: V(0, 0, Math.PI / 2),
      spin: V(0, 0.1, 0),
      bobAmp: 0.13,
      bobSpeed: 0.62,
      phase: 5.5,
      scale: 0.9,
    },
  ];

  PARTS.forEach((p) => {
    p.mesh.position.copy(p.pos);
    p.mesh.rotation.set(p.rot.x, p.rot.y, p.rot.z);
    p.mesh.scale.setScalar(p.scale);
    rig.add(p.mesh);
  });

  /* ---------- Pointer parallax ---------- */
  let pointerX = 0,
    pointerY = 0,
    parallaxX = 0,
    parallaxY = 0;

  if (!prefersReducedMotion) {
    window.addEventListener(
      "pointermove",
      (e) => {
        pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
  }

  /* ---------- Layout / resize ---------- */
  function updateLayout() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    if (w < 640) {
      rig.position.set(0.7, -0.6, 0);
      rig.scale.setScalar(0.6);
      camera.position.z = 14;
    } else if (w < 1100) {
      rig.position.set(1.6, 0.4, 0);
      rig.scale.setScalar(0.88);
      camera.position.z = 13.5;
    } else {
      rig.position.set(3.2, 0, 0);
      rig.scale.setScalar(1);
      camera.position.z = 13;
    }
  }

  window.addEventListener("resize", () => {
    updateLayout();
    if (prefersReducedMotion) renderer.render(scene, camera);
  });

  updateLayout();

  /* ---------- Animation loop ---------- */
  let rafId = null;
  const baseRotY = -0.3;

  function animate(now) {
    rafId = requestAnimationFrame(animate);
    const t = now * 0.001;

    parallaxX += (-pointerY * 0.18 - parallaxX) * 0.04;
    parallaxY += (pointerX * 0.26 - parallaxY) * 0.04;

    rig.rotation.y = baseRotY + parallaxY + t * 0.025;
    rig.rotation.x = parallaxX;

    PARTS.forEach((p) => {
      p.mesh.position.y = p.pos.y + Math.sin(t * p.bobSpeed + p.phase) * p.bobAmp;
      p.mesh.rotation.x = p.rot.x + t * p.spin.x;
      p.mesh.rotation.y = p.rot.y + t * p.spin.y;
      p.mesh.rotation.z = p.rot.z + t * p.spin.z;
    });

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderer.render(scene, camera);
  } else {
    rafId = requestAnimationFrame(animate);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (rafId === null) rafId = requestAnimationFrame(animate);
          } else if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(heroSection);
  }
})();
