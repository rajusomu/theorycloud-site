"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Sparkles } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useCanvasLoop } from "./use-canvas-loop";
import { useTheme } from "../theme";

/*
 * Hero: AI agents building software on Theory Cloud, as a Lego build.
 * Four builder bots (coding, test, review, deploy) hover around a Theory Cloud baseplate.
 * Each one carries studded bricks in on a beam, lines them up above their spot and snaps
 * them down. The bricks interlock layer by layer into an app: data at the bottom, services
 * in the middle, interface on top. When it's finished the baseplate glows teal (verified),
 * the bricks lift away, and the build starts again.
 * Hover a bot to see its job and route; click it to hand it more bricks.
 */

const LEVELS = [
  { name: "Data", color: "#ff9f6b" },
  { name: "Services", color: "#5546ff" },
  { name: "Interface", color: "#c13cff" },
];
const AGENTS = [
  { who: "Coding agent", task: "Writing services", route: "acme/agents/coder", color: "#5546ff" },
  { who: "Test agent", task: "Running contract checks", route: "acme/agents/tester", color: "#14b8a6" },
  { who: "Review agent", task: "Reviewing changes", route: "acme/agents/reviewer", color: "#c13cff" },
  { who: "Deploy agent", task: "Shipping to AWS", route: "acme/agents/deployer", color: "#ff9f6b" },
];

/* Lego proportions: brick height is 1.2 × stud pitch; studs are 0.6 pitch across */
const U = 0.3; // stud pitch
const H = 0.36; // brick height
const STUD_R = 0.09;
const STUD_H = 0.07;
const PLATE = 10; // baseplate is 10 × 10 studs
const OFFSET = 2; // structure footprint starts 2 studs in
const BASE_TOP = -1.1;
const VERIFIED = new THREE.Color("#14b8a6");

/*
 * The structure, brick by brick: x/z is the corner stud, w/d the size in studs, layer the
 * height. Layers alternate direction so the bricks overlap and lock together, like a real
 * build. Layer 0–1 data, 2–3 services, 4–5 interface.
 */
type BrickDef = { x: number; z: number; w: number; d: number; layer: number };
const PLAN: BrickDef[] = [
  // data
  { x: 0, z: 0, w: 4, d: 2, layer: 0 }, { x: 4, z: 0, w: 2, d: 2, layer: 0 },
  { x: 0, z: 2, w: 2, d: 2, layer: 0 }, { x: 2, z: 2, w: 4, d: 2, layer: 0 },
  { x: 0, z: 4, w: 4, d: 2, layer: 0 }, { x: 4, z: 4, w: 2, d: 2, layer: 0 },
  { x: 0, z: 0, w: 2, d: 4, layer: 1 }, { x: 0, z: 4, w: 2, d: 2, layer: 1 },
  { x: 2, z: 0, w: 2, d: 2, layer: 1 }, { x: 2, z: 2, w: 2, d: 4, layer: 1 },
  { x: 4, z: 0, w: 2, d: 4, layer: 1 }, { x: 4, z: 4, w: 2, d: 2, layer: 1 },
  // services
  { x: 1, z: 1, w: 4, d: 2, layer: 2 }, { x: 1, z: 3, w: 4, d: 2, layer: 2 },
  { x: 1, z: 1, w: 2, d: 4, layer: 3 }, { x: 3, z: 1, w: 2, d: 4, layer: 3 },
  // interface
  { x: 1, z: 2, w: 4, d: 2, layer: 4 },
  { x: 2, z: 2, w: 2, d: 2, layer: 5 },
];
const levelOf = (layer: number) => Math.min(LEVELS.length - 1, Math.floor(layer / 2));

function brickCenter(b: BrickDef) {
  return new THREE.Vector3(
    (OFFSET + b.x + b.w / 2 - PLATE / 2) * U,
    BASE_TOP + b.layer * H + H / 2,
    (OFFSET + b.z + b.d / 2 - PLATE / 2) * U,
  );
}

