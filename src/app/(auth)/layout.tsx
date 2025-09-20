import AuthWrapper from "@/hooks/use-auth.tsx";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
