import React from "react";
import { useFormStatus } from "react-dom";

export const FormButton = ({
  disabled = false,
  ...props
}: React.ComponentProps<"button">) => {
  const formStatus = useFormStatus();

  return <button disabled={formStatus.pending || disabled} {...props} />;
};
