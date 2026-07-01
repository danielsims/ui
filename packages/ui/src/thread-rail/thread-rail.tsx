"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { cn } from "../utils";

// A tick resolves to one of three visual states, derived from its two axes:
// whether it is in view (active) and whether it is pointed at (hovered).
export const threadRailStates = ["default", "active", "hovered"] as const;
export type ThreadRailStates = (typeof threadRailStates)[number];

// ThreadRail Context
//
// The Root owns both state axes. `active` is which ticks are in view — a set,
// since a viewport spans several rows at once. `hovered` is the single tick under
// the pointer, which drives the dock magnification and preview. Both are
// controllable; ticks register in mount order so a hovered tick can measure the
// distance to its neighbours.
interface ThreadRailContextValue {
  isActive: (value: string) => boolean;
  select: (value: string) => void;
  hoveredValue: string | null;
  setHoveredValue: (value: string | null) => void;
  register: (value: string) => void;
  unregister: (value: string) => void;
  indexOf: (value: string) => number;
  hoveredIndex: number;
}

const ThreadRailContext = createContext<ThreadRailContextValue | null>(null);

const useThreadRailContext = () => {
  const context = useContext(ThreadRailContext);
  if (!context) {
    throw new Error(
      "ThreadRail components must be used within ThreadRail.Root",
    );
  }
  return context;
};

// Tick Context
//
// Each Tick exposes its own resolved state so a Preview (or any child) can react
// to it without re-deriving from the Root.
interface TickContextValue {
  value: string;
  state: ThreadRailStates;
  isActive: boolean;
  isHovered: boolean;
}

const TickContext = createContext<TickContextValue | null>(null);

const useTickContext = () => {
  const context = useContext(TickContext);
  if (!context) {
    throw new Error("ThreadRail.Preview must be used within ThreadRail.Tick");
  }
  return context;
};

// Active can be a single value or several at once (e.g. every row on screen).
type ThreadRailValue = string | string[] | null;

const toSet = (value: ThreadRailValue): Set<string> =>
  new Set(Array.isArray(value) ? value : value ? [value] : []);

// Root Component
export type ThreadRailRootProps = Omit<
  React.ComponentProps<"div">,
  "value" | "defaultValue"
> & {
  value?: ThreadRailValue;
  defaultValue?: ThreadRailValue;
  onValueChange?: (value: string) => void;
  hovered?: string | null;
  onHoveredChange?: (value: string | null) => void;
};

export const Root = ({
  children,
  value,
  defaultValue = null,
  onValueChange,
  hovered,
  onHoveredChange,
  className,
  ...props
}: ThreadRailRootProps) => {
  const [internalValue, setInternalValue] = useState<Set<string>>(() =>
    toSet(defaultValue),
  );
  const [internalHovered, setInternalHovered] = useState<string | null>(null);

  const order = useRef<string[]>([]);
  const [, bump] = useReducer((count: number) => count + 1, 0);

  const valueControlled = value !== undefined;
  const activeSet = valueControlled ? toSet(value) : internalValue;
  const isActive = (tick: string) => activeSet.has(tick);

  const select = useCallback(
    (tick: string) => {
      if (!valueControlled) setInternalValue(new Set([tick]));
      onValueChange?.(tick);
    },
    [valueControlled, onValueChange],
  );

  const hoverControlled = hovered !== undefined;
  const hoveredValue = hoverControlled ? hovered : internalHovered;

  const setHoveredValue = useCallback(
    (tick: string | null) => {
      if (!hoverControlled) setInternalHovered(tick);
      onHoveredChange?.(tick);
    },
    [hoverControlled, onHoveredChange],
  );

  const register = useCallback((tick: string) => {
    if (!order.current.includes(tick)) {
      order.current.push(tick);
      bump();
    }
  }, []);

  const unregister = useCallback((tick: string) => {
    order.current = order.current.filter((entry) => entry !== tick);
    bump();
  }, []);

  const indexOf = useCallback(
    (tick: string) => order.current.indexOf(tick),
    [],
  );

  const hoveredIndex = hoveredValue ? order.current.indexOf(hoveredValue) : -1;

  return (
    <ThreadRailContext.Provider
      value={{
        isActive,
        select,
        hoveredValue,
        setHoveredValue,
        register,
        unregister,
        indexOf,
        hoveredIndex,
      }}
    >
      <div className={cn("relative w-fit", className)} {...props}>
        {children}
      </div>
    </ThreadRailContext.Provider>
  );
};

// Track Component
//
// The vertical track that holds the ticks. Leaving the track clears the hover so
// the dock settles back to its resting state.
export type ThreadRailTrackProps = React.ComponentProps<"div">;

