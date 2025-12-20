import { motion } from "framer-motion";

interface StateToggleProps<T> {
  states: readonly T[];
  activeState: T;
  onStateChange: (newState: T) => void;
  layoutId?: string;
  textColor?: string;
  inactiveTextColor?: string;
  activeBgColor?: string;
}

export function StateToggle<T>({
  states,
  activeState,
  onStateChange,
  layoutId = "active-state",
  textColor = "text-white",
  inactiveTextColor = "text-white/50 hover:text-white",
  activeBgColor = "bg-white",
}: StateToggleProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {states.map((state) => (
        <button
          key={String(state)}
          onClick={() => onStateChange(state)}
          className={`${
            state === activeState ? "" : inactiveTextColor
          } relative rounded-full px-3 py-1 text-sm ${textColor} transition`}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {activeState === state && (
            <motion.span
              layoutId={layoutId}
              className={`absolute inset-0 z-10 ${activeBgColor} mix-blend-difference`}
              style={{ borderRadius: 9999, mixBlendMode: "difference" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {String(state).charAt(0).toUpperCase() + String(state).slice(1)}
        </button>
      ))}
    </div>
  );
}
