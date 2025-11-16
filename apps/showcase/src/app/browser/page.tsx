"use client";

import { useState } from "react";
import Link from "next/link";
import { Browser } from "@ui/ui";
import { FaGithub } from "react-icons/fa";

import { StateToggle } from "../../components/state-toggle";

const browserStates = ["iframe", "video"] as const;
type BrowserStates = (typeof browserStates)[number];

export default function BrowserPage() {
  const [variant, setVariant] = useState<BrowserStates>("iframe");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#101010] p-8">
      <div className="mb-8 max-w-6xl w-full">
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
          width="100%"
          height="60vh"
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
