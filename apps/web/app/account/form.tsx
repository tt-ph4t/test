"use client";

import { useAuth } from "@/app/_misc/auth";
import { useUserSWR } from "@/app/_misc/auth/session";
import { Flex } from "@/app/_misc/flex";
import { FormButton } from "@/app/_misc/form-button";
import { SignOut } from "@/app/login/form";
import React from "react";

const Update = (props: React.ComponentProps<typeof FormButton>) => {
  const auth = useAuth();

  return (
    <FormButton formAction={auth.update} {...props}>
      Update
    </FormButton>
  );
};

const Inputs = () => {
  const userSWR = useUserSWR();

  return (
    <>
      <input disabled defaultValue={userSWR.data?.id} type="text" name="id" />
      <input placeholder={userSWR.data?.email} type="email" name="email" />
    </>
  );
};

export default () => (
  <Flex
    as="form"
    style={{
      flexDirection: "column",
    }}
  >
    <Inputs />
    <input placeholder="Password" type="password" name="password" />
    <Update />
    <SignOut />
  </Flex>
);
