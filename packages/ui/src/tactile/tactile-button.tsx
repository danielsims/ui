"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

// Button has larger, softer radius; housing is tight
const BUTTON_RADIUS = "10px";
const HOUSING_RADIUS = "6px";
const HOUSING_PADDING = "2px";

const buttonVariants = cva(
  [
    "relative flex items-center justify-center",
    "transition-transform duration-75 ease-out",
    "font-light tracking-[0.12em]",
    "select-none touch-manipulation",
    "origin-center",
  ],
  {
    variants: {
      variant: {
        orange: ["text-white"],
        black: ["text-white/90"],
        white: ["text-[#3a3a3a]"],
      },
      size: {
        sm: "h-10 min-w-16 px-3 text-[11px]",
        md: "h-12 min-w-24 px-4 text-xs",
        lg: "h-14 min-w-32 px-5 text-sm",
        icon: "h-12 w-12",
        square: "h-[100px] w-[100px] text-sm",
      },
    },
    defaultVariants: {
      variant: "orange",
      size: "md",
    },
  },
);

const housingVariants = cva(["inline-flex bg-[#1c1c1c]"], {
  variants: {
    variant: {
      orange: "",
      black: "",
      white: "",
    },
  },
  defaultVariants: {
    variant: "orange",
  },
});

// Color definitions for each variant
const variantStyles = {
  orange: {
    // Subtle orange gradient
    background: "linear-gradient(150deg, #e84a1a 0%, #d94012 100%)",
    // Sharper edge highlight on top/left
    edgeHighlight: `
      inset 1px 1px 0px rgba(255, 180, 120, 0.6),
      inset 2px 2px 2px rgba(255, 160, 90, 0.4),
      inset 4px 4px 8px rgba(255, 140, 70, 0.15)
    `,
    // Smooth shadow on bottom-right
    edgeShadow: `
      inset -1px -1px 2px rgba(0, 0, 0, 0.12),
      inset -2px -2px 6px rgba(0, 0, 0, 0.15),
      inset -4px -4px 12px rgba(60, 15, 0, 0.12)
    `,
    // Outer drop shadow for depth
    dropShadow: `
      6px 6px 8px -3px rgba(0, 0, 0, 0.4),
      10px 10px 20px -6px rgba(0, 0, 0, 0.3)
    `,
  },
  black: {
    // Darker charcoal gradient
    background: "linear-gradient(150deg, #3a3a3a 0%, #2e2e2e 100%)",
    // Sharper light edge highlight
    edgeHighlight: `
      inset 1px 1px 0px rgba(255, 255, 255, 0.15),
      inset 2px 2px 2px rgba(255, 255, 255, 0.08),
      inset 4px 4px 8px rgba(255, 255, 255, 0.03)
    `,
    // Smooth shadow
    edgeShadow: `
      inset -1px -1px 2px rgba(0, 0, 0, 0.25),
      inset -2px -2px 6px rgba(0, 0, 0, 0.2),
      inset -4px -4px 12px rgba(0, 0, 0, 0.1)
    `,
    // Outer drop shadow for depth
    dropShadow: `
      6px 6px 8px -3px rgba(0, 0, 0, 0.5),
      10px 10px 20px -6px rgba(0, 0, 0, 0.35)
    `,
  },
  white: {
    // Subtle warm gray gradient
    background: "linear-gradient(150deg, #e6e4e2 0%, #dad8d6 100%)",
    // Sharper bright white edge
    edgeHighlight: `
      inset 1px 1px 0px rgba(255, 255, 255, 0.9),
      inset 2px 2px 2px rgba(255, 255, 255, 0.5),
      inset 4px 4px 8px rgba(255, 255, 255, 0.2)
    `,
    // Smooth soft shadow
    edgeShadow: `
      inset -1px -1px 2px rgba(0, 0, 0, 0.05),
      inset -2px -2px 6px rgba(0, 0, 0, 0.06),
      inset -4px -4px 12px rgba(0, 0, 0, 0.04)
    `,
    // Outer drop shadow for depth
    dropShadow: `
      6px 6px 8px -3px rgba(0, 0, 0, 0.25),
      10px 10px 20px -6px rgba(0, 0, 0, 0.2)
    `,
  },
};

