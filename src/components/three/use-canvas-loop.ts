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

  // React Three Fiber sizes its canvas from a ResizeObserver measurement. That first measurement
  // can be dropped while the page is still busy loading, which leaves the canvas blank at
  // 300×150. A window resize event makes it measure again, so nudge it after mount and
  // whenever the scene scrolls into view.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const timers = [120, 600, 1500].map((ms) => window.setTimeout(nudge, ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);
  useEffect(() => {
    if (visible) window.dispatchEvent(new Event("resize"));
  }, [visible]);

  const frameloop: "always" | "demand" | "never" = reduce ? "demand" : visible ? "always" : "never";
  return { ref, frameloop, reduce };
}
