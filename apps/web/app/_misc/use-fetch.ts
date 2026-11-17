import { useLogs } from "@/app/_misc/logs";
import { useProgress } from "@bprogress/next";
import type { FetchParameters } from "@repo/shared/types.ts";

export const useFetch = () => {
  const logs = useLogs();
  const progress = useProgress();

  return async (input: FetchParameters[0], init?: FetchParameters[1]) => {
    progress.start();

    const response = await fetch(input, {
      credentials: "include",
      ...init,
    });

    const clonedResponse = response.clone();

    try {
      logs.add(await clonedResponse.json());
    } catch {}

    progress.stop();

    return response;
  };
};
