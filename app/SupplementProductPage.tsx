"use client";

import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "./ExactHome";

type PackOption = {
  jars: 1 | 2 | 3;
  each: number;
  total: number;
  label?: string;
};

type AccordionItem = {
  title: string;
  copy: string;
};

type SupplementProduct = {
  accent: "blue" | "brown";
  title: string;
  badge: string;
  subtitle: string;
  reviews: string;
  mainImage: string;
  gallery: string[];
  packs: PackOption[];
  accordions: AccordionItem[];
  faqs: AccordionItem[];
};

const glutathione: SupplementProduct = {
  accent: "blue",
  title: "LIPOSOMAL GLUTATHIONE",
  badge: "1155MG",
  subtitle: "Glutathione Supplement",
  reviews: "4.9 (107+ reviews)",
  mainImage: "https://catakor.com/cdn/shop/files/Main_Glu.png?v=1783680082&width=1100",
  gallery: [
    "https://catakor.com/cdn/shop/files/Main_Glu.png?v=1783680082&width=1100",
    "https://catakor.com/cdn/shop/files/2_180af383-77a1-4658-bad6-6f56081aea14.jpg?v=1777301848&width=1100",
    "https://catakor.com/cdn/shop/files/Glu_2.jpg?v=1784023438&width=1445",
    "https://catakor.com/cdn/shop/files/4_76de2ec1-d8f9-4fb4-a973-bcde17ca02e4.jpg?v=1777301849&width=1445",
    "https://catakor.com/cdn/shop/files/Glu_4.jpg?v=1784023438&width=1445",
    "https://catakor.com/cdn/shop/files/32.jpg?v=1783426405&width=1445",
    "https://catakor.com/cdn/shop/files/7139FNgEiTL._AC_SL1500.jpg?v=1784023470&width=1445",
    "https://catakor.com/cdn/shop/files/Glu_7.jpg?v=1784023437&width=1445",
    "https://catakor.com/cdn/shop/files/5_1_b1becfa8-499f-4364-95d8-53ede377bb0a.jpg?v=1780499486&width=1445",
    "https://catakor.com/cdn/shop/files/8_COA_test.png?v=1777037332&width=1445",
    "https://catakor.com/cdn/shop/files/9_2d951678-cb63-4457-94bc-e2479151a650.jpg?v=1780499486&width=1445",
  ],
  packs: [
    { jars: 3, each: 32.86, total: 98.59, label: "BEST VALUE" },
    { jars: 2, each: 32.29, total: 64.58, label: "MOST POPULAR" },
    { jars: 1, each: 33.99, total: 33.99 },
  ],
  accordions: [
    {
      title: "Details",
      copy:
        "A liposomal glutathione formula with vitamin C, selenium, vitamin B2 and resveratrol to support antioxidant activity and cellular defense.*",
    },
    {
      title: "How to Use",
      copy: "Take two capsules daily with water, with or without food.",
    },
    {
      title: "Safety",
      copy:
        "Consult a qualified healthcare professional before use if you are pregnant, nursing, taking medication or managing a medical condition.",
    },
    {
      title: "Ingredients",
      copy:
        "Liposomal glutathione, vitamin C, selenium, vitamin B2 and trans-resveratrol. See the product label for the complete ingredient list.",
    },
  ],
  faqs: [
    {
      title: "What makes this glutathione supplement unique?",
      copy:
        "The formula combines liposomal glutathione with complementary antioxidant cofactors, including vitamin C, selenium, vitamin B2 and resveratrol.",
    },
    {
      title: "What is liposomal delivery?",
      copy:
        "Liposomal delivery surrounds an ingredient with phospholipids to support stability and absorption.",
    },
    {
      title: "How should I take this supplement?",
      copy: "Take two capsules daily, or follow the guidance of your healthcare professional.",
    },
    {
      title: "Are there any side effects?",
      copy:
        "Individual responses vary. Stop use and consult a healthcare professional if you experience an unwanted reaction.",
    },
  ],
};

