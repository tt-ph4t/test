"use client";

import { useFetch } from "@/app/_misc/use-fetch";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { URLS } from "@repo/shared/config.ts";
import { useAsyncEffect, useSetState } from "ahooks";
import { noop } from "es-toolkit";

const initialState = {
  user: {},
};

const Context = createContext<
  ReturnType<typeof useSetState<typeof initialState>>
>([initialState, noop]);

const Sync = () => {
  const fetchUser = useFetchUser();

  useAsyncEffect(async () => {
    await fetchUser(`${URLS.API}me`);
  }, []);
};

export const withSessionProvider = (Component) => (props) => (
  <Context.Provider value={useSetState(initialState)}>
    <Sync />
    <Component {...props} />
  </Context.Provider>
);

export const useFetchUser = () => {
  const setState = useContextSelector(Context, ([, a]) => a);
  const fetch = useFetch();

  return async (...args: Parameters<typeof fetch>) => {
    const response = await fetch(...args);
    const { data } = await response.clone().json();

    setState({
      user: (data?.user ? data : initialState)["user"],
    });

    return response;
  };
};

export const useIsAuthenticated = () =>
  useContextSelector(Context, ([{ user }]) => Boolean(user.id));

export const withAuthenticated = (Component) => (props) => {
  const isAuthenticated = useIsAuthenticated();
  const userId = useContextSelector(Context, ([{ user }]) => user.id);

  if (isAuthenticated) return <Component key={userId} {...props} />;
};
