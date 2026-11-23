"use client";

import dynamic from "next/dynamic";

/* WebGL scenes load in the browser only, after the page's own content. */

function Placeholder() {
  return <div className="h-full w-full animate-pulse rounded-[inherit] bg-gradient-to-br from-iris/5 to-fuchsia/5" aria-hidden />;
}

export const HeroCanvas = dynamic(() => import("./hero-scene"), { ssr: false, loading: Placeholder });
export const PlatformCanvas = dynamic(() => import("./platform-scene"), { ssr: false, loading: Placeholder });
