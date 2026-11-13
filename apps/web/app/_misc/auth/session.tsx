"use client";

import { useFetch } from "@/app/_misc/use-fetch";
import { URLS } from "@repo/shared/config.ts";
import type { FetchParameters, User } from "@repo/shared/types.ts";
import useSWR, { useSWRConfig } from "swr";

const SWRkey = `${URLS.API}users/me`;

export const useUserSWR = () => {
  const fetch = useFetch();

  return useSWR<User>(
    SWRkey,
    async () => (await (await fetch(SWRkey)).json()).data.user,
  );
};

export const useFetchAndRevalidateUserSWR = () => {
  const fetch = useFetch();
  const SWRConfig = useSWRConfig();

  return async (...args: FetchParameters) => {
    const response = await fetch(...args);

    if (response.ok) SWRConfig.mutate(SWRkey);

    return response;
  };
};

export const withUserSWR = (Component) => (props) => {
  useUserSWR();

  return <Component {...props} />;
};

export const useIsAuthenticated = () => {
  const userSWR = useUserSWR();

  if (userSWR.error) return false;

  return Boolean(userSWR.data?.id);
};

export const withAuthenticated = (Component) => (props) => {
  const isAuthenticated = useIsAuthenticated();
  const userSWR = useUserSWR();

  if (isAuthenticated) return <Component key={userSWR.data?.id} {...props} />;
};
