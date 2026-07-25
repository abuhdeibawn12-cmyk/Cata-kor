"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AccountIcon, BagIcon, Footer as SiteFooter } from "./ExactHome";

const PRODUCT_PATH = "/products/nad-advanced-500mg";

type Product = {
  name: string;
  benefit?: string;
  price: string;
  image: string;
  href?: string;
  available?: boolean;
};

const bestSellers: Product[] = [
  {
    name: "Liposomal NAD⁺",
    benefit: "Daily cellular energy*",
    price: "$44.99",
    image: "/catakor/product-nad.avif",
    href: PRODUCT_PATH,
  },
  {
    name: "NMN Complex",
    benefit: "NAD⁺ pathway support*",
    price: "$55.95",
    image: "/catakor/product-nmn.avif",
    available: false,
  },
  {
    name: "Liposomal Glutathione",
    benefit: "Antioxidant defense*",
    price: "$39.99",
    image: "/catakor/product-glutathione.avif",
    available: false,
  },
  {
    name: "CA-AKG",
    benefit: "Healthy aging support*",
    price: "$44.99",
    image: "/catakor/product-caakg.avif",
    available: false,
  },
  {
    name: "NAD⁺ & NMN Complex",
    benefit: "Dual cellular energy support*",
    price: "$85.99",
    image: "/catakor/product-duo.avif",
  },
  {
    name: "The Longevity Trio",
    benefit: "Complete daily support*",
    price: "$119.99",
    image: "/catakor/product-trio.avif",
  },
].filter(
  (product) =>
    product.image !== "/catakor/product-duo.avif" &&
    product.image !== "/catakor/product-trio.avif",
);

const experts = [
  {
    name: "Myro Figura",
    title: "UCLA-Trained MD",
    image:
      "https://catakor.com/cdn/shop/files/09_25TGheadshotsscrubsstandingsmiling.jpg?v=1762428684&width=408",
    quote:
      "With Cata-Kor's liposomal absorption technology, I know I'm getting a formula designed for better effectiveness.",
  },
  {
    name: "Kayla Barnes-Lentz",
    title: "Leading Female Longevity Expert",
    image:
      "https://catakor.com/cdn/shop/files/NicoleAvena_030723_0003_8edb1051-2982-4c6f-b3ca-a6a905a5c863.jpg?v=1762426902&width=408",
    quote:
      "NAD⁺ is non-negotiable in my longevity protocol, and Cata-Kor is a brand I trust.",
  },
  {
    name: "Dr. Zach Colls",
    title: "NBA/NFL Physical Rehab Coach",
    image:
      "https://catakor.com/cdn/shop/files/PXL_20251031_161014203.MP.jpg?v=1762427856&width=408",
    quote:
      "Bioavailable formulas, clean ingredients, trusted quality, and easy daily use.",
  },
  {
    name: "Jenoah McKiver",
    title: "Olympic Gold Champion",
    image:
      "https://catakor.com/cdn/shop/files/IMG_8372.jpg?v=1763389661&width=408",
    quote:
      "I use Cata-Kor to support recovery, longevity, and cognitive performance.",
  },
];

const galleryImages = [
  "https://catakor.com/cdn/shop/files/Main_NAD.png?v=1783679981&width=1100",
  "https://catakor.com/cdn/shop/files/1_NAD500_f37a2f8b-6fd5-43fe-a035-c83a38d54ec4.jpg?v=1783421258&width=1100",
  "https://catakor.com/cdn/shop/files/2_NAD500_0ce4c9f5-fb17-4ac1-88c2-d4c4af74fc81.jpg?v=1783421259&width=1100",
  "https://catakor.com/cdn/shop/files/3_NAD500_284becb5-a117-43e4-88d0-7ef566cd05c9.jpg?v=1783421258&width=1100",
  "https://catakor.com/cdn/shop/files/4_NAD500_5964a474-23e5-46af-8174-36317bfd56c5.jpg?v=1783421258&width=1100",
  "https://catakor.com/cdn/shop/files/5_NAD500_db73c746-222c-4b71-8b49-e692af53d992.jpg?v=1783421258&width=1100",
  "https://catakor.com/cdn/shop/files/6_NAD500_0d0e1d1a-b711-4d81-8c41-95cdd9fa436c.jpg?v=1783421258&width=1100",
  "https://catakor.com/cdn/shop/files/7_NAD500_Manufactured_for.jpg?v=1783421258&width=1100",
  "https://catakor.com/cdn/shop/files/5_NAD500_a65fca12-ec33-4c89-9817-0919959280a7.jpg?v=1774889169&width=1100",
  "https://catakor.com/cdn/shop/files/7_NAD500_91bae966-e2fe-499f-9161-0c0f42aca355.jpg?v=1774889169&width=1100",
  "https://catakor.com/cdn/shop/files/8_NAD500-2.jpg?v=1774889110&width=1100",
  "https://catakor.com/cdn/shop/files/3_NAD500_8218ca19-959f-4866-9785-0017cff2f5a0.jpg?v=1774889153&width=1100",
  "https://catakor.com/cdn/shop/files/NAD250_2_jars_5e4c06d5-c927-43b1-9da8-f943028f9ece.jpg?v=1774889110&width=1100",
  "https://catakor.com/cdn/shop/files/NAD250_3_jars_33cd95d4-1a11-40c4-a248-3e99cbee0e30.jpg?v=1774889110&width=1100",
];

