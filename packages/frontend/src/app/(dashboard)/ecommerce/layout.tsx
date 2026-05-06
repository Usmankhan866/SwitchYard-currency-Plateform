import { EcommerceProvider } from "@/contexts/ecommerce-context";

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EcommerceProvider>{children}</EcommerceProvider>;
}
