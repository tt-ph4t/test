"use client";

import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { URLS } from "@repo/shared/config.ts";
import type { PingMessageEvent } from "@repo/shared/types.ts";
import { noop } from "es-toolkit";
import React from "react";

const initialState: PingMessageEvent["data"] = 0;

const Context = createContext<
  ReturnType<typeof React.useState<PingMessageEvent["data"]>>
>([initialState, noop]);

const Ping = (): undefined => {
  const setState = useContextSelector(
    Context,
    ([, setState]) =>
      (state: PingMessageEvent["data"]) => {
        setState(+state as PingMessageEvent["data"]);
      },
  );

  React.useEffect(() => {
    const eventSource = new EventSource(`${URLS.API}ping`);

    eventSource.onmessage = (messageEvent: PingMessageEvent) => {
      setState(messageEvent.data);
    };

    eventSource.onerror = () => {
      setState(initialState);
    };

    return () => {
      setState(initialState);
      eventSource.close();
    };
  }, []);
};

export const PingProvider = ({ children }) => (
  <Context.Provider value={React.useState(initialState)}>
    {children}
    <Ping />
  </Context.Provider>
);

export const useIsServerOnline = () =>
  useContextSelector(Context, ([a]) => Boolean(a));