const quantityOptions = [
  { jars: 3, label: "3 Jars", note: "BEST VALUE", each: 32.58, total: 97.74 },
  { jars: 2, label: "2 Jars", note: "MOST POPULAR", each: 33.99, total: 67.98 },
  { jars: 1, label: "1 Jar", note: "", each: 38.24, total: 38.24 },
];

type CartSelection = (typeof quantityOptions)[number];

function Header({
  cartCount = 0,
  onCart,
}: {
  cartCount?: number;
  onCart?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        <a href={PRODUCT_PATH}>CHRISTMAS IN JULY – UP TO 32% OFF</a>
      </div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Cata-Kor home">
          <img src="/catakor/logo.svg" alt="Cata-Kor" />
        </Link>
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <Link href="/collections/shop-all">SHOP</Link>
          <Link href="/collections/shop-all">BEST SELLERS</Link>
          <Link href="/pages/science-benefits">SCIENCE</Link>
          <Link href="/#about">ABOUT</Link>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="header-icon-button cart-icon-link"
            onClick={onCart}
            aria-label={`Open shopping bag with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <BagIcon />
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
          <button
            type="button"
            className="header-icon-button account-disabled"
            aria-label="Account unavailable"
            aria-disabled="true"
            disabled
          >
            <AccountIcon />
          </button>
        </div>
      </header>
    </>
  );
}

function MysteryChip() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <button className="mystery-chip" type="button" onClick={() => setVisible(false)}>
      MYSTERY DISCOUNT <span>×</span>
    </button>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      className={product.available === false ? "product-card is-sold-out" : "product-card"}
      href={product.available === false ? undefined : product.href ?? "/collections/shop-all"}
      aria-disabled={product.available === false}
    >
      <div className="product-card-topline">
        <span className={product.available === false ? "product-stock-label" : ""}>
          {product.available === false ? "OUT OF STOCK" : "BESTSELLERS"}
        </span>
        <small>CONTENTS<br />CERTIFIED</small>
      </div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
      <h3>{product.name}</h3>
      {product.benefit && <p>{product.benefit}</p>}
      <strong className={product.available === false ? "is-out-of-stock" : ""}>
        {product.available === false ? "OUT OF STOCK" : product.price}
      </strong>
    </a>
  );
}

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <div>
          <img className="footer-logo" src="/catakor/logo.svg" alt="Cata-Kor" />
          <p className="footer-tagline">AGE ON YOUR TERMS*</p>
          <div className="social-links">
            <a href="https://www.tiktok.com/@trycatakor">TIKTOK</a>
            <a href="https://www.instagram.com/trycatakor/">INSTAGRAM</a>
          </div>
        </div>
        <div>
          <h2>QUICK LINKS</h2>
          <Link href={PRODUCT_PATH}>NAD⁺ ADVANCED</Link>
          <Link href="/pages/science-benefits">SCIENCE AND QUALITY</Link>
          <Link href="/#about">ABOUT CATA-KOR</Link>
          <Link href="/products/nad-advanced-500mg#faq">FAQS</Link>
        </div>
        <div>
          <h2>SUPPORT</h2>
          <Link href="/#footer">CONTACT US</Link>
          <Link href="/#footer">REFUND POLICY</Link>
          <Link href="/#footer">PRIVACY POLICY</Link>
          <Link href="/#footer">TERMS OF SERVICE</Link>
        </div>
        <div className="newsletter">
          <h2>GET 10% OFF</h2>
          <p>Sign up for our latest news & articles. We won’t send spam.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="newsletter-email">Email</label>
            <input id="newsletter-email" type="email" placeholder="EMAIL" />
            <button type="submit">JOIN</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CATA-KOR</span>
        <p>
          *These statements have not been evaluated by the Food and Drug Administration. This product is not
          intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <div className="site-shell">
      <Header />
      <main id="main-content">
        <section className="home-hero">
          <div className="hero-copy">
            <div className="clinicians-line">
              <b>⌇ CLINICIANS’ CHOICE ⌇</b>
              <span>170+ clinicians share this product on FrontrowMD.</span>
            </div>
            <h1>AGE ON YOUR<br />TERMS*</h1>
            <p>Support your body at the cellular level, so you can feel better for longer*</p>
            <div className="hero-cta-row">
              <div><span className="stars">★★★★★</span> 900,000+ customers, 40,000+ reviews</div>
              <a className="primary-button" href="#products">SHOP BEST SELLERS</a>
            </div>
          </div>
          <img className="hero-products" src="/catakor/hero-products-hq.png" alt="Cata-Kor longevity supplements" />
        </section>

        <section className="products-section" id="products">
          <div className="section-heading products-heading">
            <div>
              <h2>BUILD YOUR DAILY LONGEVITY ROUTINE*</h2>
              <p><b>60 day</b> guarantee <span>·</span> <b>1M+</b> consumers</p>
            </div>
            <Link className="lime-button" href="/collections/shop-all">SHOP ALL <span>→</span></Link>
          </div>
          <div className="product-track">
            {bestSellers.map((product) => <ProductCard product={product} key={product.name} />)}
          </div>
        </section>

        <section className="experts-section">
          <div className="section-heading centered-heading">
            <span className="eyebrow">TRUSTED BY PROFESSIONALS</span>
            <h2>RECOMMENDED BY HEALTH EXPERTS<br />& ELITE ATHLETES</h2>
            <p>Real routines, real standards, and a shared commitment to feeling better for longer.</p>
          </div>
          <div className="expert-grid">
            {experts.map((expert) => (
              <article className="expert-card" key={expert.name}>
                <img src={expert.image} alt={expert.name} />
                <div>
                  <p className="quote">“{expert.quote}”</p>
                  <h3>{expert.name}</h3>
                  <span>{expert.title}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="disclosure">These individuals partner with Cata-Kor as paid ambassadors, sharing their real routines and results.</p>
        </section>

        <section className="science-section" id="science">
          <div className="science-art" aria-hidden="true">
            <img src="/catakor/cell-star.webp" alt="" />
          </div>
          <div className="science-copy">
            <span className="eyebrow">WHY CATA-KOR</span>
            <h2>LONGEVITY SUPPORT<br />MADE SIMPLE*</h2>
            <p>
              Our formulas support the key systems behind energy, healthy aging, and cellular defense — with
              every ingredient chosen for a clear reason.*
            </p>
            <ul>
              <li>Best-quality ingredients</li>
              <li>Transparent dosing</li>
              <li>Third-party tested by NSF</li>
            </ul>
            <Link className="primary-button" href="/pages/science-benefits">EXPLORE OUR SCIENCE</Link>
          </div>
        </section>

        <section className="founder-section" id="about">
          <div className="founder-copy">
            <span className="eyebrow">OUR STORY</span>
            <h2>LONGEVITY,<br />MADE ACCESSIBLE</h2>
            <p>
              “When I first became obsessed with the science of longevity, I kept seeing the same pattern: the
              most interesting tools were expensive, confusing, or available only through private clinics.
            </p>
            <p>
              I started Cata-Kor to bring serious longevity support into everyday routines — built with quality
              ingredients, transparent dosing, and standards people can trust.”
            </p>
            <div className="founder-signature"><b>VLAD SEURUK</b><span>FOUNDER OF CATA-KOR®</span></div>
          </div>
          <div className="founder-image-wrap"><img src="/catakor/founder.webp" alt="Vlad Seuruk, Cata-Kor founder" /></div>
        </section>
      </main>
      <Footer />
      <MysteryChip />
    </div>
  );
}

function ProductGallery() {
  const [activeImage, setActiveImage] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const visibleThumbnails = 6;
  const maximumThumbnailStart = Math.max(0, galleryImages.length - visibleThumbnails);

  useEffect(() => {
    galleryImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  const selectImage = (index: number) => {
    setActiveImage(index);
    if (index < thumbnailStart) setThumbnailStart(index);
    if (index >= thumbnailStart + visibleThumbnails) {
      setThumbnailStart(Math.min(maximumThumbnailStart, index - visibleThumbnails + 1));
    }
  };

  const moveThumbnails = (direction: -1 | 1) => {
    setThumbnailStart((current) => Math.max(0, Math.min(maximumThumbnailStart, current + direction)));
  };

  return (
    <div className="product-gallery">
      <div className="thumbnail-rail">
        <button
          type="button"
          className="thumbnail-arrow thumbnail-arrow-up"
          onClick={() => moveThumbnails(-1)}
          disabled={thumbnailStart === 0}
          aria-label="Show previous product images"
        >
          ‹
        </button>
        <div className="thumbnail-list" aria-label="Product images">
          <div
            className="thumbnail-track"
            style={{ "--thumbnail-start": thumbnailStart } as React.CSSProperties}
          >
            {galleryImages.map((image, index) => (
              <button
                type="button"
                className={index === activeImage ? "active" : ""}
                onClick={() => selectImage(index)}
                aria-label={`View product image ${index + 1}`}
                aria-current={index === activeImage ? "true" : undefined}
                key={image}
              >
                <img src={image.replace("width=1100", "width=180")} alt="" />
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="thumbnail-arrow thumbnail-arrow-down"
          onClick={() => moveThumbnails(1)}
          disabled={thumbnailStart === maximumThumbnailStart}
          aria-label="Show more product images"
        >
          ›
        </button>
      </div>
      <div className="main-product-image">
        {activeImage === 0 && <span className="product-star-shape" aria-hidden="true" />}
        <img
          className="selected-product-image"
          src={galleryImages[activeImage]}
          alt={`Liposomal NAD⁺ product image ${activeImage + 1}`}
          key={galleryImages[activeImage]}
        />
        <div className="gallery-mobile-controls" aria-label="Product image navigation">
          <button
            type="button"
            onClick={() => selectImage(Math.max(0, activeImage - 1))}
            disabled={activeImage === 0}
            aria-label="Previous product image"
          >
            ←
          </button>
          <span>{activeImage + 1} / {galleryImages.length}</span>
          <button
            type="button"
            onClick={() => selectImage(Math.min(galleryImages.length - 1, activeImage + 1))}
            disabled={activeImage === galleryImages.length - 1}
            aria-label="Next product image"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function SupplementFactsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"facts" | "ingredients">("facts");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTab("facts");
        onClose();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  return (
    <div
      className="supplement-modal-layer"
      role="presentation"
      hidden={!open}
      aria-hidden={!open}
      onMouseDown={() => {
        setTab("facts");
        onClose();
      }}
    >
      <section
        className="supplement-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplement-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="supplement-modal-tabs" role="tablist" aria-label="Product details">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "facts"}
            className={tab === "facts" ? "active" : ""}
            onClick={() => setTab("facts")}
          >
            Supplement Facts
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "ingredients"}
            className={tab === "ingredients" ? "active" : ""}
            onClick={() => setTab("ingredients")}
          >
            Ingredients
          </button>
        </div>

        <div className="supplement-facts-panel" role="tabpanel" hidden={tab !== "facts"}>
          <h2 id="supplement-dialog-title">Supplement Facts</h2>
          <p>Serving Size: 2 Capsules;<br />Servings Per Container: 30</p>
          <div className="facts-heavy-rule" />
          <h3><span>Amount Per Serving:</span><span>DV%</span></h3>
          <div className="facts-heavy-rule" />
          <div className="facts-row">
            <strong>LipoNAD™ (providing β-NAD⁺ ≥ 250 mg)</strong>
            <b>500 mg</b>
          </div>
          <div className="facts-row">
            <span>Trans-Resveratrol</span>
            <b>50 mg</b>
          </div>
          <div className="facts-heavy-rule" />
          <strong className="facts-daily-value">** Daily Value (DV) not established</strong>
          <p className="facts-other">
            Other Ingredients: Sunflower (Helianthus annuus) Lecithin, Silicon Dioxide, Magnesium
            Stearate, Microcrystalline Cellulose, Vegetable Cellulose (Capsule).
          </p>
        </div>

        <div className="ingredients-panel" role="tabpanel" hidden={tab !== "ingredients"}>
          <h2>Key Ingredients</h2>
          <div className="ingredient-heading">
            <strong>LipoNAD™ (providing β-NAD⁺ ≥250 mg)</strong>
            <b>500 mg</b>
          </div>
          <p>
            LipoNAD™ delivers β-NAD directly into cells using liposomes for better absorption. It’s
            included to boost cellular energy, metabolism, and healthy-aging benefits more effectively.
          </p>
          <div className="ingredient-heading">
            <strong>Trans-Resveratrol</strong>
            <b>50 mg</b>
          </div>
          <p>
            Trans-Resveratrol is included for its antioxidant and anti-inflammatory effects. It helps
            enhance mitochondrial function and supports the activity of NAD⁺ in the body.
          </p>
          <h3>Other Ingredients</h3>
          <p>
            Sunflower (Helianthus annuus) Lecithin, Silicon Dioxide, Magnesium Stearate,
            Microcrystalline Cellulose, Vegetable Cellulose (Capsule).
          </p>
        </div>

        <button
          type="button"
          className="supplement-continue"
          onClick={() => {
            setTab("facts");
            onClose();
          }}
        >
          Continue
        </button>
        <div className="supplement-shipping"><span aria-hidden="true">🇺🇸</span> <b>FREE</b> Shipping to USA</div>
      </section>
    </div>
  );
}

function ProductAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="product-accordion" open={defaultOpen}>
      <summary>{title}<span>＋</span></summary>
      <div>{children}</div>
    </details>
  );
}

const customerVideos = [
  {
    title: "A solid energy boost",
    src: "https://cdn.shopify.com/videos/c/o/v/49c88503ac444cceaa07ad0941b19ff2.mov",
  },
  {
    title: "An even better formula",
    src: "https://cdn.shopify.com/videos/c/o/v/626b669d4eae4d0f95088060c2662d1f.mp4",
  },
  {
    title: "I feel younger",
    src: "https://cdn.shopify.com/videos/c/o/v/1763917e32c14cbda12acec0ee8bcd3d.mp4",
  },
];

function CustomerVideoCard({ title, src }: { title: string; src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  return (
    <article className={playing ? "story-card is-playing" : "story-card"}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        controls={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button type="button" className="story-play-button" onClick={togglePlayback} aria-label={`Play ${title}`}>
          ▶
        </button>
      )}
      <h3>{title}</h3>
    </article>
  );
}

function ProductPurchase({ onAdded }: { onAdded: (selection: CartSelection) => void }) {
  const [quantity, setQuantity] = useState(3);
  const [added, setAdded] = useState(false);
  const [factsOpen, setFactsOpen] = useState(false);
  const selectedQuantity = useMemo(
    () => quantityOptions.find((option) => option.jars === quantity) ?? quantityOptions[0],
    [quantity],
  );

  const addToCart = () => {
    setAdded(true);
    onAdded(selectedQuantity);
  };

  return (
    <section className="product-info" aria-label="Product information">
      <nav className="breadcrumbs" aria-label="Breadcrumbs"><Link href="/">Home</Link><span>/</span><b>Liposomal NAD⁺</b></nav>
      <div className="review-line"><span className="stars">★★★★★</span><b>4.9/5</b> (2200+ reviews)</div>
      <div className="product-title-row"><h1>LIPOSOMAL NAD⁺</h1><span>500MG</span></div>
      <p className="product-subtitle">Liposomal NAD+ Supplement</p>
      <div className="product-facts">
        <b>60 Capsules</b><span>/</span><b>500MG</b><span>/</span>
        <button type="button" onClick={() => setFactsOpen(true)}>SUPPLEMENT FACTS</button>
      </div>
      <SupplementFactsModal open={factsOpen} onClose={() => setFactsOpen(false)} />

      <div className="purchase-group">
        <div className="purchase-label"><h2>Select Quantity</h2><span>{quantity * 60} Capsules</span></div>
        <div className="quantity-options">
          {quantityOptions.map((option) => (
            <button
              type="button"
              className={quantity === option.jars ? "quantity-option selected" : "quantity-option"}
              onClick={() => setQuantity(option.jars)}
              aria-pressed={quantity === option.jars}
              key={option.jars}
            >
              {option.note && <em>{option.note}</em>}
              <span className={`quantity-bottles quantity-bottles-${option.jars}`} aria-hidden="true">
                {Array.from({ length: option.jars }, (_, index) => (
                  <img src="/catakor/product-nad.avif" alt="" key={index} />
                ))}
              </span>
              <b>{option.label}</b>
              <span>${option.each.toFixed(2)}{option.jars > 1 ? "/each" : ""}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="one-time-purchase" aria-label="One-time purchase">
        <span>
          <b>ONE-TIME PURCHASE</b>
          <small>No subscription or recurring charges</small>
        </span>
        <strong>${selectedQuantity.total.toFixed(2)}</strong>
      </div>

      <button type="button" className={added ? "add-to-cart added" : "add-to-cart"} onClick={addToCart}>
        <span>{added ? "ADDED TO CART" : "ADD TO CART"}</span>
        <b>${selectedQuantity.total.toFixed(2)}</b>
      </button>
      <div className="delivery-row"><span>● &nbsp; Delivered in 3–5 days</span><span>🇺🇸 FREE Shipping to USA</span></div>
      <div className="clinician-box">
        <b>⌇ CLINICIANS’ CHOICE ⌇</b>
        <p>192 clinicians share this on <i>FrontrowMD</i> without compensation.</p>
        <a href="#reviews">View clinicians & learn more</a>
      </div>
      <div className="guarantee-strip"><b>Less than 1%</b> of customers claim our Money Back Guarantee.</div>
      <div className="product-accordions">
        <ProductAccordion title="How to Use"><p>Take two capsules daily, with or without food.</p></ProductAccordion>
        <ProductAccordion title="Safety"><p>Use as directed. Consult your healthcare provider before use if needed.</p></ProductAccordion>
        <ProductAccordion title="How long does it take to notice effects?"><p>Many customers report changes within a few weeks of consistent daily use.*</p></ProductAccordion>
      </div>

      <section className="customer-video-section" aria-labelledby="customer-video-title">
        <h2 id="customer-video-title">JOIN 100,000+ OTHERS <span aria-hidden="true">💚</span></h2>
        <div className="story-grid">
          {customerVideos.map((video) => <CustomerVideoCard {...video} key={video.title} />)}
        </div>
      </section>

      <nav className="product-jump-links" aria-label="Learn more about this product">
        <h2>Learn more about:</h2>
        <div>
          <a href="#main-content">↓ <span>How it Works</span></a>
          <a href="#main-content">↓ <span>Benefits</span></a>
          <a href="#results">↓ <span>Real Results</span></a>
          <a href="#guarantee">↓ <span>Why Cata-Kor</span></a>
          <a href="#reviews">↓ <span>Comparison</span></a>
          <a href="#faq">↓ <span>FAQs</span></a>
        </div>
      </nav>
    </section>
  );
}

const testimonials = [
  {
    name: "Stefano Barberi",
    role: "Professional Mountain Bike and Gravel Racer",
    image: "https://catakor.com/cdn/shop/files/PXL_20251031_161014203.MP.jpg?v=1762427856&width=900",
    quote: "In the two weeks since I started using it, I’ve noticed my recovery feels smoother.*",
  },
  {
    name: "Zach Calls",
    role: "Doctor of Physical Therapy",
    image: "https://catakor.com/cdn/shop/files/Untitled-design-87_cc69b1bd-9ef7-4551-9182-d71dce66217b.png?v=1762428122&width=900",
    quote: "Cata-Kor NAD⁺ has become one of my go-to supplements for supporting overall energy, recovery, and longevity.*",
  },
  {
    name: "Stephania Rene",
    role: "Personal Trainer",
    image: "https://catakor.com/cdn/shop/files/image0.jpg?v=1762428427&width=900",
    quote: "I’m so thankful I found such a high quality company to trust with their third party testing efforts!*",
  },
  {
    name: "Katie Blank",
    role: "Orthopedic Physical Therapist",
    image: "https://catakor.com/cdn/shop/files/BCO.b1cb0ad0-0e84-4d32-bd89-08ee8ae1dee8.png?v=1762428559&width=900",
    quote: "I recommend Cata-Kor NAD+ due to the high quality ingredients and concentration of NAD+.*",
  },
  {
    name: "Dr. Maria Sophocles",
    role: "Gynecologist & Women’s Health Advocate",
    image: "https://catakor.com/cdn/shop/files/09_25TGheadshotsscrubsstandingsmiling.jpg?v=1762428684&width=900",
    quote: "Cata-Kor’s liposomal NAD+ formulation is an important distinction when considering an NAD+ formulation.*",
  },
  {
    name: "Dr. Nicole Avena",
    role: "Nutrition Expert and Author, Cata-Kor Partner",
    image: "https://catakor.com/cdn/shop/files/NicoleAvena_030723_0003_8edb1051-2982-4c6f-b3ca-a6a905a5c863.jpg?v=1762426902&width=900",
    quote: "NAD+ plays an essential role in the process of energy production.*",
  },
  {
    name: "Dr. Cyntia Brown",
    role: "Clinical Pharmacologist & Women’s Health Expert",
    image: "https://catakor.com/cdn/shop/files/image_588.png?v=1762167390&width=900",
    quote: "What really stands out to me is Cata-Kor’s dedication to science and transparency.*",
  },
  {
    name: "Sidney Outlaw",
    role: "Professional Fighter",
    image: "https://catakor.com/cdn/shop/files/image_7.png?v=1762167225&width=900",
    quote: "It helps you calm everything down. This is a great product. Don’t waste your time. Give it a try.*",
  },
  {
    name: "Dr. Chelsea Azarcon",
    role: "Naturopathic Medical Doctor",
    image: "https://catakor.com/cdn/shop/files/image_9.png?v=1762167226&width=900",
    quote: "Cata-Kor NAD was the first NAD that I felt a significant improvement from taking, within a matter of weeks.*",
  },
  {
    name: "Shayna Powless",
    role: "Professional Cyclist",
    image: "https://catakor.com/cdn/shop/files/image_69898.png?v=1762167381&width=900",
    quote: "I’ve been choosing to supplement with NAD+ due to its role in efficient cellular energy production and overall cellular wellness.*",
  },
  {
    name: "Alecia Beckford-Stewart",
    role: "DC, CCSP, ICSC, CSCS",
    image: "https://catakor.com/cdn/shop/files/image_5_989.png?v=1762167402&width=900",
    quote: "With my glowing skin and consistently high energy levels, I can confidently say this is a wellness product I highly recommend.*",
  },
  {
    name: "Tyler Lesher",
    role: "NBA Performance Therapist",
    image: "https://catakor.com/cdn/shop/files/IMG_8372.jpg?v=1763389661&width=900",
    quote: "NAD⁺ supports cellular energy, mitochondrial function, and the natural repair processes that help us move and feel our best.*",
  },
  {
    name: "Miranda Kay Barber",
    role: "Professional Fighter and Trainer",
    image: "https://catakor.com/cdn/shop/files/IMG_3145.jpg?v=1763389765&width=900",
    quote: "I’m focused on supporting cellular energy and longevity in my performance. Excited to share my experience as I go.*",
  },
  {
    name: "Kristin Mackay",
    role: "NPC Athlete, Fitness & Nutrition Coach",
    image: "https://catakor.com/cdn/shop/files/69984753-956A-4271-92AC-E0C50282A687.jpg?v=1763389847&width=900",
    quote: "Cata-Kor helps with the overall regeneration of cells and how your body uses energy on a cellular level.*",
  },
  {
    name: "Morgan Adams",
    role: "Certified Holistic Sleep Coach, MSW",
    image: "https://catakor.com/cdn/shop/files/Web_Resolution-05.jpg?v=1763389950&width=900",
    quote: "After taking Cata-Kor for a couple of weeks, I saw a 6% increase in my recovery scores according to my WHOOP data.*",
  },
];

function ProductReviewCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeReview, setActiveReview] = useState(0);

  const goToReview = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActiveReview(index);
  };

  const moveReviews = (direction: -1 | 1) => {
    const next = Math.min(Math.max(activeReview + direction * 4, 0), testimonials.length - 1);
    goToReview(next);
  };

  const updateActiveReview = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const nextDistance = Math.abs(card.offsetLeft - track.scrollLeft);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = index;
      }
    });
    setActiveReview(closest);
  };

  return (
    <section className="endorser-reviews-section" id="reviews" aria-labelledby="review-carousel-title">
      <h2 className="sr-only" id="review-carousel-title">Customer and professional reviews</h2>
      <div className="review-carousel-track" ref={trackRef} onScroll={updateActiveReview}>
        {testimonials.map((testimonial, index) => (
          <article className="review-card" key={testimonial.name}>
            <img src={testimonial.image} alt={testimonial.name} />
            <h3>{testimonial.name}</h3>
            <span>{testimonial.role}</span>
            <div className="review-rule" />
            <b aria-hidden="true">“</b>
            <p>{testimonial.quote}</p>
            <span className="sr-only">Review {index + 1} of {testimonials.length}</span>
          </article>
        ))}
      </div>
      <div className="review-pagination" aria-label="Select a review">
        {testimonials.map((testimonial, index) => (
          <button
            type="button"
            className={activeReview === index ? "active" : ""}
            onClick={() => goToReview(index)}
            aria-label={`Go to ${testimonial.name}'s review`}
            aria-current={activeReview === index ? "true" : undefined}
            key={testimonial.name}
          />
        ))}
      </div>
      <div className="review-arrow-row">
        <button type="button" onClick={() => moveReviews(-1)} disabled={activeReview === 0} aria-label="Previous reviews">←</button>
        <button type="button" onClick={() => moveReviews(1)} disabled={activeReview >= testimonials.length - 4} aria-label="Next reviews">→</button>
      </div>
      <p className="review-disclosure">
        *These individuals partner with Cata-Kor as compensated endorsers, sharing their personal opinions and
        experiences. They do not provide medical advice. Statements have not been evaluated by the FDA.
      </p>
    </section>
  );
}

