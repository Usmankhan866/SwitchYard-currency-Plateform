"use client";

import Link from "next/link";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { useEcommerce } from "@/contexts/ecommerce-context";
import { gradientMap } from "@/lib/mock-ecommerce";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const t = useTranslations();
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useEcommerce();

  const shipping = cartSubtotal > 100 ? 0 : 10;
  const tax = cartSubtotal * 0.1;
  const total = cartSubtotal + shipping + tax;

  return (
    <div>
      <PageBreadcrumb
        title="Shopping Cart"
        items={[{ label: "E-commerce" }, { label: "Cart" }]}
      />

      {cart.length === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t("common.emptyCart")}
          </h3>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/ecommerce/products">{t("common.browseProducts")}</Link>
          </Button>
        </div>
      ) : (
        /* ── Two-column layout ────────────────────────────────────────────── */
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* ── Left: Cart items ────────────────────────────────────────── */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <h5 className="text-base font-semibold text-foreground">
                  Cart Items ({cart.length})
                </h5>
              </CardHeader>
              <CardContent className="divide-y">
                {cart.map(({ product, quantity }) => {
                  const gradient =
                    gradientMap[product.color] ?? "from-gray-400 to-gray-600";
                  const subtotal = product.price * quantity;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      {/* Color swatch */}
                      <div
                        className={`h-16 w-16 shrink-0 rounded bg-gradient-to-br ${gradient}`}
                      />

                      {/* Name + category */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {formatPrice(product.price)} each
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-foreground">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Line subtotal */}
                      <div className="w-20 shrink-0 text-right">
                        <p className="font-semibold text-foreground">
                          {formatPrice(subtotal)}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* ── Right: Order Summary ─────────────────────────────────────── */}
          <div>
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <h5 className="text-base font-semibold text-foreground">
                  Order Summary
                </h5>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("common.subtotal")}</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("common.shipping")}</span>
                  {shipping === 0 ? (
                    <span className="font-medium text-green-500">Free</span>
                  ) : (
                    <span className="font-medium text-foreground">
                      {formatPrice(shipping)}
                    </span>
                  )}
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders over $100
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("common.tax")} (10%)</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(tax)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{t("common.total")}</span>
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button asChild className="w-full mt-2">
                  <Link href="/forms/wizard">{t("common.proceedToCheckout")}</Link>
                </Button>

                <div className="text-center">
                  <Link
                    href="/ecommerce/products"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("common.continueShopping")}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
