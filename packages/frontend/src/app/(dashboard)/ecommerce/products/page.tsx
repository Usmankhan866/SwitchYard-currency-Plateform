"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Grid3x3, List, Search, Star, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { useEcommerce } from "@/contexts/ecommerce-context";
import {
  mockProducts,
  gradientMap,
  type Category,
} from "@/lib/mock-ecommerce";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Electronics",
  "Clothing",
  "Accessories",
  "Home & Office",
  "Sports",
];

type SortOption = "default" | "price-asc" | "price-desc" | "rating";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
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

function BadgeChip({ badge }: { badge: "New" | "Sale" | "Hot" }) {
  const color =
    badge === "New"
      ? "bg-primary"
      : badge === "Hot"
        ? "bg-orange-500"
        : "bg-red-500";
  return (
    <span
      className={`${color} absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium text-white`}
    >
      {badge}
    </span>
  );
}

export default function ProductListPage() {
  const t = useTranslations();
  const { addToCart, toggleWishlist, isInWishlist } = useEcommerce();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [sort, setSort] = useState<SortOption>("default");

  const filtered = useMemo(() => {
    let result = mockProducts.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [search, category, sort]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setSort("default");
  }

  return (
    <div>
      <PageBreadcrumb
        title="Products"
        items={[{ label: "E-commerce" }, { label: "Products" }]}
      />

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search + Sort + View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder={t("common.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent py-2 pl-9 pr-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortOption)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {/* Grid / List toggle */}
          <div className="flex items-center rounded-md border bg-muted/30 p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat === "All" ? t("common.all") : cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-lg font-medium text-foreground">
            {t("common.noProductsFound")}
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Grid View */}
      {filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <Card key={product.id} className="overflow-hidden">
                {/* Image area */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${gradientMap[product.color]} flex items-center justify-center rounded-t-lg`}
                >
                  <span className="text-center text-sm font-semibold text-white px-4">
                    {product.name}
                  </span>
                  {product.badge && <BadgeChip badge={product.badge} />}
                </div>

                <CardContent className="p-4">
                  <Link
                    href={`/ecommerce/products/${product.slug}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {product.category}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center gap-2 px-4 pb-4 pt-0">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product)}
                  >
                    {t("common.addToCart")}
                  </Button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent"
                    aria-label={
                      inWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={16}
                      className={
                        inWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {filtered.length > 0 && viewMode === "list" && (
        <div className="space-y-3">
          {filtered.map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <Card key={product.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Color swatch */}
                  <div
                    className={`h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br ${gradientMap[product.color]} flex items-center justify-center`}
                  >
                    {product.badge && (
                      <span className="text-center text-[10px] font-semibold text-white leading-tight px-1">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/ecommerce/products/${product.slug}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={product.rating} />
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-foreground">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                    >
                      {t("common.addToCart")}
                    </Button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background transition-colors hover:bg-accent"
                      aria-label={
                        inWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={16}
                        className={
                          inWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
