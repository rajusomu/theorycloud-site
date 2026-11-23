/** Wordmark: a route glyph (three nodes on a path) + "Theory Cloud". */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect width="26" height="26" rx="7" fill="currentColor" />
        <path d="M6 17 C 10 17, 10 9, 13 9 S 16 17, 20 17" stroke="#F5F6FA" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="6" cy="17" r="2" fill="#FF9F6B" />
        <circle cx="13" cy="9" r="2" fill="#F5F6FA" />
        <circle cx="20" cy="17" r="2" fill="#14B8A6" />
      </svg>
      <span className="text-[1.05rem] font-semibold tracking-tight">
        Theory<span className="font-normal text-slate"> Cloud</span>
      </span>
    </span>
  );
}
