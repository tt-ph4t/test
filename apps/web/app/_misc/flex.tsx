import React from "react";

const defaultElement: React.ElementType = "div";

type Props<as extends React.ElementType> = {
  as?: as;
  gap?: number;
} & Omit<React.ComponentProps<as>, "as" | "gap">;

export const Flex = <as extends React.ElementType = typeof defaultElement>({
  as,
  gap = 3,
  style,
  ...props
}: Props<as>) => {
  const Component = as ?? defaultElement;

  return (
    <Component
      style={{
        display: "flex",
        gap: `calc(var(--spacing) * ${gap})`,
        flexWrap: "wrap",
        alignItems: "flex-start",
        ...style,
      }}
      {...props}
    />
  );
};