const nmn: SupplementProduct = {
  accent: "brown",
  title: "NMN 4-IN-1 NAD+ SUPPORT",
  badge: "1000MG",
  subtitle: "Designed to build, recycle, protect, and activate NAD+ pathways.",
  reviews: "4.9/5 (399+ reviews)",
  mainImage:
    "https://catakor.com/cdn/shop/files/Main_NMN_42c0bc37-5c6c-48ca-a3cc-4ca3790dca55.png?v=1783680309&width=1100",
  gallery: [
    "https://catakor.com/cdn/shop/files/Main_NMN_42c0bc37-5c6c-48ca-a3cc-4ca3790dca55.png?v=1783680309&width=1100",
    "https://catakor.com/cdn/shop/files/3_NMN_bbce3af2-5504-48dc-970c-fe25fff2a0ad.jpg?v=1783426601&width=1100",
    "https://catakor.com/cdn/shop/files/2_NMN_053d7393-a9db-469d-8ecb-51880935753c.jpg?v=1783426601&width=1445",
    "https://catakor.com/cdn/shop/files/4_NMN_e27e16fe-9161-41bc-b268-0ce9f64cfd55.jpg?v=1783426609&width=1445",
    "https://catakor.com/cdn/shop/files/7_NMN_1352f876-5cda-4e43-a370-8d14e63d9883.jpg?v=1783426609&width=1445",
    "https://catakor.com/cdn/shop/files/5_NMN_4123d42c-2f4a-4c6b-8eed-14ecea140918.jpg?v=1783426444&width=1445",
    "https://catakor.com/cdn/shop/files/5_NMN_4f364f54-6fc8-4ef4-9ab8-3c10b1b05739.jpg?v=1783426609&width=1445",
    "https://catakor.com/cdn/shop/files/9_NMN_bbefea93-83dd-486d-b27d-7f9277d60fb8.jpg?v=1783426608&width=1445",
    "https://catakor.com/cdn/shop/files/8_NMN_d6190cf0-d0a6-46c0-aa2a-4e5e73e22bca.jpg?v=1783426608&width=1445",
    "https://catakor.com/cdn/shop/files/9_NMN.jpg?v=1774889070&width=1445",
    "https://catakor.com/cdn/shop/files/NMN_2_pack-2.png?v=1774889070&width=1445",
    "https://catakor.com/cdn/shop/files/NMN_3_pack-2.png?v=1774889070&width=1445",
  ],
  packs: [
    { jars: 3, each: 33.99, total: 101.97, label: "BEST VALUE" },
    { jars: 2, each: 35.99, total: 71.98, label: "MOST POPULAR" },
    { jars: 1, each: 39.99, total: 39.99 },
  ],
  accordions: [
    {
      title: "How to Use",
      copy: "Take two capsules daily with water, with or without food.",
    },
    {
      title: "Ingredients",
      copy:
        "NMN, trimethylglycine (TMG), quercetin and trans-resveratrol. See the product label for the complete ingredient list.",
    },
    {
      title: "Shipping & Guarantee",
      copy:
        "Orders include tracked U.S. delivery and are backed by the Cata-Kor money-back guarantee.",
    },
    {
      title: "Third-Party Tested",
      copy:
        "Every batch is independently tested for identity, purity and quality before release.",
    },
  ],
  faqs: [
    {
      title: "What is NMN?",
      copy:
        "Nicotinamide mononucleotide is a precursor used by the body to make NAD+, a coenzyme involved in cellular energy pathways.",
    },
    {
      title: "Why combine NMN, TMG, quercetin and resveratrol?",
      copy:
        "The four ingredients are combined to support complementary longevity and cellular-energy pathways in one daily formula.*",
    },
    {
      title: "How should I take NMN 4-in-1?",
      copy: "Take two capsules daily, or follow the guidance of your healthcare professional.",
    },
    {
      title: "Is this product third-party tested?",
      copy: "Yes. Each batch is independently tested for identity, purity and quality.",
    },
  ],
};

