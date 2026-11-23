"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps WebGL scenes cheap: render only while the canvas is on screen,
 * and render a single still frame when the visitor prefers reduced motion.
 */
export function useCanvasLoop<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frameloop: "always" | "demand" | "never" = reduce ? "demand" : visible ? "always" : "never";
  return { ref, frameloop, reduce };
}
