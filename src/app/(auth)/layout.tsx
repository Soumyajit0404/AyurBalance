import AuthWrapper from "@/hooks/use-auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
