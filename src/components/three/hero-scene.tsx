"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useCanvasLoop } from "./use-canvas-loop";
import { useTheme } from "../theme";

/*
 * Hero: AI agents building software on Theory Cloud.
 * Four agents (coding, test, review, deploy) orbit a Theory Cloud base, each connected to it.
 * They carry components in and assemble an app layer by layer: data, then services, then
 * interface. When the app is complete it's verified (the base glows teal), then it clears
 * and the build starts again. Hover an agent to see its job; click it to hand it more work.
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

const GRID = 3;
const STEP = 0.56;
const BLOCK = 0.46;
const BASE_TOP = -1.1;
const SLOTS = GRID * GRID * LEVELS.length;
const VERIFIED = new THREE.Color("#14b8a6");

type Block = { state: 0 | 1 | 2 | 3; t: number; from: THREE.Vector3; agent: number };

function slotPos(i: number) {
  const level = Math.floor(i / (GRID * GRID));
  const k = i % (GRID * GRID);
  const x = (k % GRID) - 1;
  const z = Math.floor(k / GRID) - 1;
  return new THREE.Vector3(x * STEP, BASE_TOP + BLOCK / 2 + 0.02 + level * (BLOCK + 0.04), z * STEP);
}

/* Fill bottom level first; random order within each level so every build looks different */
function buildOrder() {
  const order: number[] = [];
  for (let l = 0; l < LEVELS.length; l++) {
    const lvl = Array.from({ length: GRID * GRID }, (_, k) => l * GRID * GRID + k);
    for (let i = lvl.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lvl[i], lvl[j]] = [lvl[j], lvl[i]];
    }
    order.push(...lvl);
  }
  return order;
}

