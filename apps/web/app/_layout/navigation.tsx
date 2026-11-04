"use client";

import { Flex } from "@/app/_misc/flex";
import { useRouter } from "next/navigation";

const data = {
  Home: "/",
  Login: "/login",
};

export const Navigation = () => {
  const router = useRouter();

  return (
    <Flex>
      {Object.entries(data).map(([a, b]) => (
        <button
          key={a}
          onClick={() => {
            router.push(b);
          }}
        >
          {a}
        </button>
      ))}
    </Flex>
  );
};
