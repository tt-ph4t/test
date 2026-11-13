"use client";

import { useIsAuthenticated } from "@/app/_misc/auth/session";
import { Flex } from "@/app/_misc/flex";
import { isString, mapValues } from "es-toolkit";
import { useRouter } from "next/navigation";

const data = mapValues(
  {
    Home: "",
    Login: "login",
    Account: {
      authRequired: true,
      href: "account",
    },
  },
  (a) =>
    isString(a)
      ? {
          href: `/${a}`,
          authRequired: false,
        }
      : {
          ...a,
          href: `/${a.href}`,
        },
);

export const Navigation = () => {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  return (
    <Flex>
      {Object.entries(data).map(([a, b]) => (
        <button
          disabled={b.authRequired && !isAuthenticated}
          key={a}
          onClick={() => {
            router.push(b.href);
          }}
        >
          {a}
        </button>
      ))}
    </Flex>
  );
};
