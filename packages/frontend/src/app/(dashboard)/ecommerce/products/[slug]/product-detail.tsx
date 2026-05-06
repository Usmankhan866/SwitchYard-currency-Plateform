"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import {
  Card,
  CardContent,
} from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@dashboardpack/core/components/ui/tabs";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { useEcommerce } from "@/contexts/ecommerce-context";
import {
  getProductBySlug,
  getRelatedProducts,
  mockReviews,
  gradientMap,
} from "@/lib/mock-ecommerce";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";

function StarRating({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }
        />
      ))}
    </div>
  );
}

const MOCK_SPECS = [
  { label: "Brand", value: "SwitchYard Capital Goods" },
  { label: "Weight", value: "1.2 kg" },
  { label: "Dimensions", value: "30 × 20 × 10 cm" },
  { label: "Material", value: "Premium Grade" },
  { label: "Warranty", value: "1 Year Limited" },
  { label: "SKU", value: "ADM-001-BLK" },
];

export default function ProductDetail() {
  const t = useTranslations();
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug);

  const { addToCart, toggleWishlist, isInWishlist } = useEcommerce();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-medium text-foreground">
          Product not found
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/ecommerce/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = getRelatedProducts(product, 4);
  const isOnSale = !!product.originalPrice;
  const savePercent = isOnSale
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }
  function increment() {
    setQuantity((q) => Math.min(product!.stock, q + 1));
  }

  return (
    <div>
      <PageBreadcrumb
        title={product.name}
        items={[
          { label: "E-commerce" },
          { label: "Products", href: "/ecommerce/products" },
          { label: product.name },
        ]}
      />

      {/* Two-column layout */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Left: Image */}
        <div className="relative">
          <div
            className={`relative h-80 rounded-lg bg-gradient-to-br ${gradientMap[product.color]} flex items-center justify-center`}
          >
            <span className="px-8 text-center text-xl font-semibold text-white">
              {product.name}
            </span>
            {product.badge && (
              <span
                className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium text-white ${
                  product.badge === "New"
                    ? "bg-primary"
                    : product.badge === "Hot"
                      ? "bg-orange-500"
                      : "bg-red-500"
                }`}
              >
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={product.rating} size={16} />
              <span className="text-sm text-muted-foreground">
                {product.reviewCount} reviews
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ${product.price}
            </span>
            {isOnSale && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  Save {savePercent}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Stock status */}
          <div>
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {t("common.quantity")}
              </span>
              <div className="flex items-center rounded-md border border-input">
                <button
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  disabled={quantity >= product.stock}
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full gap-2"
              disabled={product.stock === 0}
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingCart size={16} />
              {t("common.addToCart")}
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart
                size={16}
                className={
                  inWishlist ? "fill-red-500 text-red-500" : ""
                }
              />
              {inWishlist ? t("common.removeFromWishlist") : t("common.addToWishlist")}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">{t("common.description")}</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({mockReviews.slice(0, 3).length})
              </TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>

            {/* Description */}
            <TabsContent value="description" className="mt-6 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Designed for everyday use, this product combines quality
                craftsmanship with thoughtful details. Each unit undergoes
                rigorous quality control to ensure you receive only the best.
                Whether you&apos;re using it at home, the office, or on the go,
                it&apos;s built to keep up with your lifestyle.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our products are backed by a dedicated support team and a
                hassle-free return policy. We stand behind everything we sell
                and are committed to your complete satisfaction.
              </p>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="mt-6 space-y-6">
              {mockReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientMap[review.color]} text-sm font-semibold text-white`}
                  >
                    {review.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {review.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                    <StarRating rating={review.rating} size={12} />
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specifications" className="mt-6">
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {MOCK_SPECS.map(({ label, value }) => (
                      <tr key={label} className="hover:bg-muted/30">
                        <td className="w-1/3 bg-muted/20 px-4 py-3 text-xs font-medium text-muted-foreground">
                          {label}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Related Products */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((related) => {
            const relatedInWishlist = isInWishlist(related.id);
            return (
              <Card key={related.id} className="overflow-hidden">
                <div
                  className={`relative h-48 bg-gradient-to-br ${gradientMap[related.color]} flex items-center justify-center rounded-t-lg`}
                >
                  <span className="px-4 text-center text-sm font-semibold text-white">
                    {related.name}
                  </span>
                  {related.badge && (
                    <span
                      className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                        related.badge === "New"
                          ? "bg-primary"
                          : related.badge === "Hot"
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                    >
                      {related.badge}
                    </span>
                  )}
                </div>

                <CardContent className="p-4">
                  <Link
                    href={`/ecommerce/products/${related.slug}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {related.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {related.category}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      ${related.price}
                    </span>
                    {related.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${related.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StarRating rating={related.rating} size={12} />
                    <span className="text-xs text-muted-foreground">
                      ({related.reviewCount})
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {related.stock > 0
                      ? `${related.stock} in stock`
                      : "Out of stock"}
                  </p>
                </CardContent>

                <div className="flex items-center gap-2 px-4 pb-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={related.stock === 0}
                    onClick={() => addToCart(related)}
                  >
                    {t("common.addToCart")}
                  </Button>
                  <button
                    onClick={() => toggleWishlist(related.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent"
                    aria-label={
                      relatedInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={16}
                      className={
                        relatedInWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