export interface TactileButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  asChild?: boolean;
}

const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  (
    { className, variant = "orange", size, children, disabled, ...props },
    ref,
  ) => {
    const styles = variantStyles[variant ?? "orange"];

    return (
      <div className="group/btn inline-flex">
        <div
          className={cn(
            housingVariants({ variant }),
            "relative transition-shadow duration-75",
          )}
          style={{
            borderRadius: HOUSING_RADIUS,
            padding: HOUSING_PADDING,
          }}
        >
          {/* Outer drop shadow - hidden when pressed */}
          <span
            className="pointer-events-none absolute inset-0 group-active/btn:opacity-0 transition-opacity duration-75"
            style={{
              borderRadius: HOUSING_RADIUS,
              boxShadow: styles.dropShadow,
            }}
            aria-hidden="true"
          />
          {/* Housing inset shadow */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: HOUSING_RADIUS,
              boxShadow: `
                inset 1px 1px 1px rgba(0, 0, 0, 0.9),
                inset -1px -1px 1px rgba(255, 255, 255, 0.15)
              `,
            }}
            aria-hidden="true"
          />
          <button
            ref={ref}
            disabled={disabled}
            className={cn(
              buttonVariants({ variant, size }),
              "overflow-hidden",
              "active:scale-[0.97]",
              "disabled:opacity-50 disabled:pointer-events-none",
              className,
            )}
            style={{
              borderRadius: BUTTON_RADIUS,
              background: styles.background,
            }}
            {...props}
          >
            {/* Edge highlight - top-left bright edge */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: BUTTON_RADIUS,
                boxShadow: styles.edgeHighlight,
              }}
              aria-hidden="true"
            />

            {/* Edge shadow - bottom-right dark edge */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: BUTTON_RADIUS,
                boxShadow: styles.edgeShadow,
              }}
              aria-hidden="true"
            />

            {/* Hard-light shadow layer for realistic depth */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: BUTTON_RADIUS,
                boxShadow: `
                inset -2px -2px 1px -1px rgba(0, 0, 0, 0.25),
                inset -4px -4px 24px -10px rgba(0, 0, 0, 0.15),
                inset 2px 2px 0.5px -1px rgba(255, 250, 248, 0.47)
              `,
                mixBlendMode: "hard-light",
              }}
              aria-hidden="true"
            />

            {/* Soft diffuse highlight - fades on press */}
            <span
              className="pointer-events-none absolute inset-0 group-active/btn:opacity-30 transition-opacity duration-75"
              style={{
                borderRadius: BUTTON_RADIUS,
                boxShadow: "inset 12px 12px 20px -8px rgba(255, 255, 255, 0.5)",
                mixBlendMode: "soft-light",
              }}
              aria-hidden="true"
            />

            {/* Pressed state - darker overlay */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 group-active/btn:opacity-100 transition-opacity duration-75"
              style={{
                borderRadius: BUTTON_RADIUS,
                boxShadow: `
                inset 0 0 0 1px rgba(0, 0, 0, 0.1),
                inset 2px 2px 8px rgba(0, 0, 0, 0.2),
                inset 4px 4px 12px rgba(0, 0, 0, 0.15)
              `,
              }}
              aria-hidden="true"
            />

            {/* Grain texture - pixelated noise */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: BUTTON_RADIUS,
                opacity: 0.04,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
              }}
              aria-hidden="true"
            />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {children}
            </span>
          </button>
        </div>
      </div>
    );
  },
);

TactileButton.displayName = "TactileButton";

export { TactileButton, buttonVariants };
