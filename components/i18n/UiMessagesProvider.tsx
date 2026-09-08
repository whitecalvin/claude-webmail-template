"use client";

import { createContext, useContext } from "react";

type UiMessages = Record<string, string>;

const UiMessagesContext = createContext<UiMessages>({});

export function UiMessagesProvider({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: UiMessages;
}) {
  return (
    <UiMessagesContext.Provider value={messages}>
      {children}
    </UiMessagesContext.Provider>
  );
}

export function useUiMessages() {
  return useContext(UiMessagesContext);
}
