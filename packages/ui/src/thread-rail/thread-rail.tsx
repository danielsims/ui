"use client";

import * as React from "react";
import { cn } from "../utils";

export const threadRailStates = ["default", "active", "hover"] as const;
export type ThreadRailStates = (typeof threadRailStates)[number];

type ThreadRailValue = string | string[] | null;

const toSet = (value: ThreadRailValue) =>
  new Set(Array.isArray(value) ? value : value ? [value] : []);

type ThreadRailContextValue = {
  isActive: (tick: string) => boolean;
  select: (tick: string) => void;
  hover: string | null;
  setHover: (tick: string | null) => void;
  order: string[];
};

const ThreadRailContext = React.createContext<ThreadRailContextValue | null>(
  null,
);

function useThreadRail() {
  const context = React.useContext(ThreadRailContext);
  if (!context) {
    throw new Error("ThreadRail parts must be used within ThreadRail.Root.");
  }
  return context;
}

function Root({
  children,
  value,
  defaultValue = null,
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "value" | "defaultValue"> & {
  value?: ThreadRailValue;
  defaultValue?: ThreadRailValue;
  onValueChange?: (value: string) => void;
}) {
  // Active is controllable and can be several ticks at once, since a viewport
  // spans several turns. Hover is internal to the rail.
  const [activeState, setActiveState] = React.useState(() =>
    toSet(defaultValue),
  );
  const [hover, setHover] = React.useState<string | null>(null);
  const order = React.useRef<string[]>([]).current;

  const active = value !== undefined ? toSet(value) : activeState;

  const context: ThreadRailContextValue = {
    isActive: (tick) => active.has(tick),
    select: (tick) => {
      if (value === undefined) setActiveState(new Set([tick]));
      onValueChange?.(tick);
    },
    hover,
    setHover,
    order,
  };

  return (
    <ThreadRailContext.Provider value={context}>
      <div className={cn("relative w-fit", className)} {...props}>
        {children}
      </div>
    </ThreadRailContext.Provider>
  );
}

function Track({ className, ...props }: React.ComponentProps<"div">) {
  const { setHover } = useThreadRail();
  return (
    <div
      onMouseLeave={() => setHover(null)}
      className={cn("flex w-fit flex-col gap-0.5", className)}
      {...props}
    />
  );
}

// The hovered tick grows the most; its neighbours taper off by distance.
const TICK_WIDTHS = [28, 20, 14];

function Tick({
  value,
  children,
  className,
  onClick,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & { value: string }) {
  const { isActive, select, hover, setHover, order } = useThreadRail();

  React.useEffect(() => {
    order.push(value);
    return () => {
      const index = order.indexOf(value);
      if (index !== -1) order.splice(index, 1);
    };
  }, [value, order]);

  const active = isActive(value);
  const isHover = hover === value;
  const state: ThreadRailStates = isHover
    ? "hover"
    : active
      ? "active"
      : "default";

  const distance =
    hover === null
      ? Infinity
      : Math.abs(order.indexOf(value) - order.indexOf(hover));
  const tone =
    distance === 0
      ? "bg-white"
      : distance === 1
        ? "bg-white/70"
        : distance === 2
          ? "bg-white/40"
          : active
            ? "bg-white"
            : "bg-white/20";

  return (
    <button
      type="button"
      data-state={state}
      onMouseEnter={() => setHover(value)}
      onFocus={() => setHover(value)}
      onBlur={() => setHover(null)}
      onClick={(event) => {
        select(value);
        onClick?.(event);
      }}
      className={cn(
        "group relative flex h-2 items-center outline-none",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "h-0.5 rounded-full transition-all duration-150 ease-out",
          tone,
        )}
        style={{ width: TICK_WIDTHS[distance] ?? 10 }}
      />
      {isHover && children}
    </button>
  );
}

function Preview({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-translate-y-1/2 pointer-events-none absolute top-1/2 left-full z-30 ml-3 w-64 rounded-lg bg-[#1c1c1c] p-3 text-left",
        className,
      )}
      {...props}
    />
  );
}

function PreviewTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("truncate text-sm font-medium text-white", className)}
      {...props}
    />
  );
}

function PreviewDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mt-1 line-clamp-3 text-sm leading-snug text-white/60",
        className,
      )}
      {...props}
    />
  );
}

export { Root, Track, Tick, Preview, PreviewTitle, PreviewDescription };
