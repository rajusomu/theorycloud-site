"use client";

import { motion, useReducedMotion } from "motion/react";

/*
 * Small looping icons for the "Why Theory Cloud" cards. Each one acts out its card's point.
 * Static when the visitor prefers reduced motion.
 */

const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, ease: "easeInOut" as const });

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-iris-soft text-iris ring-1 ring-iris/15">
      <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

/* Every answer has a source: a citation travels from the answer to the document, then a tick */
function SourceIcon() {
  const still = useReducedMotion();
  return (
    <Tile>
      <rect x="20" y="6" width="14" height="18" rx="2.5" />
      <path d="M24 12h6M24 16h6M24 20h3" strokeWidth="1.6" opacity="0.6" />
      <rect x="4" y="24" width="14" height="10" rx="3" />
      <motion.circle
        r="2"
        fill="currentColor"
        stroke="none"
        initial={{ cx: 11, cy: 29 }}
        animate={still ? undefined : { cx: [11, 18, 27, 27], cy: [29, 26, 15, 15], opacity: [1, 1, 1, 0] }}
        transition={loop(2.6)}
      />
      <motion.path
        d="M28 30l3 3 6-7"
        stroke="#14b8a6"
        strokeWidth="2.4"
        initial={{ pathLength: still ? 1 : 0 }}
        animate={still ? undefined : { pathLength: [0, 0, 1, 1], opacity: [0, 0, 1, 0] }}
        transition={{ ...loop(2.6), times: [0, 0.55, 0.75, 1] }}
      />
    </Tile>
  );
}

/* Every customer kept separate: each customer's dot bounces in its own walled lane */
function SeparateIcon() {
  const still = useReducedMotion();
  return (
    <Tile>
      <rect x="4" y="6" width="32" height="28" rx="4" />
      <path d="M15 6v28M25 6v28" strokeWidth="1.6" />
      {[9.5, 20, 30.5].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          r="2.6"
          fill="currentColor"
          stroke="none"
          initial={{ cy: 20 }}
          animate={still ? undefined : { cy: [12, 28, 12] }}
          transition={loop(1.8 + i * 0.35, i * 0.25)}
        />
      ))}
    </Tile>
  );
}

/* Agents remember every customer: memory lines fill in one after another */
function MemoryIcon() {
  const still = useReducedMotion();
  return (
    <Tile>
      <circle cx="10" cy="12" r="4" />
      <path d="M4 26c0-3.5 2.7-6 6-6s6 2.5 6 6" />
      {[11, 19, 27].map((y, i) => (
        <motion.path
          key={y}
          d={`M21 ${y}h14`}
          strokeWidth="3"
          initial={{ pathLength: still ? 1 : 0 }}
          animate={still ? undefined : { pathLength: [0, 1, 1, 0] }}
          transition={{ ...loop(3), delay: i * 0.35, times: [0, 0.3, 0.85, 1] }}
        />
      ))}
    </Tile>
  );
}

/* Switch AI models freely: two model chips swap places; the history in the middle stays put */
function SwitchIcon() {
  const still = useReducedMotion();
  return (
    <Tile>
      <rect x="15" y="14" width="10" height="12" rx="2" strokeWidth="1.6" />
      <path d="M18 18h4M18 22h4" strokeWidth="1.4" />
      <motion.g animate={still ? undefined : { x: [0, 24, 24, 0, 0] }} transition={{ ...loop(3.2), times: [0, 0.25, 0.5, 0.75, 1] }}>
        <rect x="4" y="16" width="8" height="8" rx="2" fill="currentColor" stroke="none" />
      </motion.g>
      <motion.g animate={still ? undefined : { x: [0, -24, -24, 0, 0] }} transition={{ ...loop(3.2), times: [0, 0.25, 0.5, 0.75, 1] }}>
        <rect x="28" y="16" width="8" height="8" rx="2" stroke="#c13cff" />
      </motion.g>
    </Tile>
  );
}

export const problemIcons = [SourceIcon, SeparateIcon, MemoryIcon, SwitchIcon];
