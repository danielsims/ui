"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { cn } from "../utils";

// Helper to get favicon URL from domain
function getFaviconUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    return `${urlObj.protocol}//${domain}/favicon.ico`;
  } catch {
    return null;
  }
}

// Browser Context
interface BrowserContextValue {
  variant: "iframe" | "video";
  src: string | null;
  iframeSrc: string | null;
  videoFileSrc: string | null;
  displayUrl: string | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  tabTitle: string;
  faviconUrl: string | null;
  width: number | string | undefined;
  height: number | string | undefined;
}

const BrowserContext = createContext<BrowserContextValue | null>(null);

const useBrowserContext = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error("Browser components must be used within Browser.Root");
  }
  return context;
};

// Helper to extract a readable title from URL
const extractTitleFromUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    // Special case for reference.danielsi.ms
    if (urlObj.hostname === "reference.danielsi.ms") {
      return "Reference Material";
    }
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop();
    if (filename && filename !== "" && filename.includes(".")) {
      return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    const domain = urlObj.hostname.replace("www.", "");
    const domainParts = domain.split(".");
    if (domainParts.length > 0 && domainParts[0]) {
      return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    }
    return "";
  } catch {
    return "";
  }
};

// Root Component
export type BrowserRootProps = React.ComponentProps<"div"> & {
  variant?: "iframe" | "video";
  src?: string;
  tabTitle?: string;
  faviconUrl?: string;
  width?: number | string;
  height?: number | string;
};

