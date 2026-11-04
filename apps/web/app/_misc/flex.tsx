import React from "react";

type Props<as extends React.ElementType> = {
  as?: as;
  gap?: number;
} & Omit<React.ComponentProps<as>, "as" | "gap">;

export const Flex = <T extends React.ElementType = "div">({
  as,
  gap = 3,
  style,
  ...props
}: Props<T>) => {
  const Component = as ?? "div";

  return (
    <Component
      style={{
        display: "flex",
        gap: `calc(var(--spacing) * ${gap})`,
        flexWrap: "wrap",
        ...style,
      }}
      {...props}
    />
  );
};