/* Bottom layer first; random order within each layer so every build looks different */
function buildOrder() {
  const layers = Math.max(...PLAN.map((b) => b.layer)) + 1;
  const order: number[] = [];
  for (let l = 0; l < layers; l++) {
    const idx = PLAN.map((b, i) => (b.layer === l ? i : -1)).filter((i) => i >= 0);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    order.push(...idx);
  }
  return order;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/* ── A Lego brick: rounded body plus studs on top ── */
function Brick({ def, color, refCb, matCb, studGeo }: { def: BrickDef; color: string; refCb: (g: THREE.Group | null) => void; matCb: (m: THREE.MeshPhysicalMaterial | null) => void; studGeo: THREE.CylinderGeometry }) {
  const studs = useMemo(() => {
    const s: [number, number, number][] = [];
    for (let i = 0; i < def.w; i++) for (let j = 0; j < def.d; j++) s.push([(i + 0.5 - def.w / 2) * U, H / 2 + STUD_H / 2, (j + 0.5 - def.d / 2) * U]);
    return s;
  }, [def]);
  return (
    <group ref={refCb} visible={false}>
      <RoundedBox args={[def.w * U - 0.014, H - 0.012, def.d * U - 0.014]} radius={0.022} smoothness={2}>
        <meshPhysicalMaterial ref={matCb} color={color} roughness={0.32} clearcoat={0.7} clearcoatRoughness={0.25} emissive={color} emissiveIntensity={0} />
      </RoundedBox>
      {studs.map((p, k) => (
        <mesh key={k} geometry={studGeo} position={p}>
          <meshPhysicalMaterial color={color} roughness={0.32} clearcoat={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Theory Cloud baseplate: a studded Lego plate ── */
function Baseplate({ dark, matRef }: { dark: boolean; matRef: React.RefObject<THREE.MeshPhysicalMaterial | null> }) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const color = dark ? "#262d58" : "#e4e1ff";
  useLayoutEffect(() => {
    const m = inst.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let k = 0;
    for (let i = 0; i < PLATE; i++)
      for (let j = 0; j < PLATE; j++) {
        o.position.set((i + 0.5 - PLATE / 2) * U, BASE_TOP + STUD_H / 2, (j + 0.5 - PLATE / 2) * U);
        o.updateMatrix();
        m.setMatrixAt(k++, o.matrix);
      }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group>
      <RoundedBox args={[PLATE * U, 0.12, PLATE * U]} radius={0.04} position={[0, BASE_TOP - 0.06, 0]}>
        <meshPhysicalMaterial ref={matRef} color={color} roughness={0.4} clearcoat={0.6} />
      </RoundedBox>
      <instancedMesh ref={inst} args={[undefined, undefined, PLATE * PLATE]}>
        <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.6} />
      </instancedMesh>
    </group>
  );
}

/* ── Builder bot: rounded body, dark visor with glowing eyes, antenna and hover-thruster ── */
function Bot({ color, dark }: { color: string; dark: boolean }) {
  const eyes = useRef<THREE.Group>(null);
  const shell = dark ? "#dfe3f2" : "#f7f8fc";
  useFrame((s) => {
    // blink every few seconds
    const t = s.clock.elapsedTime % 3.6;
    if (eyes.current) eyes.current.scale.y = t > 3.45 ? 0.15 : 1;
  });
  return (
    <group>
      {/* body */}
      <mesh scale={[1, 0.86, 1]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhysicalMaterial color={shell} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* coloured band */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <torusGeometry args={[0.195, 0.018, 12, 48]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={1} emissive={color} emissiveIntensity={0.25} />
      </mesh>
      {/* visor */}
      <RoundedBox args={[0.25, 0.11, 0.08]} radius={0.04} position={[0, 0.04, 0.155]}>
        <meshPhysicalMaterial color="#0b0f1a" roughness={0.1} clearcoat={1} />
      </RoundedBox>
      <group ref={eyes} position={[0, 0.04, 0.198]}>
        {[-0.055, 0.055].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>
      {/* antenna */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
        <meshBasicMaterial color={shell} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* side pods */}
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * 0.215, -0.02, 0]} scale={[0.6, 1, 1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshPhysicalMaterial color={shell} roughness={0.25} clearcoat={1} />
        </mesh>
      ))}
      {/* hover thruster */}
      <mesh position={[0, -0.185, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.016, 12, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

type Brk = { state: 0 | 1 | 2 | 3; t: number; from: THREE.Vector3; agent: number; spin: number; flash: number };

function Scene({ dark, labelRoot }: { dark: boolean; labelRoot: React.RefObject<HTMLDivElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const baseMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const agentRefs = useRef<(THREE.Group | null)[]>([]);
  const brickRefs = useRef<(THREE.Group | null)[]>([]);
  const brickMats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  hoveredRef.current = hovered;

  const studGeo = useMemo(() => new THREE.CylinderGeometry(STUD_R, STUD_R, STUD_H, 16), []);
  useEffect(() => () => studGeo.dispose(), [studGeo]);

  const targets = useMemo(() => PLAN.map(brickCenter), []);
  const bricks = useRef<Brk[]>(PLAN.map(() => ({ state: 0, t: 0, from: new THREE.Vector3(), agent: 0, spin: 0, flash: 0 })));
  const carrying = useRef<number[]>(AGENTS.map(() => -1));
  const order = useRef(buildOrder());
  const next = useRef(0);
  const spawnTimer = useRef(0);
  const rr = useRef(0);
  const phase = useRef<{ kind: "build" | "hold" | "clear"; t: number }>({ kind: "build", t: 0 });
  const drift = useRef(0);
  const verify = useRef(0);

  // Tractor beams from each bot to the brick it's carrying
  const beams = useMemo(
    () =>
      AGENTS.map((a) => {
        const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
        return new THREE.Line(g, new THREE.LineBasicMaterial({ color: a.color, transparent: true, opacity: 0 }));
      }),
    [],
  );
  useEffect(() => () => beams.forEach((l) => l.geometry.dispose()), [beams]);

  const agentPos = (i: number, t: number, out: THREE.Vector3) => {
    const a = (i / AGENTS.length) * Math.PI * 2 + t * 0.2;
    return out.set(Math.cos(a) * 2.35, 1.35 + Math.sin(t * 1.4 + i * 1.7) * 0.18, Math.sin(a) * 2.35);
  };

  const launch = (agent: number) => {
    if (phase.current.kind !== "build" || next.current >= PLAN.length) return;
    const i = order.current[next.current++];
    const b = bricks.current[i];
    const g = agentRefs.current[agent];
    b.state = 1;
    b.t = 0;
    b.agent = agent;
    b.spin = (Math.random() < 0.5 ? -1 : 1) * Math.PI * (0.5 + Math.random());
    b.from.copy(g ? g.position : new THREE.Vector3(0, 2, 0)).add(new THREE.Vector3(0, -0.32, 0));
    carrying.current[agent] = i;
  };

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const ctrl = useMemo(() => new THREE.Vector3(), []);
  const hover = useMemo(() => new THREE.Vector3(), []);
  const center = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05);
    const frozen = hoveredRef.current !== null;
    if (!frozen) drift.current += dt;
    const t = drift.current;

    const g = group.current;
    if (g) {
      // keep the tilt within the canvas range
      const px = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
      const py = THREE.MathUtils.clamp(state.pointer.y, -1, 1);
      g.rotation.y += (px * 0.3 + t * 0.05 - g.rotation.y) * 0.04;
      g.rotation.x += (-py * 0.1 - g.rotation.x) * 0.04;
    }

    // Bots hover around the build and keep facing it
    AGENTS.forEach((_, i) => {
      const ag = agentRefs.current[i];
      if (!ag) return;
      agentPos(i, t, ag.position);
      center.set(0, ag.position.y - 0.4, 0);
      ag.lookAt(center);
    });

    // Build loop
    const ph = phase.current;
    ph.t += dt;
    if (ph.kind === "build" && !frozen) {
      spawnTimer.current += dt;
      if (spawnTimer.current > 0.55) {
        spawnTimer.current = 0;
        launch(rr.current++ % AGENTS.length);
      }
    }

    let flying = 0;
    let placed = 0;
    bricks.current.forEach((b, i) => {
      const m = brickRefs.current[i];
      const mat = brickMats.current[i];
      if (!m) return;
      if (b.state === 0) {
        m.visible = false;
        return;
      }
      m.visible = true;
      const target = targets[i];
      if (b.state === 1) {
        flying++;
        b.t = Math.min(1, b.t + dt / 1.5);
        hover.copy(target).setY(target.y + 0.75);
        if (b.t < 0.72) {
          // carried along a curve to a spot just above its place
          const u = ease(b.t / 0.72);
          ctrl.copy(b.from).lerp(hover, 0.5);
          ctrl.y = Math.max(b.from.y, hover.y) + 0.6;
          const v = 1 - u;
          m.position.copy(b.from).multiplyScalar(v * v).add(tmp.copy(ctrl).multiplyScalar(2 * v * u)).add(tmp.copy(hover).multiplyScalar(u * u));
          m.rotation.y = b.spin * (1 - u);
          m.scale.setScalar(0.7 + u * 0.3);
        } else {
          // lined up, then dropped onto the studs below
          const v = (b.t - 0.72) / 0.28;
          m.position.copy(hover).setY(hover.y + (target.y - hover.y) * v * v);
          m.rotation.y = 0;
          m.scale.setScalar(1);
        }
        if (b.t >= 1) {
          b.state = 2;
          b.t = 0;
          b.flash = 1;
          if (carrying.current[b.agent] === i) carrying.current[b.agent] = -1;
        }
      } else if (b.state === 2) {
        placed++;
        b.t += dt;
        m.position.copy(target);
        // snap: a quick squash as it clicks into place
        const sq = Math.max(0, 0.12 - b.t * 0.8) * Math.sin(b.t * 40);
        m.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
      } else if (b.state === 3) {
        b.t += dt * 1.6;
        const lt = Math.max(0, b.t); // negative t = waiting for the layers above to lift first
        m.position.copy(target).setY(target.y + lt * lt * 2.2);
        m.scale.setScalar(Math.max(0, 1 - lt));
        if (b.t >= 1) b.state = 0;
      }
      b.flash = Math.max(0, b.flash - dt * 2.5);
      if (mat) mat.emissiveIntensity = b.flash * 0.55;
    });

    // Beams follow carried bricks
    AGENTS.forEach((_, a) => {
      const line = beams[a];
      const mat = line.material as THREE.LineBasicMaterial;
      const ci = carrying.current[a];
      const ag = agentRefs.current[a];
      const bm = ci >= 0 ? brickRefs.current[ci] : null;
      if (ag && bm && bricks.current[ci].state === 1 && bricks.current[ci].t < 0.72) {
        const pos = line.geometry.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(0, ag.position.x, ag.position.y - 0.2, ag.position.z);
        pos.setXYZ(1, bm.position.x, bm.position.y, bm.position.z);
        pos.needsUpdate = true;
        mat.opacity = 0.65;
      } else {
        mat.opacity = Math.max(0, mat.opacity - dt * 3);
      }
    });

    if (ph.kind === "build" && placed === PLAN.length && flying === 0) {
      phase.current = { kind: "hold", t: 0 };
      verify.current = 1;
    } else if (ph.kind === "hold" && ph.t > 2) {
      phase.current = { kind: "clear", t: 0 };
      // lift off top-down
      bricks.current.forEach((b, i) => {
        b.state = 3;
        b.t = -(5 - PLAN[i].layer) * 0.08;
      });
    } else if (ph.kind === "clear" && ph.t > 1.3) {
      bricks.current.forEach((b) => (b.state = 0));
      order.current = buildOrder();
      next.current = 0;
      phase.current = { kind: "build", t: 0 };
    }

    verify.current = Math.max(0, verify.current - dt * 0.5);
    if (baseMat.current) {
      baseMat.current.emissive.copy(VERIFIED);
      baseMat.current.emissiveIntensity = verify.current * 0.8;
    }
  });

  return (
    <group ref={group}>
      <Baseplate dark={dark} matRef={baseMat} />

      {beams.map((l, i) => (
        <primitive key={i} object={l} />
      ))}

      {PLAN.map((def, i) => (
        <Brick
          key={i}
          def={def}
          color={LEVELS[levelOf(def.layer)].color}
          studGeo={studGeo}
          refCb={(g) => {
            brickRefs.current[i] = g;
          }}
          matCb={(m) => {
            brickMats.current[i] = m;
          }}
        />
      ))}

      {AGENTS.map((a, i) => (
        <group key={a.who} ref={(g) => { agentRefs.current[i] = g; }}>
          {/* invisible, larger hover/click target */}
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(i);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHovered(null);
              document.body.style.cursor = "";
            }}
            onClick={(e) => {
              e.stopPropagation();
              for (let k = 0; k < 3; k++) launch(i);
            }}
          >
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <group scale={hovered === i ? 1.6 : 1.35}>
            <Bot color={a.color} dark={dark} />
          </group>
          {hovered === i && (
            <Html
              center
              distanceFactor={9}
              style={{ pointerEvents: "none" }}
              // mount the label in the scene's own box so it always lands next to the bot
              portal={labelRoot as React.RefObject<HTMLElement>}
            >
              <div className="-translate-y-14 whitespace-nowrap rounded-xl border border-line bg-paper/95 px-3 py-2 text-left shadow-xl shadow-black/10 backdrop-blur">
                <div className="text-[13px] font-semibold text-ink">{a.who}</div>
                <div className="text-[12px] text-slate">{a.task}</div>
                <div className="mt-0.5 font-mono text-[10.5px] text-slate">theorymcp.ai/{a.route}/mcp</div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const { ref, frameloop } = useCanvasLoop<HTMLDivElement>();
  const [theme] = useTheme();

  // The scene sits above the header (z-index 60). Once it scrolls up under the header it
  // stops catching the pointer, so header links stay clickable; otherwise bots are interactive.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const HEADER = 64;
    const onScroll = () => {
      el.style.pointerEvents = el.getBoundingClientRect().top < HEADER ? "none" : "";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  return (
    <div ref={ref} className="relative h-full w-full">
      <Canvas
        frameloop={frameloop} dpr={[1, 1.75]} camera={{ position: [6.2, 4.4, 8.2], fov: 32 }} gl={{ antialias: true, alpha: true }} onCreated={({ camera }) => camera.lookAt(0, -0.05, 0)}>
        <ambientLight intensity={theme === "dark" ? 0.6 : 0.95} />
        <directionalLight position={[4, 7, 5]} intensity={1.8} />
        <directionalLight position={[-5, 3, -3]} intensity={0.6} color="#c13cff" />
        <Scene dark={theme === "dark"} labelRoot={ref} />
        <Sparkles count={50} scale={[9, 5, 7]} size={2} speed={0.25} color="#5546ff" opacity={0.35} />
      </Canvas>

      {/* Legend: plain DOM so it stays crisp and readable */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap rounded-full border border-paper/80 bg-paper/70 px-4 py-2 text-[12px] text-slate backdrop-blur">
        {[...LEVELS].reverse().map((l) => (
          <span key={l.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} /> {l.name}
          </span>
        ))}
        <span className="hidden sm:inline">Hover a bot · click to assign bricks</span>
      </div>
    </div>
  );
}
