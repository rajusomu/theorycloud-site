"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, Sparkles } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useCanvasLoop } from "./use-canvas-loop";

/*
 * Hero: "who's asking, what they may do, where the answer comes from".
 * Agent nodes (customers, partners, teams) send requests along their own routes
 * into the Theory Cloud core. Each request changes from pending (fuchsia) to
 * verified (teal) as it arrives. Hover a node to see its route; click to send a burst.
 */

const IRIS = new THREE.Color("#5546ff");
const FUCHSIA = new THREE.Color("#c13cff");
const VERIFIED = new THREE.Color("#14b8a6");
const NODE_COLORS = ["#5546ff", "#c13cff", "#ff9f6b", "#14b8a6"];

const ROLES = [
  { who: "Customer", route: "acme-pay/agents/support" },
  { who: "Partner", route: "acme-pay/partners/northwind/agents/support" },
  { who: "Merchant", route: "acme-pay/agents/payouts" },
  { who: "Support team", route: "acme-pay/agents/desk" },
  { who: "Auditor", route: "acme-bank/agents/compliance" },
  { who: "Engineer", route: "acme/agents/reviewer" },
  { who: "Partner", route: "acme-bank/partners/harbor/agents/claims" },
  { who: "Customer", route: "acme-bank/agents/support" },
  { who: "Employee", route: "acme/agents/hr" },
  { who: "Partner", route: "acme/partners/contoso/agents/onboarding" },
  { who: "Customer", route: "harbor/agents/claims" },
  { who: "Analyst", route: "acme-bank/agents/research" },
];

const PACKETS = 22;

type Route = { pos: THREE.Vector3; curve: THREE.QuadraticBezierCurve3; color: string; who: string; route: string };

function useRoutes(): Route[] {
  return useMemo(() => {
    const n = ROLES.length;
    const up = new THREE.Vector3(0, 1, 0);
    return ROLES.map((r, i) => {
      // Fibonacci sphere, flattened a little so the cloud reads as a wide constellation
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      const pos = new THREE.Vector3(Math.cos(theta) * rad * 3, y * 1.9, Math.sin(theta) * rad * 3);
      const side = new THREE.Vector3().crossVectors(pos, up).normalize().multiplyScalar(0.9);
      const ctrl = pos.clone().multiplyScalar(0.45).add(side);
      return {
        pos,
        curve: new THREE.QuadraticBezierCurve3(pos, ctrl, new THREE.Vector3(0, 0, 0)),
        color: NODE_COLORS[i % NODE_COLORS.length],
        ...r,
      };
    });
  }, []);
}

