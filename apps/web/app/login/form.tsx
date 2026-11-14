"use client";

import { useAuth } from "@/app/_misc/auth";
import { useIsAuthenticated } from "@/app/_misc/auth/session";
import { Flex } from "@/app/_misc/flex";
import { FormButton } from "@/app/_misc/form-button";
import { useIsServerOnlineSWR } from "@/app/_misc/use-is-server-online-swr";
import { faker } from "@faker-js/faker";

const useDisabled = (requireAuthenticated = false) => {
  const isAuthenticated = useIsAuthenticated();
  const { isServerOnline } = useIsServerOnlineSWR();

  return !isServerOnline || requireAuthenticated
    ? !isAuthenticated
    : isAuthenticated;
};

const SignUps = () => {
  const auth = useAuth();
  const disabled = useDisabled();

  return (
    <>
      <FormButton formAction={auth.signUp} disabled={disabled}>
        Sign up
      </FormButton>
      <button
        type="button"
        onClick={async () => {
          const formData = new FormData();
          const email = faker.internet.email();

          formData.set("email", email);
          formData.set("password", email);

          await auth.signUp(formData);
        }}
        disabled={disabled}
      >
        Quick sign up (password = email)
      </button>
    </>
  );
};

const SignOut = () => {
  const auth = useAuth();
  const disabled = useDisabled(true);

  return (
    <button disabled={disabled} type="button" onClick={auth.signOut}>
      Sign out
    </button>
  );
};

export default function Form() {
  const auth = useAuth();
  const disabled = useDisabled();

  return (
    <Flex
      as="form"
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
      }}
      action={auth.signIn}
    >
      <input
        disabled={disabled}
        placeholder="Email"
        required
        type="email"
        name="email"
      />
      <input
        disabled={disabled}
        placeholder="Password"
        required
        type="password"
        name="password"
      />
      <FormButton disabled={disabled}>Sign in</FormButton>
      <Flex>
        <SignUps />
      </Flex>
      <SignOut />
    </Flex>
  );
}
