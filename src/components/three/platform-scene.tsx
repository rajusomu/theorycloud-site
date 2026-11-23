"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Float, Line, OrbitControls, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useCanvasLoop } from "./use-canvas-loop";

/*
 * One small 3D model per product, each showing what that product does:
 *  TheoryMCP       — a hub routing to namespaces, partners and agents
 *  AppTheory       — three runtimes (Go, TS, Python) on one shared contract stack
 *  KnowledgeTheory — a shelf of approved sources; the cited one lifts out
 *  Autheory        — access gates rotating around a protected key
 *  TableTheory     — a table of records moving together as one model
 *  FaceTheory      — pages delivered from a server slab; the front one hydrates
 * Drag to rotate.
 */

const C = { iris: "#7b70ff", fuchsia: "#d66bff", apricot: "#ffad80", teal: "#2dd4bf", white: "#e9ebf5" };

function Glossy({ color, emissive = 0.08 }: { color: string; emissive?: number }) {
  return <meshPhysicalMaterial color={color} roughness={0.22} metalness={0.15} clearcoat={1} clearcoatRoughness={0.2} emissive={color} emissiveIntensity={emissive} />;
}

function Routes() {
  const g = useRef<THREE.Group>(null);
  const tiers = useMemo(() => {
    const ring = (n: number, r: number, y: number, off = 0) =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + off;
        return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
      });
    return { ns: ring(3, 1.1, 0.4), partners: ring(6, 1.9, -0.25, 0.3), agents: ring(10, 2.5, -0.9, 0.1) };
  }, []);
  const packet = useRef<THREE.Mesh>(null);
  const path = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.1, 0), tiers.ns[0], tiers.partners[0], tiers.agents[0]]), [tiers]);
  useFrame((s, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.15;
    if (packet.current) path.getPoint((s.clock.elapsedTime * 0.35) % 1, packet.current.position);
  });
  const link = (a: THREE.Vector3, b: THREE.Vector3, k: string, o = 0.3) => <Line key={k} points={[a, b]} color={C.iris} transparent opacity={o} lineWidth={1} />;
  return (
    <group ref={g}>
      <mesh position={[0, 1.1, 0]}>
        <octahedronGeometry args={[0.38, 0]} />
        <Glossy color={C.fuchsia} emissive={0.3} />
      </mesh>
      {tiers.ns.map((p, i) => (
        <group key={`n${i}`}>
          {link(new THREE.Vector3(0, 1.1, 0), p, `l${i}`, 0.5)}
          <RoundedBox args={[0.34, 0.34, 0.34]} radius={0.07} position={p}>
            <Glossy color={C.iris} />
          </RoundedBox>
        </group>
      ))}
      {tiers.partners.map((p, i) => (
        <group key={`p${i}`}>
          {link(tiers.ns[i % 3], p, `lp${i}`)}
          <mesh position={p}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <Glossy color={C.apricot} />
          </mesh>
        </group>
      ))}
      {tiers.agents.map((p, i) => (
        <group key={`a${i}`}>
          {link(tiers.partners[i % 6], p, `la${i}`, 0.2)}
          <mesh position={p}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <Glossy color={C.teal} emissive={0.3} />
          </mesh>
        </group>
      ))}
      <mesh ref={packet}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Runtimes() {
  const orbit = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * 0.6;
  });
  const colors = [C.iris, C.fuchsia, C.apricot];
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={1.4} floatIntensity={0.25} rotationIntensity={0.1}>
          <RoundedBox args={[2.6 - i * 0.35, 0.22, 2.6 - i * 0.35]} radius={0.08} position={[0, -0.7 + i * 0.55, 0]}>
            <Glossy color={colors[i]} emissive={0.1} />
          </RoundedBox>
        </Float>
      ))}
      {/* Go · TypeScript · Python orbiting the shared contract */}
      <group ref={orbit} position={[0, 1.05, 0]}>
        {["Go", "TS", "Py"].map((_, i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <RoundedBox key={i} args={[0.34, 0.34, 0.34]} radius={0.08} position={[Math.cos(a) * 1.15, 0, Math.sin(a) * 1.15]}>
              <Glossy color={C.teal} emissive={0.25} />
            </RoundedBox>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.012, 8, 120]} />
          <meshBasicMaterial color={C.teal} transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function Library() {
  const cards = useRef<(THREE.Group | null)[]>([]);
  const n = 9;
  useFrame((s) => {
    const cited = Math.floor(s.clock.elapsedTime / 2.2) % n;
    cards.current.forEach((c, i) => {
      if (!c) return;
      const target = i === cited ? 0.75 : 0;
      c.position.y += (target - c.position.y) * 0.08;
      c.rotation.y += ((i === cited ? 0 : (i - n / 2) * -0.09) - c.rotation.y) * 0.08;
    });
  });
  return (
    <group rotation={[0, 0, 0]}>
      {Array.from({ length: n }, (_, i) => {
        const x = (i - (n - 1) / 2) * 0.48;
        const z = -Math.abs(i - (n - 1) / 2) * 0.12;
        return (
          <group key={i} ref={(g) => { cards.current[i] = g; }} position={[x, 0, z]}>
            <RoundedBox args={[0.38, 1.5, 0.06]} radius={0.03}>
              <Glossy color={i % 3 === 0 ? C.iris : i % 3 === 1 ? C.white : C.fuchsia} emissive={0.06} />
            </RoundedBox>
            {/* text lines on each source */}
            {[0.45, 0.3, 0.15].map((y) => (
              <mesh key={y} position={[0, y, 0.035]}>
                <planeGeometry args={[0.24, 0.035]} />
                <meshBasicMaterial color="#0b0f1a" transparent opacity={0.25} />
              </mesh>
            ))}
          </group>
        );
      })}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial color={C.iris} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function Gates() {
  const rings = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    rings.current?.children.forEach((r, i) => {
      r.rotation.x += dt * (0.3 + i * 0.15);
      r.rotation.y += dt * (0.2 - i * 0.1);
    });
  });
  return (
    <group>
      <Float speed={2} floatIntensity={0.3}>
        <mesh>
          <dodecahedronGeometry args={[0.55, 0]} />
          <Glossy color={C.teal} emissive={0.35} />
        </mesh>
      </Float>
      <group ref={rings}>
        {[1.05, 1.45, 1.85].map((r, i) => (
          <mesh key={r}>
            <torusGeometry args={[r, 0.06, 20, 120, Math.PI * (1.4 + i * 0.2)]} />
            <Glossy color={[C.iris, C.fuchsia, C.apricot][i]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Table() {
  const cells = useRef<(THREE.Mesh | null)[]>([]);
  const n = 7;
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    cells.current.forEach((m, k) => {
      if (!m) return;
      const i = k % n;
      const j = Math.floor(k / n);
      const h = 0.25 + (Math.sin(t * 1.4 + i * 0.6 + j * 0.4) + 1) * 0.35;
      m.scale.y = h;
      m.position.y = h * 0.25 - 0.6;
    });
  });
  const palette = [C.iris, C.fuchsia, C.apricot, C.teal];
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {Array.from({ length: n * n }, (_, k) => {
        const i = k % n;
        const j = Math.floor(k / n);
        return (
          <mesh key={k} ref={(m) => { cells.current[k] = m; }} position={[(i - 3) * 0.46, 0, (j - 3) * 0.46]}>
            <boxGeometry args={[0.38, 0.5, 0.38]} />
            <Glossy color={palette[(i + j) % palette.length]} emissive={0.06} />
          </mesh>
        );
      })}
    </group>
  );
}

function Pages() {
  const blocks = useRef<(THREE.Mesh | null)[]>([]);
  const beams = useRef<(THREE.Mesh | null)[]>([]);
  // Three pages: server-rendered, static, incremental. Each sits at its own depth.
  const pages = [
    { x: -1.0, y: 0.4, z: -0.6, color: C.iris },
    { x: 0, y: 0.2, z: -0.1, color: C.fuchsia },
    { x: 1.0, y: 0, z: 0.4, color: C.white },
  ];
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Front page "hydrates": its content blocks fill in one after another, then reset
    const phase = (t % 4) / 4;
    blocks.current.forEach((b, i) => {
      if (!b) return;
      const on = THREE.MathUtils.clamp((phase - i * 0.12) * 6, 0, 1);
      b.scale.x = 0.05 + on * 0.95;
    });
    beams.current.forEach((b, i) => {
      if (!b) return;
      const k = ((t * 0.6 + i / 3) % 1);
      b.position.y = -1.05 + k * 1.4;
      (b.material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI);
    });
  });
  const rows: [number, number][] = [
    [0.38, 1.2],
    [0.16, 0.9],
    [-0.04, 1.1],
    [-0.24, 0.6],
  ];
  return (
    <group>
      {/* Server slab the pages are delivered from */}
      <RoundedBox args={[3.4, 0.16, 1.8]} radius={0.06} position={[0, -1.15, 0]}>
        <Glossy color={C.teal} emissive={0.12} />
      </RoundedBox>
      {pages.map((pg, i) => (
        <Float key={i} speed={1.2 + i * 0.3} floatIntensity={0.25} rotationIntensity={0.08}>
          {/* Pages always face the viewer, like screens, while the scene orbits */}
          <Billboard position={[pg.x, pg.y, pg.z]}>
            <RoundedBox args={[1.5, 1.1, 0.05]} radius={0.04}>
              <Glossy color={pg.color} emissive={0.05} />
            </RoundedBox>
            {/* browser top bar */}
            <mesh position={[0, 0.48, 0.03]}>
              <planeGeometry args={[1.5, 0.12]} />
              <meshBasicMaterial color="#0b0f1a" transparent opacity={0.35} />
            </mesh>
            {rows.map(([y, w], r) => (
              <mesh
                key={r}
                position={[-0.6 + (w * 1.0) / 2, y, 0.032]}
                ref={i === 2 ? (m) => { blocks.current[r] = m; } : undefined}
              >
                <planeGeometry args={[w, 0.09]} />
                <meshBasicMaterial color={i === 2 ? "#5546ff" : "#0b0f1a"} transparent opacity={i === 2 ? 0.75 : 0.22} />
              </mesh>
            ))}
          </Billboard>
        </Float>
      ))}
      {/* Delivery beams rising from the slab */}
      {pages.map((pg, i) => (
        <mesh key={`b${i}`} ref={(m) => { beams.current[i] = m; }} position={[pg.x, -1, pg.z]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent />
        </mesh>
      ))}
    </group>
  );
}

const scenes: Record<string, () => React.JSX.Element> = {
  theorymcp: Routes,
  apptheory: Runtimes,
  knowledgetheory: Library,
  autheory: Gates,
  tabletheory: Table,
  facetheory: Pages,
};

export default function PlatformScene({ slug }: { slug: string }) {
  const { ref, frameloop, reduce } = useCanvasLoop<HTMLDivElement>();
  const Scene = scenes[slug] ?? Routes;
  return (
    <div ref={ref} className="h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas frameloop={frameloop} dpr={[1, 1.75]} camera={{ position: [3.6, 2.6, 4.4], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#c13cff" />
        <pointLight position={[0, -2, 2]} intensity={3} color="#ff9f6b" distance={8} />
        <Scene key={slug} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduce} autoRotateSpeed={0.6} minPolarAngle={0.6} maxPolarAngle={1.6} />
      </Canvas>
    </div>
  );
}
