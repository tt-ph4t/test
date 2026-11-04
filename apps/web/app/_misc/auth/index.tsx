"use client";

import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { URLS } from "@repo/shared/config.ts";
import { useLockFn } from "ahooks";
import { asyncNoop, identity, mapValues } from "es-toolkit";
import { useFetchUser, withSessionProvider } from "./session";

type ContextType = {
  signUp: (formData: FormData) => Promise<void>;
  signIn: (formData: FormData) => Promise<void>;
  signOut: typeof asyncNoop;
};

const Context = createContext<ContextType>({
  signUp: asyncNoop,
  signIn: asyncNoop,
  signOut: asyncNoop,
});

const url = new URL(`${URLS.API}auth`);

export const AuthProvider = withSessionProvider(
  (props: Omit<React.ComponentProps<typeof Context.Provider>, "value">) => {
    const fetchUser = useFetchUser();

    return (
      <Context.Provider
        value={mapValues<ContextType>(
          {
            signUp: async (formData) => {
              await fetchUser(`${url.href}/sign-up`, {
                method: "POST",
                body: formData,
              });
            },
            signIn: async (formData) => {
              await fetchUser(`${url.href}/sign-in`, {
                method: "POST",
                body: formData,
              });
            },
            signOut: async () => {
              await fetchUser(`${url.href}/sign-out`, {
                method: "POST",
              });
            },
          },
          useLockFn,
        )}
        {...props}
      />
    );
  },
);

export const useAuth = () => useContextSelector(Context, identity);