function price(value: number) {
  return `$${value.toFixed(2)}`;
}

function QuantityImage({
  product,
  jars,
}: {
  product: SupplementProduct;
  jars: PackOption["jars"];
}) {
  return (
    <span className={`secondary-pack-image jars-${jars}`} aria-hidden="true">
      {Array.from({ length: jars }, (_, index) => (
        <img src={product.mainImage} alt="" key={index} />
      ))}
    </span>
  );
}

function ProductCart({
  open,
  onClose,
  product,
  selected,
}: {
  open: boolean;
  onClose: () => void;
  product: SupplementProduct;
  selected: PackOption;
}) {
  if (!open) return null;

  return (
    <div className="secondary-cart-layer" role="presentation" onMouseDown={onClose}>
      <aside
        className="secondary-cart"
        role="dialog"
        aria-modal="true"
        aria-labelledby="secondary-cart-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="secondary-cart-heading">
          <h2 id="secondary-cart-title">YOUR CART</h2>
          <button type="button" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>
        <div className="secondary-cart-item">
          <img src={product.mainImage} alt="" />
          <div>
            <h3>{product.title}</h3>
            <p>
              {selected.jars} {selected.jars === 1 ? "Jar" : "Jars"} · One-time purchase
            </p>
            <strong>{price(selected.total)}</strong>
          </div>
        </div>
        <div className="secondary-cart-total">
          <span>Subtotal</span>
          <strong>{price(selected.total)}</strong>
        </div>
        <button className="secondary-checkout" type="button">
          CHECKOUT
        </button>
        <p>Secure checkout · Free U.S. shipping</p>
      </aside>
    </div>
  );
}

function AccordionList({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <details key={item.title} open={index === 0}>
          <summary>
            {item.title}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{item.copy}</p>
        </details>
      ))}
    </div>
  );
}

