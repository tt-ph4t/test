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

type FormDataAction = (formData: FormData) => Promise<void>;

type ContextType = {
  signUp: FormDataAction;
  signIn: FormDataAction;
  signOut: typeof asyncNoop;
  update: FormDataAction;
};

const Context = createContext<ContextType>({
  signUp: asyncNoop,
  signIn: asyncNoop,
  signOut: asyncNoop,
  update: asyncNoop,
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
            update: async (formData) => {
              await fetchAndRevalidateUserSWR(`${url}/update`, {
                method: "PATCH",
                body: formData,
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