export const Track = ({ className, ...props }: ThreadRailTrackProps) => {
  const { setHoveredValue } = useThreadRailContext();
  return (
    <div
      onMouseLeave={() => setHoveredValue(null)}
      className={cn("flex w-fit flex-col gap-0.5", className)}
      {...props}
    />
  );
};

// Dock falloff: the hovered tick grows most, its neighbours taper off by
// distance, everything else rests. Distances beyond the falloff share the
// resting width, so only the cursor's neighbourhood reacts.
const TICK_WIDTHS = [28, 20, 14] as const;
const REST_WIDTH = 10;

function widthForDistance(distance: number): number {
  return TICK_WIDTHS[distance] ?? REST_WIDTH;
}

function toneForDistance(distance: number, isActive: boolean): string {
  if (distance === 0) return "bg-white";
  if (distance === 1) return "bg-white/70";
  if (distance === 2) return "bg-white/40";
  if (isActive) return "bg-white";
  return "bg-white/20";
}

// Tick Component
export type ThreadRailTickProps = Omit<
  React.ComponentProps<"button">,
  "value"
> & {
  value: string;
};

export const Tick = ({
  value,
  children,
  className,
  onClick,
  ...props
}: ThreadRailTickProps) => {
  const {
    isActive,
    select,
    hoveredValue,
    setHoveredValue,
    register,
    unregister,
    indexOf,
    hoveredIndex,
  } = useThreadRailContext();

  useEffect(() => {
    register(value);
    return () => unregister(value);
  }, [value, register, unregister]);

  const active = isActive(value);
  const isHovered = hoveredValue === value;
  const state: ThreadRailStates = isHovered
    ? "hovered"
    : active
      ? "active"
      : "default";
  const distance =
    hoveredIndex < 0 ? Infinity : Math.abs(indexOf(value) - hoveredIndex);

  return (
    <TickContext.Provider value={{ value, state, isActive: active, isHovered }}>
      <button
        type="button"
        data-state={state}
        onFocus={() => setHoveredValue(value)}
        onBlur={() => setHoveredValue(null)}
        onMouseEnter={() => setHoveredValue(value)}
        onClick={(event) => {
          select(value);
          onClick?.(event);
        }}
        className={cn(
          "group/tick relative flex h-2 items-center outline-none",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "h-0.5 rounded-full transition-all duration-150 ease-out",
            toneForDistance(distance, active),
          )}
          style={{ width: widthForDistance(distance) }}
        />
        {children}
      </button>
    </TickContext.Provider>
  );
};

// Preview Component
//
// The popover shown beside a tick while it is hovered. Rendered only for the
// hovered tick, and non-interactive so it never fights the pointer.
export type ThreadRailPreviewProps = React.ComponentProps<"div">;

export const Preview = ({ className, ...props }: ThreadRailPreviewProps) => {
  const { isHovered } = useTickContext();
  if (!isHovered) return null;
  return (
    <div
      className={cn(
        "-translate-y-1/2 pointer-events-none absolute top-1/2 left-full z-30 ml-3 w-64 rounded-lg bg-[#1c1c1c] p-3 text-left",
        className,
      )}
      {...props}
    />
  );
};

// Preview Title Component
export type ThreadRailPreviewTitleProps = React.ComponentProps<"p">;

export const PreviewTitle = ({
  className,
  ...props
}: ThreadRailPreviewTitleProps) => (
  <p
    className={cn("truncate text-sm font-medium text-white", className)}
    {...props}
  />
);

// Preview Description Component
export type ThreadRailPreviewDescriptionProps = React.ComponentProps<"p">;

export const PreviewDescription = ({
  className,
  ...props
}: ThreadRailPreviewDescriptionProps) => (
  <p
    className={cn(
      "mt-1 line-clamp-3 text-sm leading-snug text-white/60",
      className,
    )}
    {...props}
  />
);

// Backward compatible default export
export type ThreadRailItem = {
  value: string;
  title?: string;
  description?: string;
};

export type ThreadRailProps = Omit<ThreadRailRootProps, "children"> & {
  items: ThreadRailItem[];
};

export function ThreadRail({ items, className, ...props }: ThreadRailProps) {
  return (
    <Root className={className} {...props}>
      <Track>
        {items.map((item) => (
          <Tick key={item.value} value={item.value} aria-label={item.title}>
            {item.title || item.description ? (
              <Preview>
                {item.title ? <PreviewTitle>{item.title}</PreviewTitle> : null}
                {item.description ? (
                  <PreviewDescription>{item.description}</PreviewDescription>
                ) : null}
              </Preview>
            ) : null}
          </Tick>
        ))}
      </Track>
    </Root>
  );
}
