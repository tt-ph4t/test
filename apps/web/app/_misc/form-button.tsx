import { useIsServerOnlineSWR } from "@/app/_misc/use-is-server-online-swr";
import React from "react";
import { useFormStatus } from "react-dom";

// input

export const FormButton = ({
  disabled = false,
  ...props
}: React.ComponentProps<"button">) => {
  const formStatus = useFormStatus();
  const { isServerOnline } = useIsServerOnlineSWR();

  return (
    <button
      disabled={!isServerOnline || formStatus.pending || disabled}
      {...props}
    />
  );
};
