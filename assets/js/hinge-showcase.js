/* =========================================================
   FORS — Concealed Hinge 3D Showcase
   Three.js + GSAP ScrollTrigger scroll-scrubbed exploded view
   ========================================================= */

(() => {
  const TITLE_TR = "FORS Gizli Menteşe | İnteraktif Mühendislik Vitrini";
  const TITLE_EN = "FORS Concealed Hinge | Interactive Engineering Showcase";
  const DESC_TR =
    "FORS gizli mobilya menteşesinin parça parça ayrılan, kaydırma ile yönlendirilen 3 boyutlu mühendislik sunumu.";
  const DESC_EN =
    "A scroll-driven 3D engineering breakdown of the FORS concealed cabinet hinge, exploding into its individual components.";

  /* ---------- Helpers ---------- */
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => {
    t = clamp01(t);
    return t * t * (3 - 2 * t);
  };
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
  const matSteelLight = new THREE.MeshStandardMaterial({ color: 0xe2e6e9, metalness: 0.95, roughness: 0.2 });
  const matSteelMid = new THREE.MeshStandardMaterial({ color: 0xb9bfc6, metalness: 0.92, roughness: 0.28 });
  const matSteelDark = new THREE.MeshStandardMaterial({ color: 0x7d838c, metalness: 0.9, roughness: 0.36 });
  const matScrew = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 0.88, roughness: 0.42 });
  const matSlot = new THREE.MeshStandardMaterial({ color: 0x15171b, metalness: 0.4, roughness: 0.6 });
  const matSpring = new THREE.MeshStandardMaterial({ color: 0xd8c187, metalness: 0.75, roughness: 0.3 });
  const matAccent = new THREE.MeshStandardMaterial({
    color: 0xf2a23c,
    metalness: 0.6,
    roughness: 0.35,
    emissive: 0x3a2509,
    emissiveIntensity: 0.6,
  });
  const matDoorFront = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, metalness: 0.02, roughness: 0.85, envMapIntensity: 0.2, transparent: true });
  const matCarcassOuter = new THREE.MeshStandardMaterial({ color: 0x3a3d44, metalness: 0.12, roughness: 0.65, transparent: true });
  const matCarcassInner = new THREE.MeshStandardMaterial({ color: 0x24262b, metalness: 0.08, roughness: 0.75, transparent: true });

  /* ---------- Component builders ---------- */
  function buildMountingPlate() {
    const g = new THREE.Group();
    const shape = roundedRectShape(2.6, 4.6, 0.4);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.34, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 });
    geo.rotateY(Math.PI / 2);
    geo.translate(-0.17, 0, 0);
    const body = new THREE.Mesh(geo, matSteelMid);
    body.castShadow = body.receiveShadow = true;
    g.add(body);

    const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 28), matSteelLight);
    boss.rotation.z = Math.PI / 2;
    boss.position.set(0.4, 0.65, 0);
    boss.castShadow = true;
    g.add(boss);

    const slotGeo = new THREE.BoxGeometry(0.08, 0.6, 0.16);
    const slot = new THREE.Mesh(slotGeo, matSlot);
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
    const body = new THREE.Mesh(geo, matSteelDark);
    body.castShadow = body.receiveShadow = true;
    g.add(body);

    const hubCup = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.62, 32), matSteelMid);
    hubCup.rotation.x = Math.PI / 2;
    hubCup.position.set(3.0, 0, 0);
    hubCup.castShadow = true;
    g.add(hubCup);

    const hubPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.62, 32), matSteelMid);
    hubPlate.rotation.x = Math.PI / 2;
    hubPlate.position.set(-3.0, 0, 0);
    hubPlate.castShadow = true;
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
    const cyl = new THREE.Mesh(cylGeo, matSteelMid);
    cyl.castShadow = cyl.receiveShadow = true;
    g.add(cyl);

    const capGeo = new THREE.CircleGeometry(1.6, 36);
    capGeo.rotateY(-Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, matSteelDark);
    cap.position.x = -0.65;
    g.add(cap);

    const flangeGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.22, 36);
    flangeGeo.rotateZ(Math.PI / 2);
    const flange = new THREE.Mesh(flangeGeo, matSteelLight);
    flange.position.x = 0.76;
    flange.castShadow = true;
    g.add(flange);

    [1, -1].forEach((sign) => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.95, 1.7), matSteelLight);
      ear.position.set(0.5, sign * 1.55, 0);
      ear.castShadow = true;
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
    const spring = new THREE.Mesh(geo, matSpring);
    spring.castShadow = true;
    g.add(spring);

    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.1, 18), matSteelLight);
    piston.rotation.z = Math.PI / 2;
    piston.castShadow = true;
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
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(shaftR, shaftR * 0.45, shaftLen, 12), matScrew);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = -shaftLen / 2;
    shaft.castShadow = true;
    g.add(shaft);

    const head = new THREE.Mesh(new THREE.CylinderGeometry(headR, headR, headLen, 24), accent ? matAccent : matScrew);
    head.rotation.z = Math.PI / 2;
    head.position.x = headLen / 2;
    head.castShadow = true;
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

  function buildCabinetDoor() {
    const w = 2.8,
      h = 3.9,
      depth = 0.4,
      r = 0.05;
    const shape = roundedRectShape(w, h, r);
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3 });
    geo.translate(-w / 2, 0, -depth / 2);
    const mesh = new THREE.Mesh(geo, matDoorFront);
    mesh.castShadow = mesh.receiveShadow = true;
    return mesh;
  }

  function buildCabinetCarcass() {
    const g = new THREE.Group();
    const W = 3.0,
      H = 4.2,
      D = 3.0,
      t = 0.16;

    const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, t), matCarcassOuter);
    back.position.set(-W / 2, 0, -D + t / 2);
    g.add(back);

    const top = new THREE.Mesh(new THREE.BoxGeometry(W, t, D), matCarcassOuter);
    top.position.set(-W / 2, H / 2 - t / 2, -D / 2);
    g.add(top);

    const bottom = top.clone();
    bottom.position.y = -H / 2 + t / 2;
    g.add(bottom);

    const sidePanel = new THREE.BoxGeometry(t, H, D);
    const left = new THREE.Mesh(sidePanel, matCarcassInner);
    left.position.set(-W + t / 2, 0, -D / 2);
    g.add(left);

    const right = new THREE.Mesh(sidePanel, matCarcassInner);
    right.position.set(-t / 2, 0, -D / 2);
    g.add(right);

    const shelf = new THREE.Mesh(new THREE.BoxGeometry(W - t * 2, t, D - t * 2), matCarcassInner);
    shelf.position.set(-W / 2, -0.35, -D / 2);
    g.add(shelf);

    g.traverse((o) => {
      if (o.isMesh) o.castShadow = o.receiveShadow = true;
    });
    return g;
  }

  /* ---------- Environment (procedural studio HDRI) ---------- */
  function buildEnvironment(renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();

    const skyGeo = new THREE.SphereGeometry(30, 32, 32);
    const top = new THREE.Color(0x3c4250);
    const bottom = new THREE.Color(0x05060a);
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
    panel(16, 22, 0xffffff, -14, 6, 8);
    panel(12, 18, 0xffe6c2, 16, 8, -6);
    panel(22, 12, 0xc7d6ff, 0, -12, 10);

    const rt = pmrem.fromScene(envScene, 0.05);
    envScene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    pmrem.dispose();
    return rt.texture;
  }

  /* ---------- Scene setup ---------- */
  const canvas = document.getElementById("hingeCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);

  scene.environment = buildEnvironment(renderer);

  scene.add(new THREE.AmbientLight(0xffffff, 0.32));

  const key = new THREE.DirectionalLight(0xfff3e0, 1.5);
  key.position.set(6, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { near: 1, far: 30, left: -10, right: 10, top: 10, bottom: -10 });
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x9db8ff, 0.55);
  fill.position.set(-8, 3, -4);
  scene.add(fill);

  const rim = new THREE.PointLight(0xf2a23c, 1.4, 50);
  rim.position.set(-6, 4, -9);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.32 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.6;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- Build hinge rig ---------- */
  const rig = new THREE.Group();
  scene.add(rig);

  const PARTS = [
    {
      name: "plate",
      group: buildMountingPlate(),
      assembled: { pos: V(-3.0, 0, 0), rot: V(0, 0, 0) },
      exploded: { pos: V(-6.6, 0.7, -1.3), rot: V(0, 0.22, 0.05) },
      range: [0.27, 0.42],
      label: { tr: "Montaj Plakası", en: "Mounting Plate" },
    },
    {
      name: "arm",
      group: buildHingeArm(),
      assembled: { pos: V(0, 0, 0), rot: V(0, 0, 0) },
      exploded: { pos: V(0, -0.4, 0.4), rot: V(0, 0.08, 0) },
      range: [0.27, 0.42],
      label: { tr: "Menteşe Kolu", en: "Hinge Arm" },
    },
    {
      name: "cup",
      group: buildHingeCup(),
      assembled: { pos: V(3.0, 0, 0), rot: V(0, 0, 0) },
      exploded: { pos: V(6.9, -0.4, 1.3), rot: V(0, -0.18, 0) },
      range: [0.27, 0.42],
      label: { tr: "Ø35mm Kapak", en: "Ø35mm Cup" },
    },
    {
      name: "plateScrews",
      group: twinScrewGroup({ shaftLen: 1.1, shaftR: 0.13, headR: 0.27, headLen: 0.2 }, 1.35, "z"),
      assembled: { pos: V(-2.8, -1.05, 0), rot: V(0, 0, 0) },
      exploded: { pos: V(-9.2, -1.05, 0), rot: V(0, 0, 0) },
      range: [0.46, 0.6],
      label: { tr: "Sabitleme Vidaları", en: "Mounting Screws" },
      labelOffset: V(0, 0, 1.35),
    },
    {
      name: "cupScrews",
      group: twinScrewGroup({ shaftLen: 1.0, shaftR: 0.1, headR: 0.2, headLen: 0.16 }, 1.55, "y"),
      assembled: { pos: V(3.78, 0, 0), rot: V(0, 0, 0) },
      exploded: { pos: V(9.4, 0, 1.7), rot: V(0, 0, 0) },
      range: [0.46, 0.6],
      label: { tr: "Kapak Vidaları", en: "Cup Screws" },
      labelOffset: V(0, 1.55, 0),
    },
    {
      name: "adjHeight",
      group: buildScrew({ shaftLen: 1.6, shaftR: 0.12, headR: 0.24, headLen: 0.18, accent: true }),
      assembled: { pos: V(1.55, 0.95, 0), rot: V(0, 0, Math.PI / 2) },
      exploded: { pos: V(1.55, 2.5, 0), rot: V(0, 0, Math.PI / 2) },
      range: [0.48, 0.62],
      label: { tr: "Yükseklik Ayarı", en: "Height Adjustment" },
    },
    {
      name: "adjSide",
      group: buildScrew({ shaftLen: 1.6, shaftR: 0.12, headR: 0.24, headLen: 0.18, accent: true }),
      assembled: { pos: V(1.85, 0.55, 0.3), rot: V(Math.PI / 2, 0, 0) },
      exploded: { pos: V(1.85, 0.55, 3.6), rot: V(Math.PI / 2, 0, 0) },
      range: [0.53, 0.67],
      label: { tr: "Yan Ayar", en: "Side Adjustment" },
    },
    {
      name: "adjDepth",
      group: buildScrew({ shaftLen: 1.6, shaftR: 0.12, headR: 0.24, headLen: 0.18, accent: true }),
      assembled: { pos: V(1.95, -0.55, 0), rot: V(0, 0, 0) },
      exploded: { pos: V(4.9, -0.55, -2.7), rot: V(0, 0, 0) },
      range: [0.58, 0.72],
      label: { tr: "Derinlik Ayarı", en: "Depth Adjustment" },
    },
    {
      name: "spring",
      group: buildSpring(),
      assembled: { pos: V(1.7, 0, 0), rot: V(0, 0, 0) },
      exploded: { pos: V(1.4, 3.4, 2.1), rot: V(0.35, 0.25, 0) },
      range: [0.68, 0.82],
      label: { tr: "Yaylı Yumuşak Kapanma", en: "Soft-Close Spring" },
    },
  ];

  PARTS.forEach((p) => {
    p.group.position.copy(p.assembled.pos);
    p.group.rotation.set(p.assembled.rot.x, p.assembled.rot.y, p.assembled.rot.z);
    rig.add(p.group);
  });

  rig.scale.setScalar(0.62);

  /* ---------- Cabinet door cold-open ---------- */
  const cabinetGroup = new THREE.Group();
  cabinetGroup.rotation.y = 0.35;
  cabinetGroup.scale.setScalar(0.62);
  scene.add(cabinetGroup);

  const carcass = buildCabinetCarcass();
  cabinetGroup.add(carcass);

  const doorPivot = new THREE.Group();
  doorPivot.add(buildCabinetDoor());
  cabinetGroup.add(doorPivot);

  const cabinetMaterials = [matDoorFront, matCarcassOuter, matCarcassInner];
  const rigMaterials = [matSteelLight, matSteelMid, matSteelDark, matScrew, matSlot, matSpring, matAccent];
  rigMaterials.forEach((m) => {
    m.transparent = true;
    m.opacity = 0;
  });

  const DOOR_CLOSE_END = 0.11;
  const CABINET_FADE = [0.1, 0.19];
  const RIG_FADE = [0.11, 0.21];

  /* ---------- Camera path ---------- */
  const CAM_KEYS = [
    { p: 0.0, pos: [0, 1.3, 7.4], look: [0, 0, 0] },
    { p: 0.12, pos: [0, 1.3, 7.4], look: [0, 0, 0] },
    { p: 0.27, pos: [0.4, 0.6, 4.6], look: [0, 0, 0] },
    { p: 0.46, pos: [1.0, 0.7, 5.4], look: [0.2, 0.1, 0] },
    { p: 0.68, pos: [1.4, 1.1, 6.0], look: [0.6, 0.4, 0] },
    { p: 0.86, pos: [0.4, 1.5, 6.2], look: [0.4, 1.0, 0] },
    { p: 1.0, pos: [0, 0.7, 9.6], look: [0, 0.4, 0] },
  ];

  function updateCamera(progress) {
    let i = 0;
    while (i < CAM_KEYS.length - 2 && progress > CAM_KEYS[i + 1].p) i++;
    const a = CAM_KEYS[i],
      b = CAM_KEYS[i + 1];
    const span = b.p - a.p;
    const t = span <= 0 ? 0 : smooth((progress - a.p) / span);
    camera.position.set(lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t));
    camera.lookAt(lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t));
  }

  /* ---------- Scroll-driven state ---------- */
  const state = { progress: 0, smooth: 0 };

  function partT(part, progress) {
    const [s, e] = part.range;
    return clamp01((progress - s) / (e - s));
  }

  function updateParts(progress) {
    PARTS.forEach((p) => {
      const t = smooth(partT(p, progress));
      p.group.position.lerpVectors(p.assembled.pos, p.exploded.pos, t);
      p.group.rotation.set(
        lerp(p.assembled.rot.x, p.exploded.rot.x, t),
        lerp(p.assembled.rot.y, p.exploded.rot.y, t),
        lerp(p.assembled.rot.z, p.exploded.rot.z, t)
      );
    });
  }

  function updateCabinet(progress) {
    const closeT = smooth(clamp01(progress / DOOR_CLOSE_END));
    doorPivot.rotation.y = lerp(-Math.PI / 2, 0, closeT);

    const fadeT = smooth(clamp01((progress - CABINET_FADE[0]) / (CABINET_FADE[1] - CABINET_FADE[0])));
    const cabOpacity = 1 - fadeT;
    cabinetMaterials.forEach((m) => (m.opacity = cabOpacity));
    cabinetGroup.visible = cabOpacity > 0.002;

    const rigT = smooth(clamp01((progress - RIG_FADE[0]) / (RIG_FADE[1] - RIG_FADE[0])));
    rigMaterials.forEach((m) => (m.opacity = rigT));
  }

  /* ---------- Labels ---------- */
  const labelsContainer = document.getElementById("labels");
  const labelEls = {};
  PARTS.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "hx-label";
    el.innerHTML = `<span class="dot"></span><span class="txt"><span class="num">${String(i + 1).padStart(2, "0")}</span><span class="lang-tr">${p.label.tr}</span><span class="lang-en">${p.label.en}</span></span>`;
    labelsContainer.appendChild(el);
    labelEls[p.name] = el;
  });

  const tmpVec = new THREE.Vector3();
  function updateLabels() {
    const w = window.innerWidth,
      h = window.innerHeight;
    PARTS.forEach((p) => {
      const t = partT(p, state.smooth);
      const fade = smooth(t / 0.4 > 1 ? 1 : t / 0.4);
      const el = labelEls[p.name];
      el.style.opacity = fade;
      if (fade < 0.02) return;
      p.group.getWorldPosition(tmpVec);
      if (p.labelOffset) {
        const off = p.labelOffset.clone().applyQuaternion(rig.quaternion).multiplyScalar(rig.scale.x);
        tmpVec.add(off);
      }
      tmpVec.project(camera);
      const x = (tmpVec.x * 0.5 + 0.5) * w;
      const y = (-tmpVec.y * 0.5 + 0.5) * h;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  }

  /* ---------- Chapters ---------- */
  const CHAPTERS = [
    { start: 0.0, end: 0.12 },
    { start: 0.12, end: 0.27 },
    { start: 0.27, end: 0.46 },
    { start: 0.46, end: 0.68 },
    { start: 0.68, end: 0.86 },
    { start: 0.86, end: 1.0 },
  ];
  const chapterEls = Array.from(document.querySelectorAll(".hx-chapter"));
  const dotEls = Array.from(document.querySelectorAll(".hx-progress span"));

  function updateChapters(progress) {
    let active = CHAPTERS.length - 1;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (progress >= CHAPTERS[i].start && progress < CHAPTERS[i].end) {
        active = i;
        break;
      }
    }
    chapterEls.forEach((el, i) => el.classList.toggle("visible", i === active));
    dotEls.forEach((el, i) => el.classList.toggle("active", i === active));
  }

  /* ---------- Hero video (real product cold-open) ---------- */
  const heroVideo = document.getElementById("heroVideo");
  const heroVideoOverlay = document.getElementById("heroVideoOverlay");
  const HERO_VIDEO_FADE = 0.1;
  function updateHeroVideo(progress) {
    const opacity = 1 - smooth(clamp01(progress / HERO_VIDEO_FADE));
    heroVideo.style.opacity = String(opacity);
    heroVideoOverlay.style.opacity = String(opacity);
    if (opacity < 0.01) {
      heroVideo.style.visibility = "hidden";
      heroVideoOverlay.style.visibility = "hidden";
      if (!heroVideo.paused) heroVideo.pause();
    } else {
      heroVideo.style.visibility = "visible";
      heroVideoOverlay.style.visibility = "visible";
      if (heroVideo.paused) heroVideo.play().catch(() => {});
    }
  }

  /* ---------- Render loop ---------- */
  function animate(time) {
    requestAnimationFrame(animate);
    state.smooth += (state.progress - state.smooth) * 0.085;
    updateParts(state.smooth);
    updateCabinet(state.smooth);
    updateCamera(state.smooth);
    rig.rotation.y = -0.55 + state.smooth * 0.55 + Math.sin(time * 0.00018) * 0.04;
    updateLabels();
    updateChapters(state.smooth);
    updateHeroVideo(state.smooth);
    renderer.render(scene, camera);
  }

  /* ---------- Resize ---------- */
  function onResize() {
    const w = window.innerWidth,
      h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);
  onResize();

  /* ---------- ScrollTrigger ---------- */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: "#pinWrap",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.3,
    onUpdate: (self) => {
      state.progress = self.progress;
    },
  });

  /* ---------- Language switch ---------- */
  const langButtons = document.querySelectorAll("[data-lang]");
  function setLang(lang) {
    document.documentElement.classList.toggle("lang-en", lang === "en");
    document.documentElement.lang = lang;
    document.title = lang === "en" ? TITLE_EN : TITLE_TR;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", lang === "en" ? DESC_EN : DESC_TR);
    langButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
    localStorage.setItem("formtrade-lang", lang);
  }
  langButtons.forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));
  const savedLang = localStorage.getItem("formtrade-lang");
  const browserLang = navigator.language?.toLowerCase().startsWith("en") ? "en" : "tr";
  setLang(savedLang || browserLang);

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loaderFill");
  requestAnimationFrame(() => {
    loaderFill.style.width = "100%";
    setTimeout(() => loader.classList.add("hidden"), 450);
  });

  animate(0);
})();
