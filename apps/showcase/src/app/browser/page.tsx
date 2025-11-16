"use client";

import { useState, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { Browser } from "@ui/ui";
import { FaGithub } from "react-icons/fa";

import { StateToggle } from "../../components/state-toggle";

const browserStates = ["video", "iframe"] as const;
type BrowserStates = (typeof browserStates)[number];

const BREAKPOINTS = {
  mobile: 768,
  desktop: 1680,
} as const;

type BrowserDimensions = {
  width: string;
  height: string;
  maxWidth: string;
};

const getBrowserDimensions = (viewportWidth: number): BrowserDimensions => {
  if (viewportWidth < BREAKPOINTS.mobile) {
    return {
      width: "100%",
      height: "50vh",
      maxWidth: "100%",
    };
  }

  if (viewportWidth <= BREAKPOINTS.desktop) {
    return {
      width: "100%",
      height: "60vh",
      maxWidth: "896px", // max-w-4xl
    };
  }

  return {
    width: "100%",
    height: "65vh",
    maxWidth: "1152px", // max-w-6xl
  };
};

export default function BrowserPage() {
  const [variant, setVariant] = useState<BrowserStates>("video");
  const [browserWidth, setBrowserWidth] = useState<string>("100%");
  const [browserHeight, setBrowserHeight] = useState<string>("60vh");
  const [maxWidth, setMaxWidth] = useState<string>("896px");
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const dimensions = getBrowserDimensions(window.innerWidth);
      setBrowserWidth(dimensions.width);
      setBrowserHeight(dimensions.height);
      setMaxWidth(dimensions.maxWidth);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#101010] p-8">
      <div ref={containerRef} className="mb-8 w-full" style={{ maxWidth }}>
        <Browser
          variant={variant}
          src={
            variant === "video"
              ? "/videos/reference-001.mov"
              : "https://reference.danielsi.ms"
          }
          displayUrl={
            variant === "video" ? "https://reference.danielsi.ms" : undefined
          }
          tabTitle="Reference Material"
          width={browserWidth}
          height={browserHeight}
        />
      </div>

      <div className="mx-auto mt-12 mb-8 flex w-[650px] max-w-full flex-col justify-start">
        <p className="mb-2 text-sm font-light tracking-wide text-white">
          Browser
        </p>
        <p className="text-sm font-light tracking-wide text-[#888]">
          A browser component that displays either an iframe or video content
          with a native browser interface.
        </p>
        <hr className="my-12 border-[#333] border-opacity-50" />
        <div className="flex flex-row flex-wrap justify-between gap-16 text-white">
          <StateToggle
            states={browserStates as readonly BrowserStates[]}
            activeState={variant}
            onStateChange={setVariant}
          />

          <div className="flex w-full flex-row-reverse items-center justify-end gap-4 tracking-wide md:w-fit md:flex-row">
            <span className="text-xs font-light">
              Built by <Link href={"https://x.com/danielsims"}>danielsims</Link>
            </span>
            <Link href={"https://github.com/danielsims/ui"}>
              <FaGithub className="fill-white text-white" size={24} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