export const Root = ({
  children,
  variant = "iframe",
  src,
  tabTitle = "Latest Release Notes",
  faviconUrl,
  width,
  height,
  className,
  style,
  ...props
}: BrowserRootProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [title, setTitle] = useState(tabTitle);

  const defaultUrl = "https://reference.danielsi.ms";
  const iframeSrc =
    variant === "iframe" && !src
      ? defaultUrl
      : variant === "iframe"
        ? src
        : null;
  const videoDisplayUrl = variant === "video" ? defaultUrl : null;
  const videoFileSrc = variant === "video" ? src : null;
  const displayUrl = iframeSrc || videoDisplayUrl || src || null;

  const favicon = faviconUrl || (displayUrl ? getFaviconUrl(displayUrl) : null);

  useEffect(() => {
    if (variant === "iframe" && iframeRef.current && iframeSrc) {
      const iframe = iframeRef.current;

      const extractTitle = () => {
        try {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc && iframeDoc.title) {
            setTitle(iframeDoc.title);
          } else {
            // Fallback to URL-based title or default
            const urlTitle = extractTitleFromUrl(iframeSrc);
            setTitle(tabTitle || urlTitle || "Reference Material");
          }
        } catch {
          // CORS or other error - use fallback
          const urlTitle = extractTitleFromUrl(iframeSrc);
          setTitle(tabTitle || urlTitle || "Reference Material");
        }
      };

      iframe.addEventListener("load", extractTitle);
      const timeout = setTimeout(extractTitle, 1000);

      return () => {
        iframe.removeEventListener("load", extractTitle);
        clearTimeout(timeout);
      };
    } else if (variant === "video") {
      setTitle(tabTitle || "Reference Material");
    } else {
      const urlTitle = displayUrl ? extractTitleFromUrl(displayUrl) : "";
      setTitle(tabTitle || urlTitle || "Reference Material");
    }
  }, [variant, iframeSrc, videoDisplayUrl, src, tabTitle, displayUrl]);

  return (
    <BrowserContext.Provider
      value={{
        variant,
        src: videoFileSrc || src || null,
        iframeSrc: iframeSrc || null,
        videoFileSrc: videoFileSrc || null,
        displayUrl: displayUrl || null,
        iframeRef: iframeRef as React.RefObject<HTMLIFrameElement>,
        tabTitle: title,
        faviconUrl: favicon,
        width,
        height,
      }}
    >
      <div
        className={cn(
          "mx-auto bg-zinc-300 rounded-xl border border-zinc-300 overflow-hidden",
          !width && "w-[80vw]",
          !height && "h-[80vh]",
          className,
        )}
        style={{
          width: width ?? undefined,
          height: height ?? undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </BrowserContext.Provider>
  );
};

// Header Component
export type BrowserHeaderProps = React.ComponentProps<"div">;

export const Header = ({
  children,
  className,
  ...props
}: BrowserHeaderProps) => {
  return (
    <div
      className={cn("h-[42px] flex items-end gap-3 px-3 relative", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Controls Component
export type BrowserControlsProps = React.ComponentProps<"div">;

export const Controls = ({ className, ...props }: BrowserControlsProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 z-50 self-center mt-0.5",
        className,
      )}
      {...props}
    >
      <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </div>
  );
};

// Tab Component
export type BrowserTabProps = React.ComponentProps<"div"> & {
  title?: string;
  faviconUrl?: string;
};

export const Tab = ({
  title,
  faviconUrl,
  className,
  ...props
}: BrowserTabProps) => {
  const { tabTitle, faviconUrl: contextFavicon } = useBrowserContext();
  const favicon = faviconUrl || contextFavicon;
  const displayTitle = title || tabTitle;

  return (
    <div className="flex items-end">
      <div className="relative h-[36px]">
        <div
          className="
            before:content-[''] before:absolute before:bottom-0 before:-left-[20px]
            before:w-[20px] before:h-[20px] before:rounded-full before:bg-zinc-300 before:z-[20]
            after:content-[''] after:absolute after:bottom-0 after:-right-[20px]
            after:w-[20px] after:h-[20px] after:rounded-full after:bg-zinc-300 after:z-[20]
          "
        >
          <div
            className={cn(
              "relative flex items-center gap-2",
              "h-[36px] min-w-[220px] px-6",
              "text-xs font-medium text-black",
              "rounded-t-lg bg-white",
              "before:content-[''] before:absolute before:bottom-0 before:-left-[10px]",
              "before:w-[10px] before:h-[10px] before:bg-white before:z-[10]",
              "after:content-[''] after:absolute after:bottom-0 after:-right-[10px]",
              "after:w-[10px] after:h-[10px] after:bg-white after:z-[10]",
              className,
            )}
            {...props}
          >
            {favicon && (
              <img
                src={favicon}
                alt=""
                className="w-4 h-4 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <span className="truncate">{displayTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Tab Button Component
export type BrowserNewTabProps = React.ComponentProps<"button">;

export const NewTab = ({ className, ...props }: BrowserNewTabProps) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center h-[36px] w-[36px] rounded-t-lg bg-zinc-300 text-zinc-600 -mt-0.5",
        className,
      )}
      {...props}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
};

// Navigation Component
export type BrowserNavigationProps = React.ComponentProps<"div">;

export const Navigation = ({ className, ...props }: BrowserNavigationProps) => {
  const { displayUrl, iframeSrc, src } = useBrowserContext();
  const url = displayUrl || iframeSrc || src || "";

  return (
    <div
      className={cn(
        "h-[40px] flex items-center gap-2 px-3 py-2 bg-white border-b border-zinc-200",
        className,
      )}
      {...props}
    >
      <button className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      <button className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </button>
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm">
        <span className="text-zinc-400 truncate">{url}</span>
      </div>
    </div>
  );
};

// Body Component
export type BrowserBodyProps = React.ComponentProps<"div">;

export const Body = ({ children, className, ...props }: BrowserBodyProps) => {
  return (
    <div
      className={cn(
        "h-[calc(100%-42px)] flex flex-col px-1.5 pb-1.5",
        className,
      )}
      {...props}
    >
      <div className="relative w-full flex-1 flex flex-col bg-white rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-xl z-0" />
        <div className="relative z-10 flex flex-col flex-1">{children}</div>
      </div>
    </div>
  );
};

// Content Component
export type BrowserContentProps = React.ComponentProps<"div">;

export const Content = ({ className, ...props }: BrowserContentProps) => {
  const { variant, iframeSrc, videoFileSrc, src, iframeRef, tabTitle } =
    useBrowserContext();

  return (
    <div
      className={cn("relative flex-1 overflow-hidden z-10", className)}
      {...props}
    >
      {variant === "iframe" && iframeSrc && (
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          className="w-full h-full border-0"
          title={tabTitle}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; geolocation; microphone; camera; payment; usb; vr; xr-spatial-tracking"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
      {variant === "video" && (videoFileSrc || src) && (
        <video
          src={videoFileSrc || src || undefined}
          className="w-full h-full object-cover"
          controls
          autoPlay
          loop
          muted
        />
      )}
    </div>
  );
};

// Default export for backward compatibility
export function Browser({
  variant = "iframe",
  src,
  tabTitle = "",
  faviconUrl,
  width,
  height,
  className,
  ...props
}: BrowserRootProps) {
  return (
    <Root
      variant={variant}
      src={src}
      tabTitle={tabTitle}
      faviconUrl={faviconUrl}
      width={width}
      height={height}
      className={className}
      {...props}
    >
      <Header>
        <Controls />
        <div className="flex items-end gap-2">
          <Tab />
          <NewTab />
        </div>
        <div className="flex-1" />
      </Header>
      <Body>
        <Navigation />
        <Content />
      </Body>
    </Root>
  );
}
