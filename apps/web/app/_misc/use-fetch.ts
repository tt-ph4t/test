import { useLogs } from "@/app/_misc/logs";
import type { FetchParameters } from "@repo/shared/types.ts";

export const useFetch = () => {
  const logs = useLogs();

  return async (input: FetchParameters[0], init?: FetchParameters[1]) => {
    const response = await fetch(input, {
      credentials: "include",
      ...init,
    });

    logs.add(await response.clone().json());

    return response;
  };
};
