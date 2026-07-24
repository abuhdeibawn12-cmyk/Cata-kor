"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AccountDialog, CartDrawer, Footer, Header } from "../../ExactHome";

type Availability = "all" | "in-stock" | "out-of-stock";
type SortOrder = "featured" | "a-z" | "z-a";

type CollectionProduct = {
  name: string;
  benefit: string;
  image: string;
  href?: string;
  available: boolean;
};

const products: CollectionProduct[] = [
  {
    name: "NAD⁺ Advanced LipoNAD™ 500mg",
    benefit: "Daily cellular energy*",
    image: "/catakor/product-nad.avif",
    href: "/products/nad-advanced-500mg",
    available: true,
  },
  {
    name: "Cata-Kor Liposomal Glutathione",
    benefit: "Antioxidant defense*",
    image: "/catakor/product-glutathione.avif",
    available: false,
  },
  {
    name: "NMN Supplement | Quercetin | TMG | Resveratrol – 1000 mg",
    benefit: "NAD+ pathway support*",
    image: "/catakor/product-nmn.avif",
    available: false,
  },
  {
    name: "Skin, Hair & Nails Supplement",
    benefit: "Healthy aging support*",
    image: "/catakor/product-caakg.avif",
    available: false,
  },
];

function CollectionCard({ product }: { product: CollectionProduct }) {
  return (
    <article className={product.available ? "collection-card" : "collection-card is-sold-out"}>
      <div className="collection-image-wrap">
        <span className="collection-sale-badge">Sale</span>
        {!product.available && <span className="collection-stock-badge">Sold out</span>}
        <img src={product.image} alt={product.name} />
      </div>
      <div className="collection-card-copy">
        <h2>{product.name}</h2>
        <p>{product.benefit}</p>
        {product.available && product.href ? (
          <Link className="collection-product-button" href={product.href}>
            View Product
          </Link>
        ) : (
          <button className="collection-product-button is-disabled" type="button" disabled>
            Out of stock
          </button>
        )}
      </div>
    </article>
  );
}

export function CollectionPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [availability, setAvailability] = useState<Availability>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");

  useEffect(() => {
    document.body.style.overflow = cartOpen || accountOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [accountOpen, cartOpen]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (availability === "in-stock") return product.available;
      if (availability === "out-of-stock") return !product.available;
      return true;
    });

    if (sortOrder === "a-z") {
      return [...filtered].sort((left, right) => left.name.localeCompare(right.name));
    }
    if (sortOrder === "z-a") {
      return [...filtered].sort((left, right) => right.name.localeCompare(left.name));
    }
    return filtered;
  }, [availability, sortOrder]);

  return (
    <div className="site-shell exact-home collection-page">
      <Header onCart={() => setCartOpen(true)} onAccount={() => setAccountOpen(true)} />
      <main id="main-content">
        <section className="collection-hero">
          <span className="eyebrow">CATA-KOR LONGEVITY SUPPORT</span>
          <h1>SHOP ALL</h1>
          <p>Science-driven daily formulas made with transparent dosing and trusted quality.</p>
        </section>

        <section className="collection-shell" id="products">
          <div className="collection-toolbar">
            <div className="collection-filter-wrap">
              <button
                className="collection-filter-button"
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                aria-expanded={filterOpen}
                aria-controls="availability-filter"
              >
                Filter: <b>{availability === "all" ? "Availability" : availability === "in-stock" ? "In stock" : "Out of stock"}</b>
                <span aria-hidden="true">{filterOpen ? "−" : "+"}</span>
              </button>
              {filterOpen && (
                <fieldset className="collection-filter-menu" id="availability-filter">
                  <legend>Availability</legend>
                  {[
                    ["all", "All products"],
                    ["in-stock", "In stock"],
                    ["out-of-stock", "Out of stock"],
                  ].map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="availability"
                        value={value}
                        checked={availability === value}
                        onChange={() => setAvailability(value as Availability)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </fieldset>
              )}
            </div>

            <div className="collection-sort">
              <span>{visibleProducts.length} products</span>
              <label htmlFor="collection-sort">Sort by:</label>
              <select
                id="collection-sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              >
                <option value="featured">Best selling</option>
                <option value="a-z">Alphabetically, A–Z</option>
                <option value="z-a">Alphabetically, Z–A</option>
              </select>
            </div>
          </div>

          <div className="collection-grid" aria-live="polite">
            {visibleProducts.map((product) => (
              <CollectionCard product={product} key={product.name} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}
