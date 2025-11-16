"use client";

import type { GenerativeImageStates } from "./types";
import { generativeImageStates } from "./types";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { cn } from "../utils";
import BlurImage from "./blur-image";
import CaptionContent from "./caption";

export { generativeImageStates };
export type { GenerativeImageStates };

interface GenerativeImageContextValue {
  state: GenerativeImageStates;
  setState: (state: GenerativeImageStates, source?: "mouse" | "manual") => void;
  src: string;
  alt: string;
  model: string;
  width: number;
  height: number;
}

const GenerativeImageContext =
  createContext<GenerativeImageContextValue | null>(null);

const useGenerativeImageContext = () => {
  const context = useContext(GenerativeImageContext);
  if (!context) {
    throw new Error(
      "GenerativeImage components must be used within GenerativeImage.Root",
    );
  }
  return context;
};

// Root Component
export type GenerativeImageRootProps = React.ComponentProps<"div"> & {
  src: string;
  alt: string;
  model: string;
  width: number;
  height: number;
  controlledState?: GenerativeImageStates;
  onStateChange?: (state: GenerativeImageStates) => void;
};

export const Root = ({
  children,
  src,
  alt,
  model,
  width,
  height,
  controlledState,
  onStateChange,
  className,
  ...props
}: GenerativeImageRootProps) => {
  const [internalState, setInternalState] =
    useState<GenerativeImageStates>("default");
  const hoverSourceRef = useRef<"mouse" | "manual">("mouse");

  const currentState = controlledState ?? internalState;
  const isControlled = controlledState !== undefined;

  const setState = (
    newState: GenerativeImageStates,
    source: "mouse" | "manual" = "manual",
  ) => {
    hoverSourceRef.current = source;

    if (!isControlled) {
      setInternalState(newState);
    }

    onStateChange?.(newState);
  };

  const handleMouseEnter = () => {
    if (currentState === "default") {
      setState("hover", "mouse");
    }
  };

  const handleMouseLeave = () => {
    if (hoverSourceRef.current === "mouse" && currentState === "hover") {
      setState("default", "mouse");
    }
  };

  // Track manual state changes
  useEffect(() => {
    if (isControlled) {
      if (controlledState === "hover" && hoverSourceRef.current !== "mouse") {
        hoverSourceRef.current = "manual";
      } else if (controlledState === "default") {
        hoverSourceRef.current = "mouse";
      }
    }
  }, [controlledState, isControlled]);

  return (
    <GenerativeImageContext.Provider
      value={{
        state: currentState,
        setState,
        src,
        alt,
        model,
        width,
        height,
      }}
    >
      <div
        className={cn(
          "shadow-inner-dark shadow-border group relative overflow-hidden rounded-xl border border-[#252525]",
          className,
        )}
        style={{ width, height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </GenerativeImageContext.Provider>
  );
};

// Image Component
export type GenerativeImageImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  fill?: boolean;
};

export const Image = ({
  className,
  fill,
  ...props
}: GenerativeImageImageProps) => {
  const { src, alt, setState, state, width, height } =
    useGenerativeImageContext();
  const hasAutoTransitionedRef = useRef(false);
  const previousStateRef = useRef<GenerativeImageStates>(state);

  const handleLoadingComplete = useCallback(() => {
    if (state === "loading" && !hasAutoTransitionedRef.current) {
      hasAutoTransitionedRef.current = true;
      setState("default");
    }
  }, [state, setState]);

  useEffect(() => {
    // Track when state changes to loading manually
    if (state === "loading" && previousStateRef.current !== "loading") {
      hasAutoTransitionedRef.current = true;
    }

    // Reset flag when leaving loading state
    if (previousStateRef.current === "loading" && state !== "loading") {
      hasAutoTransitionedRef.current = false;
    }

    previousStateRef.current = state;
  }, [state, setState]);

  return (
    <BlurImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("h-full w-full rounded-xl object-cover", className)}
      fill={fill}
      onLoadingComplete={handleLoadingComplete}
      {...props}
    />
  );
};

// Caption Component
export type GenerativeImageCaptionProps = React.ComponentProps<"div">;

export const Caption = ({
  className,
  ...props
}: GenerativeImageCaptionProps) => {
  const { model, alt, state } = useGenerativeImageContext();
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center gap-4 p-4 transition-opacity duration-300 ease-in-out",
        state === "hover"
          ? "opacity-100 bg-black/20"
          : "opacity-0 group-hover:opacity-100 group-hover:bg-black/20",
        className,
      )}
      {...props}
    >
      <CaptionContent model={model} alt={alt} />
    </div>
  );
};

// Backward compatible default export
export function GenerativeImage({
  src,
  alt,
  model,
  width,
  height,
  controlledState,
  className,
  fill,
  onStateChange,
  ...rest
}: GenerativeImageRootProps & { fill?: boolean }) {
  return (
    <Root
      src={src}
      alt={alt}
      model={model}
      width={width}
      height={height}
      controlledState={controlledState}
      onStateChange={onStateChange}
      className={className}
      {...rest}
    >
      <Image fill={fill} />
      <Caption />
    </Root>
  );
}
