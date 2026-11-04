import { useLogs } from "@/app/_misc/logs";

type FetchParams = Parameters<typeof fetch>;

export const useFetch = () => {
  const logs = useLogs();

  return async (input: FetchParams[0], init?: FetchParams[1]) => {
    const response = await fetch(input, {
      credentials: "include",
      ...init,
    });

    logs.add(await response.clone().json());

    return response;
  };
};
