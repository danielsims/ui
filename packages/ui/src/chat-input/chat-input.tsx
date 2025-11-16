"use client";

import type { ChangeEvent } from "react";
import React, { createContext, useCallback, useContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Particles } from "./particles";

export const chatInputStates = [
  "idle",
  "focus",
  "typing",
  "loading",
  "error",
] as const;
export type ChatInputStates = (typeof chatInputStates)[number];

interface ChatInputContextValue {
  state: ChatInputStates;
  setState: (state: ChatInputStates) => void;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  internalPlaceholder: string;
  setInternalPlaceholder: (placeholder: string) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ChatInputContext = createContext<ChatInputContextValue | null>(null);

const useChatInputContext = () => {
  const context = useContext(ChatInputContext);
  if (!context) {
    throw new Error("ChatInput components must be used within ChatInput.Root");
  }
  return context;
};

// Root Component
export type ChatInputRootProps = React.ComponentProps<"div"> & {
  value: string;
  placeholder: string;
  controlledState?: ChatInputStates;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStateChange?: (state: ChatInputStates) => void;
};

export const Root = ({
  children,
  value,
  placeholder,
  controlledState,
  onChange,
  onStateChange,
  ...props
}: ChatInputRootProps) => {
  const [internalState, setInternalState] = useState<ChatInputStates>("idle");
  const [internalPlaceholder, setInternalPlaceholder] =
    useState<string>(placeholder);
  const currentState = controlledState ?? internalState;

  const changeState = useCallback(
    (newState: ChatInputStates) => {
      if (controlledState === undefined) {
        setInternalState(newState);
      }
      onStateChange?.(newState);
    },
    [controlledState, onStateChange],
  );

  const debouncedTypingToFocus = useDebouncedCallback(() => {
    changeState("focus");
  }, 900);

  const handleInput = useCallback(() => {
    changeState("typing");
    debouncedTypingToFocus();
  }, [changeState, debouncedTypingToFocus]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    handleInput();
  };

  return (
    <ChatInputContext.Provider
      value={{
        state: currentState,
        setState: changeState,
        value,
        setValue: () => {},
        placeholder,
        internalPlaceholder,
        setInternalPlaceholder,
        onChange: handleChange,
      }}
    >
      <div
        className="shadow-inner-dark shadow-border flex h-[56px] w-full max-w-2xl items-center justify-center gap-2 overflow-hidden rounded-full bg-[#151515]"
        {...props}
      >
        {children}
      </div>
    </ChatInputContext.Provider>
  );
};

// Particles Component
export const ParticlesComponent = () => {
  const { state } = useChatInputContext();
  return <Particles state={state} />;
};

// Input Component
export type ChatInputInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "placeholder" | "onChange"
>;

export const Input = ({ ...props }: ChatInputInputProps) => {
  const {
    value,
    internalPlaceholder,
    onChange,
    setState,
    setInternalPlaceholder,
    placeholder,
  } = useChatInputContext();

  const handleFocus = () => {
    setInternalPlaceholder("");
    setState("focus");
  };

  const handleBlur = () => {
    setInternalPlaceholder(placeholder);
    setState("idle");
  };

  return (
    <input
      value={value}
      placeholder={internalPlaceholder}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="h-full w-full bg-transparent font-mono text-base text-white outline-none placeholder:font-mono placeholder:text-sm placeholder:text-[#A0A0A0] placeholder:md:text-base"
      {...props}
    />
  );
};

export const ChatInput = ({
  value,
  placeholder,
  controlledState,
  onChange,
  onStateChange,
  ...rest
}: ChatInputRootProps) => {
  return (
    <Root
      value={value}
      placeholder={placeholder}
      controlledState={controlledState}
      onChange={onChange}
      onStateChange={onStateChange}
      {...rest}
    >
      <ParticlesComponent />
      <Input />
    </Root>
  );
};
