import { useIsServerOnlineSWR } from "@/app/_misc/use-is-server-online-swr";
import React from "react";
import { useFormStatus } from "react-dom";

const withFormStatus =
  <T extends React.ElementType>(Component: T) =>
  ({ disabled = false, ...props }: React.ComponentProps<T>) => {
    const formStatus = useFormStatus();
    const { isServerOnline } = useIsServerOnlineSWR();

    return (
      <Component
        disabled={!isServerOnline || formStatus.pending || disabled}
        {...props}
      />
    );
  };

// Flex + type PolymorphicProps
export const FormButton = withFormStatus("button");
export const FormInput = withFormStatus("input");
