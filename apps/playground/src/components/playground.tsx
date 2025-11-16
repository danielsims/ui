"use client";

import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useActions, useUIState } from "ai/rsc";
import type { ChatInputStates } from "@repo/ui";
import { ChatInput } from "@repo/ui";

import type { AI } from "~/app/actions";

export function Playground() {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const [controlledState, setControlledState] =
    useState<ChatInputStates>("idle");
  const { submitUserMessage } = useActions<typeof AI>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setControlledState("loading");

    // Add user message to UI state
    setMessages(
      (currentMessages): { id: number; display: React.ReactNode }[] => [
        ...currentMessages,
        {
          id: Date.now(),
          display: <div>{inputValue}</div>,
        },
      ],
    );

    // Submit and get response message
    const responseMessage = (await submitUserMessage(inputValue)) as {
      id: number;
      display: React.ReactNode;
    };
    setMessages(
      (currentMessages): { id: number; display: React.ReactNode }[] => [
        ...currentMessages,
        responseMessage,
      ],
    );

    // Clear input value
    setInputValue("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-48 font-light tracking-wide text-white md:p-12">
        {messages.map((message) => (
          <div key={message.id}>{message.display}</div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="fixed bottom-12 left-[50%] flex w-full max-w-2xl -translate-x-[50%] justify-center px-12">
          <ChatInput
            controlledState={controlledState}
            placeholder="What do you need?"
            value={inputValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setInputValue(event.currentTarget.value);
            }}
            onStateChange={setControlledState}
          />
        </div>
      </form>
    </div>
  );
}