function SupplementProductPage({ product }: { product: SupplementProduct }) {
  const [activeImage, setActiveImage] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [selectedJars, setSelectedJars] = useState<PackOption["jars"]>(3);
  const [cartOpen, setCartOpen] = useState(false);

  const selected = useMemo(
    () => product.packs.find((pack) => pack.jars === selectedJars) ?? product.packs[0],
    [product.packs, selectedJars],
  );

  useEffect(() => {
    product.gallery.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }, [product.gallery]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const visibleThumbnails = product.gallery.slice(thumbnailStart, thumbnailStart + 6);
  const chooseImage = (index: number) => {
    setActiveImage(index);
    if (index < thumbnailStart) setThumbnailStart(index);
    if (index >= thumbnailStart + 6) setThumbnailStart(Math.min(index - 5, product.gallery.length - 6));
  };

  return (
    <div className={`site-shell exact-home secondary-product-page accent-${product.accent}`}>
      <Header onCart={() => setCartOpen(true)} onAccount={() => undefined} />
      <main id="main-content">
        <section className="secondary-product-hero">
          <div className="secondary-gallery">
            <div className="secondary-thumbnail-column">
              <button
                type="button"
                className="secondary-thumbnail-arrow"
                onClick={() => setThumbnailStart((start) => Math.max(0, start - 1))}
                disabled={thumbnailStart === 0}
                aria-label="Show previous product images"
              >
                ↑
              </button>
              <div className="secondary-thumbnails">
                {visibleThumbnails.map((source, index) => {
                  const actualIndex = thumbnailStart + index;
                  return (
                    <button
                      className={activeImage === actualIndex ? "is-active" : ""}
                      type="button"
                      key={source}
                      onClick={() => chooseImage(actualIndex)}
                      aria-label={`Show product image ${actualIndex + 1}`}
                    >
                      <img src={source.replace(/width=\d+/, "width=180")} alt="" />
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="secondary-thumbnail-arrow"
                onClick={() =>
                  setThumbnailStart((start) => Math.min(product.gallery.length - 6, start + 1))
                }
                disabled={thumbnailStart >= product.gallery.length - 6}
                aria-label="Show more product images"
              >
                ↓
              </button>
            </div>

            <div className={activeImage === 0 ? "secondary-main-image has-star" : "secondary-main-image"}>
              {activeImage === 0 && <span className="secondary-gallery-star" aria-hidden="true" />}
              <img
                key={product.gallery[activeImage]}
                src={product.gallery[activeImage]}
                alt={`${product.title} product view ${activeImage + 1}`}
              />
              <button
                className="secondary-image-nav previous"
                type="button"
                onClick={() => chooseImage((activeImage - 1 + product.gallery.length) % product.gallery.length)}
                aria-label="Previous product image"
              >
                ‹
              </button>
              <button
                className="secondary-image-nav next"
                type="button"
                onClick={() => chooseImage((activeImage + 1) % product.gallery.length)}
                aria-label="Next product image"
              >
                ›
              </button>
            </div>
          </div>

          <div className="secondary-product-details">
            <div className="secondary-rating">
              <span aria-label="5 out of 5 stars">★★★★★</span>
              <b>{product.reviews}</b>
            </div>
            <div className="secondary-title-row">
              <h1>{product.title}</h1>
              <span>{product.badge}</span>
            </div>
            <p className="secondary-subtitle">{product.subtitle}</p>

            <div className="secondary-quantity-heading">
              <h2>Select Quantity</h2>
              <span>{selectedJars * 60} Capsules</span>
            </div>
            <div className="secondary-pack-grid">
              {product.packs.map((pack) => (
                <button
                  className={selectedJars === pack.jars ? "secondary-pack is-selected" : "secondary-pack"}
                  type="button"
                  key={pack.jars}
                  onClick={() => setSelectedJars(pack.jars)}
                  aria-pressed={selectedJars === pack.jars}
                  aria-label={`${pack.jars} ${pack.jars === 1 ? "jar" : "jars"}, ${price(pack.each)} each, ${price(pack.total)} total`}
                >
                  {pack.label && <em>{pack.label}</em>}
                  <QuantityImage product={product} jars={pack.jars} />
                  <strong>
                    {pack.jars} {pack.jars === 1 ? "Jar" : "Jars"}
                  </strong>
                  <span>{price(pack.each)}{pack.jars > 1 ? "/each" : ""}</span>
                </button>
              ))}
            </div>

            <div className="secondary-one-time">
              <span>ONE-TIME PURCHASE</span>
              <strong>{price(selected.total)}</strong>
            </div>
            <button className="secondary-add-button" type="button" onClick={() => setCartOpen(true)}>
              Add to Cart <strong>{price(selected.total)}</strong>
            </button>
            <div className="secondary-delivery">
              <span>● Free tracked delivery</span>
              <span>🇺🇸 FREE Shipping to USA</span>
            </div>
            <div className="secondary-guarantee">
              <span aria-hidden="true">◎</span>
              <b>Less than 1%</b> of customers claim our Money Back Guarantee.
            </div>

            <AccordionList items={product.accordions} className="secondary-details-accordions" />
          </div>
        </section>

        <section className="secondary-quality-strip">
          <div>
            <b>TRANSPARENT FORMULA</b>
            <span>Clear ingredient amounts</span>
          </div>
          <div>
            <b>THIRD-PARTY TESTED</b>
            <span>Independently quality checked</span>
          </div>
          <div>
            <b>MONEY-BACK GUARANTEE</b>
            <span>Shop with confidence</span>
          </div>
        </section>

        <section className="secondary-faq">
          <h2>FREQUENTLY ASK QUESTION</h2>
          <AccordionList items={product.faqs} />
        </section>
      </main>
      <Footer />
      <ProductCart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        product={product}
        selected={selected}
      />
    </div>
  );
}

export function GlutathioneProductPage() {
  return <SupplementProductPage product={glutathione} />;
}

export function NmnProductPage() {
  return <SupplementProductPage product={nmn} />;
}