function Scene({ dark }: { dark: boolean }) {
  const group = useRef<THREE.Group>(null);
  const baseMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const agentRefs = useRef<(THREE.Group | null)[]>([]);
  const blockRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  hoveredRef.current = hovered;

  const slots = useMemo(() => Array.from({ length: SLOTS }, (_, i) => slotPos(i)), []);
  const blocks = useRef<Block[]>(Array.from({ length: SLOTS }, () => ({ state: 0, t: 0, from: new THREE.Vector3(), agent: 0 })));
  const order = useRef(buildOrder());
  const next = useRef(0);
  const spawnTimer = useRef(0);
  const rr = useRef(0);
  const phase = useRef<{ kind: "build" | "hold" | "clear"; t: number }>({ kind: "build", t: 0 });
  const drift = useRef(0);
  const verify = useRef(0);

  // Connection lines from each agent down to the base (updated every frame)
  const links = useMemo(
    () =>
      AGENTS.map((a) => {
        const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
        return new THREE.Line(g, new THREE.LineBasicMaterial({ color: a.color, transparent: true, opacity: 0.35 }));
      }),
    [],
  );
  useEffect(() => () => links.forEach((l) => l.geometry.dispose()), [links]);

  const agentPos = (i: number, t: number, out: THREE.Vector3) => {
    const a = (i / AGENTS.length) * Math.PI * 2 + t * 0.22;
    return out.set(Math.cos(a) * 2.3, 1.15 + Math.sin(t * 1.3 + i) * 0.2, Math.sin(a) * 2.3);
  };

  const launch = (agent: number) => {
    if (phase.current.kind !== "build" || next.current >= SLOTS) return;
    const slot = order.current[next.current++];
    const b = blocks.current[slot];
    const g = agentRefs.current[agent];
    b.state = 1;
    b.t = 0;
    b.agent = agent;
    b.from.copy(g ? g.position : new THREE.Vector3(0, 2, 0));
  };

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const ctrl = useMemo(() => new THREE.Vector3(), []);
  const pt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const frozen = hoveredRef.current !== null;
    if (!frozen) drift.current += dt;
    const t = drift.current;

    // Pointer tilts the scene gently
    const g = group.current;
    if (g) {
      g.rotation.y += (state.pointer.x * 0.3 + t * 0.05 - g.rotation.y) * 0.04;
      g.rotation.x += (-state.pointer.y * 0.12 - g.rotation.x) * 0.04;
    }

    // Agents orbit; lines connect them to the base
    AGENTS.forEach((_, i) => {
      const ag = agentRefs.current[i];
      if (!ag) return;
      agentPos(i, t, ag.position);
      ag.rotation.y += dt * 1.2;
      const pos = links[i].geometry.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, ag.position.x, ag.position.y, ag.position.z);
      pos.setXYZ(1, 0, BASE_TOP, 0);
      pos.needsUpdate = true;
    });

    // Build loop
    const ph = phase.current;
    ph.t += dt;
    if (ph.kind === "build" && !frozen) {
      spawnTimer.current += dt;
      if (spawnTimer.current > 0.3) {
        spawnTimer.current = 0;
        launch(rr.current++ % AGENTS.length);
      }
    }

    let flying = 0;
    let placed = 0;
    blocks.current.forEach((b, i) => {
      const m = blockRefs.current[i];
      if (!m) return;
      if (b.state === 0) {
        m.visible = false;
        return;
      }
      m.visible = true;
      if (b.state === 1) {
        flying++;
        b.t = Math.min(1, b.t + dt * 1.15);
        const s = slots[i];
        ctrl.copy(b.from).lerp(s, 0.5);
        ctrl.y = Math.max(b.from.y, s.y) + 1;
        // quadratic Bézier from the agent to the slot
        const u = 1 - b.t;
        pt.copy(b.from).multiplyScalar(u * u).add(tmp.copy(ctrl).multiplyScalar(2 * u * b.t)).add(tmp.copy(s).multiplyScalar(b.t * b.t));
        m.position.copy(pt);
        m.scale.setScalar(0.55 + b.t * 0.45);
        m.rotation.y = (1 - b.t) * 2.5;
        if (b.t >= 1) {
          b.state = 2;
          b.t = 0;
        }
      } else if (b.state === 2) {
        placed++;
        b.t += dt;
        m.position.copy(slots[i]);
        m.rotation.y = 0;
        // small landing bounce
        m.scale.setScalar(1 + Math.max(0, 0.14 - b.t * 0.6) * Math.sin(b.t * 30));
      } else if (b.state === 3) {
        b.t += dt * 2.2;
        m.scale.setScalar(Math.max(0, 1 - b.t));
        if (b.t >= 1) b.state = 0;
      }
    });

    if (ph.kind === "build" && placed === SLOTS && flying === 0) {
      phase.current = { kind: "hold", t: 0 };
      verify.current = 1;
    } else if (ph.kind === "hold" && ph.t > 1.8) {
      phase.current = { kind: "clear", t: 0 };
      blocks.current.forEach((b) => {
        b.state = 3;
        b.t = 0;
      });
    } else if (ph.kind === "clear" && ph.t > 0.7) {
      blocks.current.forEach((b) => (b.state = 0));
      order.current = buildOrder();
      next.current = 0;
      phase.current = { kind: "build", t: 0 };
    }

    // Base glows teal while the finished app is verified
    verify.current = Math.max(0, verify.current - dt * 0.55);
    if (baseMat.current) {
      baseMat.current.emissive.copy(VERIFIED);
      baseMat.current.emissiveIntensity = verify.current * 0.9;
    }
  });

  return (
    <group ref={group}>
      {/* Theory Cloud base */}
      <RoundedBox args={[2.5, 0.22, 2.5]} radius={0.08} position={[0, BASE_TOP - 0.11, 0]}>
        <meshPhysicalMaterial ref={baseMat} color={dark ? "#232a52" : "#e2dfff"} roughness={0.3} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, BASE_TOP - 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.012, 8, 160]} />
        <meshBasicMaterial color="#5546ff" transparent opacity={0.5} />
      </mesh>

      {links.map((l, i) => (
        <primitive key={i} object={l} />
      ))}

      {/* Components being assembled */}
      {slots.map((_, i) => (
        <mesh key={i} ref={(m) => { blockRefs.current[i] = m; }} visible={false}>
          <boxGeometry args={[BLOCK, BLOCK, BLOCK]} />
          <meshPhysicalMaterial color={LEVELS[Math.floor(i / (GRID * GRID))].color} roughness={0.25} clearcoat={1} emissive={LEVELS[Math.floor(i / (GRID * GRID))].color} emissiveIntensity={0.12} />
        </mesh>
      ))}

      {/* Agents */}
      {AGENTS.map((a, i) => (
        <group key={a.who} ref={(g) => { agentRefs.current[i] = g; }}>
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
          <mesh scale={hovered === i ? 1.25 : 1}>
            <icosahedronGeometry args={[0.2, 1]} />
            <meshPhysicalMaterial color={a.color} roughness={0.2} clearcoat={1} emissive={a.color} emissiveIntensity={0.3} flatShading />
          </mesh>
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.32, 0.018, 8, 48]} />
            <meshBasicMaterial color={a.color} transparent opacity={0.7} />
          </mesh>
          {hovered === i && (
            <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
              <div className="-translate-y-12 whitespace-nowrap rounded-xl border border-line bg-paper/95 px-3 py-2 text-left shadow-xl shadow-black/10 backdrop-blur">
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
  return (
    <div ref={ref} className="relative h-full w-full">
      <Canvas frameloop={frameloop} dpr={[1, 1.75]} camera={{ position: [6.2, 4.2, 8.2], fov: 33 }} gl={{ antialias: true, alpha: true }} onCreated={({ camera }) => camera.lookAt(0, -0.1, 0)}>
        <ambientLight intensity={theme === "dark" ? 0.55 : 0.9} />
        <directionalLight position={[4, 7, 5]} intensity={1.7} />
        <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#c13cff" />
        <Scene dark={theme === "dark"} />
        <Sparkles count={60} scale={[9, 5, 7]} size={2} speed={0.25} color="#5546ff" opacity={0.4} />
      </Canvas>

      {/* Legend: plain DOM so it stays crisp and readable */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap rounded-full border border-paper/80 bg-paper/70 px-4 py-2 text-[12px] text-slate backdrop-blur">
        {[...LEVELS].reverse().map((l) => (
          <span key={l.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: l.color }} /> {l.name}
          </span>
        ))}
        <span className="hidden sm:inline">Hover an agent · click to assign work</span>
      </div>
    </div>
  );
}
