"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const pages = [
  { name: "Browser", path: "/" },
  { name: "Image", path: "/image" },
  { name: "Input", path: "/input" },
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
    if (pathname === "/input" || pathname === "/generative-input") return "Input";
    return "Browser";
  };

  const currentPageName = getCurrentPageName();

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
    <header className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center pl-8 bg-[#101010]">
      <div className="relative flex items-center gap-1.5 pt-4 text-sm font-light tracking-wide text-white">
        <span className="text-white/50">danielsims</span>
        <span className="text-white/30">/</span>
        <span className="text-white/50">ui</span>
        <span className="text-white/30">/</span>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 transition hover:text-white/80"
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
              className="absolute left-0 top-full mt-2 z-[100] min-w-[120px] rounded-md border border-white/10 bg-black p-1"
            >
          {pages.map((page) => {
            const isActive = pathname === page.path || 
              (page.path === "/" && pathname === "/browser") ||
              (page.path === "/input" && pathname === "/generative-input");
            
            return (
              <button
                key={page.path}
                onClick={() => handleNavigation(page.path)}
                className={`w-full rounded-sm px-3 py-1.5 text-left text-sm text-white transition ${
                  isActive
                    ? "bg-white/10 font-medium"
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

