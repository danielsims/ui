"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { TactileButton } from "@ui/ui";
import { StateToggle } from "../../components/state-toggle";

const tactileVariants = ["default", "color", "size"] as const;
type TactileVariant = (typeof tactileVariants)[number];

export default function TactilePage() {
  const [variant, setVariant] = useState<TactileVariant>("default");

  // Set body and html background to match page background
  useEffect(() => {
    const originalBodyBg = document.body.style.background;
    const originalHtmlBg = document.documentElement.style.background;
    document.body.style.background = "#e2e2e2";
    document.documentElement.style.background = "#e2e2e2";
    return () => {
      document.body.style.background = originalBodyBg;
      document.documentElement.style.background = originalHtmlBg;
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#e2e2e2] p-8">
      {/* Container for button showcase */}
      <div className="mb-6 w-[650px] max-w-full rounded-2xl bg-[#e2e2e2] p-8">
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-6">
          {/* Default variant - Color and size showcase */}
          {variant === "default" && (
            <div className="flex flex-col items-center justify-center gap-4">
              {/* Color variants row */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <TactileButton variant="black" size="md">
                  BLACK
                </TactileButton>
                <TactileButton variant="orange" size="md">
                  ORANGE
                </TactileButton>
                <TactileButton variant="white" size="md">
                  WHITE
                </TactileButton>
              </div>
              {/* Size showcase row */}
              <div className="flex flex-wrap items-end justify-center gap-4">
                <TactileButton variant="black" size="sm">
                  SM
                </TactileButton>
                <TactileButton variant="black" size="md">
                  MEDIUM
                </TactileButton>
                <TactileButton variant="orange" size="lg">
                  LARGE
                </TactileButton>
                <TactileButton variant="white" size="icon">
                  <FiPlus size={18} strokeWidth={1.5} />
                </TactileButton>
              </div>
            </div>
          )}

          {/* Color variant - Three rows (black, orange, white) with sizes */}
          {variant === "color" && (
            <div className="flex flex-col items-center justify-center gap-4">
              {/* Black row */}
              <div className="flex flex-wrap items-end justify-center gap-4">
                <TactileButton variant="black" size="sm">
                  SM
                </TactileButton>
                <TactileButton variant="black" size="md">
                  MEDIUM
                </TactileButton>
                <TactileButton variant="black" size="lg">
                  LARGE
                </TactileButton>
                <TactileButton variant="black" size="icon">
                  <FiPlus size={18} strokeWidth={1.5} />
                </TactileButton>
              </div>
              {/* Orange row */}
              <div className="flex flex-wrap items-end justify-center gap-4">
                <TactileButton variant="orange" size="sm">
                  SM
                </TactileButton>
                <TactileButton variant="orange" size="md">
                  MEDIUM
                </TactileButton>
                <TactileButton variant="orange" size="lg">
                  LARGE
                </TactileButton>
                <TactileButton variant="orange" size="icon">
                  <FiPlus size={18} strokeWidth={1.5} />
                </TactileButton>
              </div>
              {/* White row */}
              <div className="flex flex-wrap items-end justify-center gap-4">
                <TactileButton variant="white" size="sm">
                  SM
                </TactileButton>
                <TactileButton variant="white" size="md">
                  MEDIUM
                </TactileButton>
                <TactileButton variant="white" size="lg">
                  LARGE
                </TactileButton>
                <TactileButton variant="white" size="icon">
                  <FiPlus size={18} strokeWidth={1.5} />
                </TactileButton>
              </div>
            </div>
          )}

          {/* Size variant - All sizes shown */}
          {variant === "size" && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <TactileButton variant="black" size="sm">
                SM
              </TactileButton>
              <TactileButton variant="black" size="md">
                MEDIUM
              </TactileButton>
              <TactileButton variant="black" size="lg">
                LARGE
              </TactileButton>
              <TactileButton variant="black" size="icon">
                <FiPlus size={18} strokeWidth={1.5} />
              </TactileButton>
              <TactileButton variant="black" size="square">
                <FiPlus size={24} strokeWidth={1.5} />
              </TactileButton>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-6 mb-8 flex w-[650px] max-w-full flex-col justify-start">
        <p className="mb-2 text-sm font-light tracking-wide text-[#1a1a1a]">
          Tactile Button
        </p>
        <p className="text-sm font-light tracking-wide text-[#666]">
          A physical button component with realistic shadows, gradients, and
          press feedback. Available in orange, black, and white variants.
        </p>
        <hr className="my-6 border-[#aaa] border-opacity-50" />
        <div className="flex flex-row flex-wrap justify-between gap-16 text-[#1a1a1a]">
          <StateToggle
            states={tactileVariants as readonly TactileVariant[]}
            activeState={variant}
            onStateChange={setVariant}
            layoutId="tactile-variant"
            textColor="text-[#1a1a1a]"
            inactiveTextColor="text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
            activeBgColor="bg-[#1a1a1a]"
          />

          <div className="flex w-full flex-row-reverse items-center justify-end gap-4 tracking-wide md:w-fit md:flex-row">
            <span className="text-xs font-light">
              Built by <Link href={"https://x.com/danielsims"}>danielsims</Link>
            </span>
            <Link href={"https://github.com/danielsims/ui"}>
              <FaGithub className="fill-[#1a1a1a] text-[#1a1a1a]" size={24} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
