"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const pages = [
  { name: "Browser", path: "/" },
  { name: "Image", path: "/image" },
  { name: "Input", path: "/input" },
  { name: "Tactile", path: "/tactile" },
] as const;

export function PageTitle() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Determine current page name
  const getCurrentPageName = () => {
    if (pathname === "/" || pathname === "/browser") return "Browser";
    if (pathname === "/image") return "Image";
    if (pathname === "/input" || pathname === "/generative-input")
      return "Input";
    if (pathname === "/tactile") return "Tactile";
    return "Browser";
  };

  const currentPageName = getCurrentPageName();
  const isTactilePage = pathname === "/tactile";

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 flex h-12 items-center pl-8 ${
        isTactilePage ? "bg-[#e2e2e2]" : "bg-[#101010]"
      }`}
      style={{ zIndex: 150 }}
    >
      <div
        className={`relative flex items-center gap-1.5 pt-4 text-sm font-light tracking-wide ${
          isTactilePage ? "text-[#1a1a1a]" : "text-white"
        }`}
      >
        <span className={isTactilePage ? "text-[#1a1a1a]/50" : "text-white/50"}>
          danielsims
        </span>
        <span className={isTactilePage ? "text-[#1a1a1a]/30" : "text-white/30"}>
          /
        </span>
        <span className={isTactilePage ? "text-[#1a1a1a]/50" : "text-white/50"}>
          ui
        </span>
        <span className={isTactilePage ? "text-[#1a1a1a]/30" : "text-white/30"}>
          /
        </span>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 transition ${
              isTactilePage ? "hover:text-[#1a1a1a]/80" : "hover:text-white/80"
            }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <span>{currentPageName}</span>
            <FaChevronDown
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              size={12}
            />
          </button>

          {isOpen && (
            <div
              ref={popoverRef}
              className={`absolute left-0 top-full mt-2 min-w-[120px] rounded-md border p-1 ${
                isTactilePage
                  ? "border-[#1a1a1a]/10 bg-white"
                  : "border-white/10 bg-black"
              }`}
            >
              {pages.map((page) => {
                const isActive =
                  pathname === page.path ||
                  (page.path === "/" && pathname === "/browser") ||
                  (page.path === "/input" && pathname === "/generative-input");

                return (
                  <button
                    key={page.path}
                    onClick={() => handleNavigation(page.path)}
                    className={`w-full rounded-sm px-3 py-1.5 text-left text-sm transition ${
                      isTactilePage
                        ? isActive
                          ? "bg-[#1a1a1a]/10 font-medium text-[#1a1a1a]"
                          : "hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/70"
                        : isActive
                          ? "bg-white/10 font-medium text-white"
                          : "hover:bg-white/5 text-white/70"
                    }`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {page.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
