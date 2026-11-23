import { useId } from "react";

/** Official Theory Cloud mark (from theorycloud.ai/assets/svg/icon.svg) + wordmark.
    Gradient IDs are made unique per instance so nav and footer logos don't collide. */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const stops = (
    <>
      <stop offset="0" stopColor="#2EA7FF" />
      <stop offset="1" stopColor="#7A5CFF" />
    </>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}t`} x1="43.78" y1="39.57" x2="131.39" y2="140.96" gradientUnits="userSpaceOnUse">{stops}</linearGradient>
        <linearGradient id={`${id}l`} x1="-10.28" y1="87.44" x2="77.19" y2="188.67" gradientUnits="userSpaceOnUse">{stops}</linearGradient>
        <linearGradient id={`${id}r`} x1="12.03" y1="62.04" x2="102.74" y2="167.02" gradientUnits="userSpaceOnUse">{stops}</linearGradient>
      </defs>
      <g transform="translate(15.006 4) scale(0.2866)">
        <path fill={`url(#${id}t)`} d="M118.58,0v115.18H.13C3.65,52.64,55.02,2.51,118.58,0Z" />
        <path fill={`url(#${id}l)`} d="M65.28,125.01v70.09C29.48,190.73,1.46,161.18,0,125.01h65.28Z" />
        <path fill={`url(#${id}r)`} d="M75.1,125.01h43.49s0,26.88,0,26.88c0,24.02-19.47,43.49-43.49,43.49h0s0-70.37,0-70.37Z" />
      </g>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <LogoMark size={30} />
      <span className="text-[1.05rem] font-medium tracking-[-0.012em]">Theory Cloud</span>
    </span>
  );
}
