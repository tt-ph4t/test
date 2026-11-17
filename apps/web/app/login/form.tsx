"use client";

import { useAuth } from "@/app/_misc/auth";
import { useIsAuthenticated } from "@/app/_misc/auth/session";
import { Flex } from "@/app/_misc/flex";
import { FormButton } from "@/app/_misc/form-button";
import { faker } from "@faker-js/faker";
import React from "react";

const SignUps = (props: React.ComponentProps<typeof FormButton>) => {
  const auth = useAuth();
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <FormButton
        formAction={auth.signUp}
        disabled={isAuthenticated}
        {...props}
      >
        Sign up
      </FormButton>
      <FormButton
        type="button"
        onClick={async () => {
          const formData = new FormData();
          const email = faker.internet.email();

          formData.set("email", email);
          formData.set("password", email);

          await auth.signUp(formData);
        }}
        disabled={isAuthenticated}
        {...props}
      >
        Quick sign up (password = email)
      </FormButton>
    </>
  );
};

export const SignOut = (props: React.ComponentProps<typeof FormButton>) => {
  const auth = useAuth();
  const isAuthenticated = useIsAuthenticated();

  return (
    <FormButton
      disabled={!isAuthenticated}
      type="button"
      onClick={auth.signOut}
      {...props}
    >
      Sign out
    </FormButton>
  );
};

const SignIn = (props: React.ComponentProps<typeof FormButton>) => {
  const auth = useAuth();
  const isAuthenticated = useIsAuthenticated();

  return (
    <FormButton formAction={auth.signIn} disabled={isAuthenticated} {...props}>
      Sign in
    </FormButton>
  );
};

const Inputs = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <input
        disabled={isAuthenticated}
        placeholder="Email"
        required
        type="email"
        name="email"
      />
      <input
        disabled={isAuthenticated}
        placeholder="Password"
        required
        type="password"
        name="password"
      />
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
    <SignIn />
    <Flex>
      <SignUps />
    </Flex>
    <SignOut />
  </Flex>
);
