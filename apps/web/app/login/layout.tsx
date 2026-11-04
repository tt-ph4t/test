import type { CSSProperties } from "react";

export default function Layout({ children }: LayoutProps<"/login">) {
  return (
    <div
      style={
        {
          "--size": 100,

          height: "calc(1dvh * var(--size))",
          width: "calc(1dvw * var(--size))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
