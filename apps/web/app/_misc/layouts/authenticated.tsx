"use client";

import { useIsAuthenticated, useUserSWR } from "@/app/_misc/auth/session";
import { redirect } from "next/navigation";
import React from "react";

export const AuthenticatedLayout = ({ children }: React.PropsWithChildren) => {
  const isAuthenticated = useIsAuthenticated();
  const userSWR = useUserSWR();

  if (userSWR.isLoading) return;
  if (isAuthenticated) return children;

  redirect("/login");
};
