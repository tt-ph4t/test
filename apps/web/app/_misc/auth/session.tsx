"use client";

import { useFetch } from "@/app/_misc/use-fetch";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { URLS } from "@repo/shared/config.ts";
import type { UserResponse } from "@repo/shared/types.ts";
import { useAsyncEffect, useSetState } from "ahooks";
import { flow, noop } from "es-toolkit";

const initialState: {
  user: UserResponse["data"]["user"];
} = {
  user: {},
};

const Context = createContext<
  ReturnType<typeof useSetState<typeof initialState>>
>([initialState, noop]);

const Sync = () => {
  const fetchUser = useFetchUser();

  useAsyncEffect(async () => {
    await fetchUser(`${URLS.API}users/me`);
  }, []);
};

const useUserId = () => useContextSelector(Context, ([{ user }]) => user.id);

export const withSessionProvider = (Component) => (props) => {
  const value = useSetState(initialState);

  return (
    <Context.Provider value={value}>
      <Sync />
      <Component {...props} />
    </Context.Provider>
  );
};

export const useFetchUser = () => {
  const setState = useContextSelector(Context, ([, a]) => a);
  const fetch = useFetch();

  return async (...args: Parameters<typeof fetch>) => {
    const response = await fetch(...args);
    const { data } = await response.clone().json();

    setState({
      user: data?.user ?? initialState.user,
    });

    return response;
  };
};

export const useIsAuthenticated = flow(useUserId, Boolean);

export const withAuthenticated = (Component) => (props) => {
  const isAuthenticated = useIsAuthenticated();
  const userId = useUserId();

  if (isAuthenticated) return <Component key={userId} {...props} />;
};
