"use client";

import {
  useFetchAndRevalidateUserSWR,
  withUserSWR,
} from "@/app/_misc/auth/session";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { URLS } from "@repo/shared/config.ts";
import { useLockFn } from "ahooks";
import { asyncNoop, identity, mapValues } from "es-toolkit";

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

export const AuthProvider = withUserSWR(
  (props: Omit<React.ComponentProps<typeof Context.Provider>, "value">) => {
    const fetchAndRevalidateUserSWR = useFetchAndRevalidateUserSWR();

    return (
      <Context.Provider
        value={mapValues<ContextType>(
          {
            signUp: async (formData) => {
              await fetchAndRevalidateUserSWR(`${url}/sign-up`, {
                method: "POST",
                body: formData,
              });
            },
            signIn: async (formData) => {
              await fetchAndRevalidateUserSWR(`${url}/sign-in`, {
                method: "POST",
                body: formData,
              });
            },
            signOut: async () => {
              await fetchAndRevalidateUserSWR(`${url}/sign-out`, {
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