export function ProductPage() {
  const [cartItems, setCartItems] = useState<CartSelection[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!cartOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cartOpen]);

  return (
    <div className="site-shell product-page">
      <Header cartCount={cartItems.length} onCart={() => setCartOpen(true)} />
      <main id="main-content">
        <div className="product-layout">
          <ProductGallery />
          <ProductPurchase onAdded={(selection) => setCartItems((items) => [...items, selection])} />
        </div>

        <ProductReviewCarousel />

        <section className="result-proof-section" id="results">
          <article className="result-proof-card">
            <img
              src="https://catakor.com/cdn/shop/files/before-after-image.png?v=1751561115"
              alt="Aaron before and after eight weeks using Cata-Kor"
            />
            <div>
              <h2>AARON</h2>
              <h3>Before vs. 8 Weeks using Cata-Kor</h3>
              <p>“I started taking this after noticing low energy. Two months in, I feel sharper, more alert, and feel noticeably healthier.”</p>
              <span>⚡ More Energy</span>
              <small>Taking: <a href="#main-content">Cata-Kor NAD⁺ Advanced LipoNAD™ 500mg</a></small>
            </div>
          </article>
        </section>

        <section className="product-guarantee-section" id="guarantee">
          <div className="product-guarantee-copy">
            <h2>PEACE-OF-MIND<br />GUARANTEE</h2>
            <p>Every bottle is backed by our lifetime Money-Back Promise.</p>
            <div>
              <article><strong>LIFETIME</strong><span>Risk-free return<br />window</span></article>
              <article><strong>&lt; 1%</strong><span>Customers who ever<br />request a refund</span></article>
            </div>
            <small>Simply email our support team if you’d like a full refund—no returns, hoops, or hassles.</small>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <h2>FREQUENTLY ASK QUESTION</h2>
          <div className="faq-accordion-list">
            <ProductAccordion title="How should I take the NAD supplement?" defaultOpen><p>Take 2 capsules every day with or without food.</p></ProductAccordion>
            <ProductAccordion title="How long does it take to see results?"><p>Results vary, but many customers report changes within a few weeks of daily use.*</p></ProductAccordion>
            <ProductAccordion title="Are there side effects?"><p>The formula is designed for everyday use. Follow the label and consult your clinician if you have questions.</p></ProductAccordion>
            <ProductAccordion title="Is this NAD+ made in the USA?"><p>Yes. Cata-Kor supplements are manufactured in the USA and third-party tested.</p></ProductAccordion>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MysteryChip />
      <div
        className="drawer-layer"
        role="presentation"
        hidden={!cartOpen}
        aria-hidden={!cartOpen}
        onMouseDown={() => setCartOpen(false)}
      >
        <aside
          className="cart-drawer product-cart-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-cart-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="drawer-heading">
            <h2 id="product-cart-title">YOUR CART</h2>
            <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button>
          </div>
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <span>0</span>
              <h3>Your cart is empty</h3>
              <p>Choose your NAD⁺ supply and add it to your daily longevity routine.</p>
              <button type="button" className="primary-button" onClick={() => setCartOpen(false)}>
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <>
              <div className="product-cart-items">
                {cartItems.map((item, index) => (
                  <article key={`${item.jars}-${index}`}>
                    <img src="/catakor/product-nad.avif" alt="Cata-Kor Liposomal NAD⁺" />
                    <div>
                      <h3>LIPOSOMAL NAD⁺ 500MG</h3>
                      <p>{item.label} · One-time purchase</p>
                      <strong>${item.total.toFixed(2)}</strong>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.label} from cart`}
                      onClick={() => setCartItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
              <div className="product-cart-summary">
                <span>SUBTOTAL</span>
                <strong>${cartItems.reduce((total, item) => total + item.total, 0).toFixed(2)}</strong>
              </div>
              <button type="button" className="product-cart-checkout">CHECKOUT</button>
              <button type="button" className="product-cart-continue" onClick={() => setCartOpen(false)}>
                CONTINUE SHOPPING
              </button>
            </>
          )}
          <p className="drawer-footnote">Free U.S. shipping · Lifetime money-back guarantee</p>
        </aside>
      </div>
    </div>
  );
}
