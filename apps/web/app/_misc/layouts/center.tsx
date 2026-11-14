import React from "react";

export const CenterLayout = ({ children }: React.PropsWithChildren) => (
  <div
    style={
      {
        "--size": 100,

        height: "calc(1dvh * var(--size))",
        width: "calc(1dvw * var(--size))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      } as React.CSSProperties
    }
  >
    {children}
  </div>
);
