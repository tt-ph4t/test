"use client";

import { URLS } from "@repo/shared/config.ts";
import type { PingMessageEvent } from "@repo/shared/types.ts";
import useSWRSubscription from "swr/subscription";

const defaultData: PingMessageEvent["data"] = 0;

export const useIsServerOnlineSWR = (url = `${URLS.API}ping`) => {
  const SWRSubscription = useSWRSubscription(url, (...[, { next }]) => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (messageEvent: PingMessageEvent) => {
      next(undefined, Boolean(messageEvent.data));
    };

    eventSource.onerror = () => {
      next(undefined, Boolean(defaultData));
    };

    return () => {
      next(undefined, Boolean(defaultData));
      eventSource.close();
    };
  });

  return {
    isServerOnline: Boolean(!SWRSubscription.error && SWRSubscription.data),
    isServerOnlineSWR: SWRSubscription,
  };
};
