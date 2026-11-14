import { AuthenticatedLayout } from "@/app/_misc/layouts/authenticated";
import { CenterLayout } from "@/app/_misc/layouts/center";

export default function Layout({ children }: LayoutProps<"/account">) {
  return (
    <AuthenticatedLayout>
      <CenterLayout>{children}</CenterLayout>
    </AuthenticatedLayout>
  );
}
