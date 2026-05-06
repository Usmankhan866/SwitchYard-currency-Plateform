import { mockProducts } from "@/lib/mock-ecommerce";
import ProductDetail from "./product-detail";

export function generateStaticParams() {
  return mockProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage() {
  return <ProductDetail />;
}
