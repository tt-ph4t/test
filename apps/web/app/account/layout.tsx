"use client";

import { useIsAuthenticated, useUserSWR } from "@/app/_misc/auth/session";
import { redirect } from "next/navigation";

export default function Layout({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const userSWR = useUserSWR();

  if (userSWR.isLoading) return "loading";
  if (isAuthenticated) return children;

  redirect("/login");
}
