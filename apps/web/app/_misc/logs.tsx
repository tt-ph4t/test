"use client";

import { Flex } from "@/app/_misc/flex";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import type { APIResponse } from "@repo/shared/types.ts";
import { noop } from "es-toolkit";
import { castArray } from "es-toolkit/compat";
import { flatMap, map, pipe } from "es-toolkit/fp";
import React from "react";

type Log = {
  message: APIResponse["message"];
  date?: Date;
};

const initialState: Log[] = [];

const Context = createContext<ReturnType<typeof React.useState<Log[]>>>([
  initialState,
  noop,
]);

export const LogsProvider = (props) => (
  <Context.Provider value={React.useState(initialState)} {...props} />
);

export const useLogs = () => {
  const setState = useContextSelector(Context, ([, setState]) => setState);

  return {
    clear: () => {
      setState(initialState);
    },
    add: (logs: Log | Log[]) => {
      setState((state) => [
        ...pipe(
          castArray(logs),
          flatMap((log) =>
            pipe(
              castArray(log.message),
              map((message) => ({
                date: log.date ?? new Date(),
                message,
              })),
            ),
          ),
        ),
        ...state,
      ]);
    },
  };
};

const Clear = (props: React.ComponentProps<"button">) => {
  const logs = useLogs();

  return (
    <button onClick={logs.clear} {...props}>
      Clear
    </button>
  );
};

const List = () => {
  const state = useContextSelector(Context, ([a]) => a);

  return state.map((log, index) => (
    <li key={index} title={log.date.toLocaleString()}>
      <span>{state.length - index}. </span>
      <span data-muted>{log.message}</span>
    </li>
  ));
};

export const Logs = () => (
  <div
    style={{
      position: "relative",
      width: "inherit",
    }}
  >
    <Flex
      as="ul"
      style={{
        maxHeight: "50dvh",
        overflow: "auto",
        flexDirection: "column",
        scrollbarGutter: "stable",
        flexWrap: "unset",
      }}
    >
      <List />
    </Flex>
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      <Clear />
    </div>
  </div>
);