function Core({ pulse }: { pulse: React.RefObject<number> }) {
  const inner = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    pulse.current = Math.max(0, pulse.current - dt * 3.5);
    const s = 1 + pulse.current * 0.18;
    inner.current?.scale.setScalar(s);
    if (shell.current) {
      shell.current.rotation.y += dt * 0.25;
      shell.current.rotation.x += dt * 0.12;
    }
  });
  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshPhysicalMaterial color={IRIS} emissive={FUCHSIA} emissiveIntensity={0.25} roughness={0.15} metalness={0.2} clearcoat={1} flatShading />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color={IRIS} wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    g.current.children.forEach((c, i) => (c.rotation.z += dt * (0.12 + i * 0.05) * (i % 2 ? -1 : 1)));
  });
  return (
    <group ref={g}>
      {[1.45, 1.8, 2.15].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + (i - 1) * 0.35, i * 0.4, 0]}>
          <torusGeometry args={[r, 0.008, 8, 160]} />
          <meshBasicMaterial color={i === 1 ? "#c13cff" : "#5546ff"} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Network({ onVerified }: { onVerified: () => void }) {
  const routes = useRoutes();
  const group = useRef<THREE.Group>(null);
  const pulse = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  hoveredRef.current = hovered;
  const drift = useRef(0);

  // Packet pool: each one travels a route from its node to the core
  const packets = useRef(
    Array.from({ length: PACKETS }, (_, i) => ({ route: i % routes.length, t: Math.random(), speed: 0.18 + Math.random() * 0.22 })),
  );
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const g = group.current;
    // Hold still while a node is hovered, so it stays under the cursor
    if (g && hoveredRef.current === null) {
      // Pointer tilts the constellation gently; it also drifts slowly on its own
      drift.current += dt * 0.06;
      const targetY = state.pointer.x * 0.3 + drift.current;
      const targetX = -state.pointer.y * 0.18;
      g.rotation.y += (targetY - g.rotation.y) * 0.04;
      g.rotation.x += (targetX - g.rotation.x) * 0.04;
    }
    packets.current.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        p.t = 0;
        p.route = Math.floor(Math.random() * routes.length);
        p.speed = 0.18 + Math.random() * 0.22;
        pulse.current = 1;
        onVerified();
      }
      const m = meshes.current[i];
      if (!m) return;
      routes[p.route].curve.getPoint(p.t, m.position);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.color.copy(tmp.copy(FUCHSIA).lerp(VERIFIED, THREE.MathUtils.smoothstep(p.t, 0.55, 0.95)));
      m.scale.setScalar(0.6 + Math.sin(p.t * Math.PI) * 0.6);
    });
  });

  const burst = (r: number) => {
    packets.current.slice(0, 5).forEach((p, k) => {
      p.route = r;
      p.t = k * 0.08;
      p.speed = 0.45;
    });
  };

  return (
    <group ref={group}>
      <Core pulse={pulse} />
      <Rings />
      {routes.map((r, i) => (
        <group key={i}>
          <Line points={r.curve.getPoints(40)} color={hovered === i ? "#c13cff" : "#5546ff"} lineWidth={hovered === i ? 2 : 1} transparent opacity={hovered === i ? 0.9 : 0.22} />
          <mesh
            position={r.pos}
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
              burst(i);
            }}
          >
            <sphereGeometry args={[0.32, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            <mesh scale={hovered === i ? 1.5 : 1}>
              <sphereGeometry args={[0.13, 24, 24]} />
              <meshPhysicalMaterial color={r.color} roughness={0.25} clearcoat={1} emissive={r.color} emissiveIntensity={0.15} />
            </mesh>
          </mesh>
          {hovered === i && (
            <Html position={r.pos} center distanceFactor={9} style={{ pointerEvents: "none" }}>
              <div className="-translate-y-10 whitespace-nowrap rounded-xl border border-line bg-white/95 px-3 py-2 text-left shadow-xl shadow-ink/10 backdrop-blur">
                <div className="text-[13px] font-semibold text-ink">{r.who}</div>
                <div className="mt-0.5 font-mono text-[10.5px] text-slate">theorymcp.ai/{r.route}/mcp</div>
              </div>
            </Html>
          )}
        </group>
      ))}
      {Array.from({ length: PACKETS }, (_, i) => (
        <mesh key={i} ref={(m) => { meshes.current[i] = m; }}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color={FUCHSIA} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const { ref, frameloop } = useCanvasLoop<HTMLDivElement>();
  const [count, setCount] = useState(0);
  return (
    <div ref={ref} className="relative h-full w-full">
      <Canvas frameloop={frameloop} dpr={[1, 1.75]} camera={{ position: [0, 0.6, 7.2], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <pointLight position={[0, 0, 0]} intensity={6} distance={4} color="#c13cff" />
        <Network onVerified={() => setCount((c) => c + 1)} />
        <Sparkles count={70} scale={[9, 5, 6]} size={2.2} speed={0.25} color="#5546ff" opacity={0.45} />
      </Canvas>

      {/* HUD: plain DOM so it stays crisp and readable */}
      <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 backdrop-blur sm:left-6 sm:top-6">
        <div className="flex items-center gap-2 text-[12px] text-slate">
          <span className="h-2 w-2 rounded-full bg-verified" /> Requests verified in this demo
        </div>
        <div className="display mt-1 text-[1.5rem] tabular-nums">{count.toLocaleString("en-US")}</div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap rounded-full border border-white/80 bg-white/70 px-4 py-2 text-[12px] text-slate backdrop-blur">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fuchsia" /> Checking</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-verified" /> Verified</span>
        <span className="hidden sm:inline">Hover a node · click to send a request</span>
      </div>
    </div>
  );
}
