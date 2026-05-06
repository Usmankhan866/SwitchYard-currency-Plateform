"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { useEcommerce } from "@/contexts/ecommerce-context";
import { mockProducts, gradientMap } from "@/lib/mock-ecommerce";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const t = useTranslations();
  const { wishlist, toggleWishlist, addToCart } = useEcommerce();

  const wishlisted = mockProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <PageBreadcrumb
        title="Wishlist"
        items={[{ label: "E-commerce" }, { label: "Wishlist" }]}
      />

      {wishlisted.length === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t("common.emptyWishlist")}
          </h3>
          <p className="text-muted-foreground mb-6">
            Save products you love so you can easily find them later.
          </p>
          <Button asChild>
            <Link href="/ecommerce/products">{t("common.browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        /* ── Product grid ─────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlisted.map((product) => {
            const gradient =
              gradientMap[product.color] ?? "from-gray-400 to-gray-600";
            const outOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                className="group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col"
              >
                {/* Gradient image area */}
                <div
                  className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  {product.badge && (
                    <span className="absolute top-3 left-3">
                      <Badge
                        className={
                          product.badge === "Sale"
                            ? "bg-red-500 hover:bg-red-500 text-white"
                            : product.badge === "New"
                            ? "bg-green-500 hover:bg-green-500 text-white"
                            : "bg-orange-500 hover:bg-orange-500 text-white"
                        }
                      >
                        {product.badge}
                      </Badge>
                    </span>
                  )}
                  {outOfStock && (
                    <span className="absolute top-3 right-3">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {product.category}
                    </p>
                    <h6 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                      {product.name}
                    </h6>
                    <StarRating rating={product.rating} count={product.reviewCount} />
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("common.remove")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1.5"
                      disabled={outOfStock}
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {t("common.addToCart")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
