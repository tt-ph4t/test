"use client";

import { useUserSWR } from "@/app/_misc/auth/session";

export default function Page() {
  const userSWR = useUserSWR();

  return JSON.stringify(userSWR.data);
}
