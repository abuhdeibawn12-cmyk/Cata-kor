"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const PRODUCT_PATH = "/products/nad-advanced-500mg";

type Product = {
  name: string;
  benefit?: string;
  price: string;
  image: string;
  href?: string;
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
  },
  {
    name: "Liposomal Glutathione",
    benefit: "Antioxidant defense*",
    price: "$39.99",
    image: "/catakor/product-glutathione.avif",
  },
  {
    name: "CA-AKG",
    benefit: "Healthy aging support*",
    price: "$44.99",
    image: "/catakor/product-caakg.avif",
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
];

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
];

const quantityOptions = [
  { jars: 3, label: "3 Jars", note: "BEST VALUE", each: 32.58, once: 114.99 },
  { jars: 2, label: "2 Jars", note: "MOST POPULAR", each: 33.99, once: 79.98 },
  { jars: 1, label: "1 Jar", note: "", each: 38.24, once: 44.99 },
];

function Header({ cartCount = 0 }: { cartCount?: number }) {
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
          <a href="#products">SHOP</a>
          <a href="#products">BEST SELLERS</a>
          <a href="#science">SCIENCE</a>
          <a href="#about">ABOUT</a>
        </nav>
        <div className="header-actions">
          <a href="#footer" className="bag-icon" aria-label={`Cart with ${cartCount} items`}>
            <span className="bag-handle" />
            {cartCount > 0 && <b>{cartCount}</b>}
          </a>
          <a href="#footer" className="user-icon" aria-label="Log in">
            <span />
          </a>
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
    <a className="product-card" href={product.href ?? "#products"}>
      <div className="product-card-topline">
        <span>BESTSELLERS</span>
        <small>CONTENTS<br />CERTIFIED</small>
      </div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
      <h3>{product.name}</h3>
      {product.benefit && <p>{product.benefit}</p>}
      <strong>{product.price}</strong>
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
          <a href={PRODUCT_PATH}>NAD⁺ ADVANCED</a>
          <a href="#science">SCIENCE AND QUALITY</a>
          <a href="#about">ABOUT CATA-KOR</a>
          <a href="#faq">FAQS</a>
        </div>
        <div>
          <h2>SUPPORT</h2>
          <a href="#footer">CONTACT US</a>
          <a href="#footer">REFUND POLICY</a>
          <a href="#footer">PRIVACY POLICY</a>
          <a href="#footer">TERMS OF SERVICE</a>
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
          <img className="hero-products" src="/catakor/hero-products.webp" alt="Cata-Kor longevity supplements" />
        </section>

        <section className="products-section" id="products">
          <div className="section-heading products-heading">
            <div>
              <h2>BUILD YOUR DAILY LONGEVITY ROUTINE*</h2>
              <p><b>60 day</b> guarantee <span>·</span> <b>1M+</b> consumers</p>
            </div>
            <a className="lime-button" href={PRODUCT_PATH}>SHOP ALL <span>→</span></a>
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
            <a className="primary-button" href="#science">EXPLORE OUR SCIENCE</a>
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
  return (
    <div className="product-gallery">
      <div className="thumbnail-list" aria-label="Product images">
        {galleryImages.map((image, index) => (
          <button
            type="button"
            className={index === activeImage ? "active" : ""}
            onClick={() => setActiveImage(index)}
            aria-label={`View product image ${index + 1}`}
            key={image}
          >
            <img src={image} alt="" />
          </button>
        ))}
      </div>
      <div className="main-product-image">
        <img className="product-star" src="/catakor/cell-star.webp" alt="" />
        <img className="selected-product-image" src={galleryImages[activeImage]} alt="Liposomal NAD⁺" />
      </div>
    </div>
  );
}

function ProductAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="product-accordion">
      <summary>{title}<span>＋</span></summary>
      <div>{children}</div>
    </details>
  );
}

function ProductPurchase({ onAdded }: { onAdded: () => void }) {
  const [quantity, setQuantity] = useState(3);
  const [plan, setPlan] = useState<"subscribe" | "once">("subscribe");
  const [added, setAdded] = useState(false);
  const selectedQuantity = useMemo(
    () => quantityOptions.find((option) => option.jars === quantity) ?? quantityOptions[0],
    [quantity],
  );
  const subscribeTotal = selectedQuantity.each * selectedQuantity.jars;
  const currentTotal = plan === "subscribe" ? subscribeTotal : selectedQuantity.once;

  const addToCart = () => {
    setAdded(true);
    onAdded();
  };

  return (
    <section className="product-info" aria-label="Product information">
      <nav className="breadcrumbs" aria-label="Breadcrumbs"><Link href="/">Home</Link><span>/</span><b>Liposomal NAD⁺</b></nav>
      <div className="review-line"><span className="stars">★★★★★</span><b>4.9/5</b> (2200+ reviews)</div>
      <div className="product-title-row"><h1>LIPOSOMAL NAD⁺</h1><span>500MG</span></div>
      <p className="product-subtitle">Liposomal NAD+ Supplement</p>
      <div className="product-facts"><b>60 Capsules</b><span>/</span><b>500MG</b><span>/</span><button type="button">SUPPLEMENT FACTS</button></div>

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
              <img src={`/catakor/product-nad.avif`} alt="" />
              <b>{option.label}</b>
              <span>${option.each.toFixed(2)}{option.jars > 1 ? "/each" : ""}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="plan-group">
        <div className="purchase-label"><h2>Choose Plan</h2><span>${(currentTotal / (quantity * 60)).toFixed(2)} per serving</span></div>
        <button
          type="button"
          className={plan === "subscribe" ? "plan-option selected" : "plan-option"}
          onClick={() => setPlan("subscribe")}
        >
          <span><b>Subscribe & Save</b><small>SAVE EXTRA 15%</small></span>
          <span><s>${selectedQuantity.once.toFixed(2)}</s><b>${subscribeTotal.toFixed(2)}</b></span>
        </button>
        {plan === "subscribe" && (
          <ul className="plan-benefits">
            <li><b>FREE</b> fast shipping</li><li><b>15% DISCOUNT</b> each delivery</li>
            <li><b>NO CONTRACT</b> cancel anytime</li><li>Out-of-stock <b>PROTECTION</b></li>
          </ul>
        )}
        <button
          type="button"
          className={plan === "once" ? "plan-option selected muted" : "plan-option muted"}
          onClick={() => setPlan("once")}
        >
          <b>One-time Purchase</b><span>${selectedQuantity.once.toFixed(2)}</span>
        </button>
      </div>

      <button type="button" className={added ? "add-to-cart added" : "add-to-cart"} onClick={addToCart}>
        <span>{added ? "ADDED TO CART" : "ADD TO CART"}</span>
        {plan === "subscribe" && <s>${selectedQuantity.once.toFixed(2)}</s>}
        <b>${currentTotal.toFixed(2)}</b>
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
    </section>
  );
}

const testimonials = [
  { name: "Stefano Barberi", role: "Professional Mountain Bike & Gravel Racer", image: "https://catakor.com/cdn/shop/files/PXL_20251031_161014203.MP.jpg?v=1762427856&width=408", quote: "My recovery feels smoother and my daily energy more consistent.*" },
  { name: "Dr. Nicole Avena", role: "Nutrition Expert and Author", image: "https://catakor.com/cdn/shop/files/NicoleAvena_030723_0003_8edb1051-2982-4c6f-b3ca-a6a905a5c863.jpg?v=1762426902&width=408", quote: "NAD⁺ plays an essential role in the process of energy production.*" },
  { name: "Shayna Powless", role: "Professional Cyclist", image: "https://catakor.com/cdn/shop/files/IMG_3145.jpg?v=1763389765&width=408", quote: "I choose NAD⁺ for its role in cellular energy production and overall wellness.*" },
  { name: "Tyler Lesher", role: "NBA Performance Therapist", image: "https://catakor.com/cdn/shop/files/Web_Resolution-05.jpg?v=1763389950&width=408", quote: "It supports the natural processes that help us move and feel our best.*" },
];

export function ProductPage() {
  const [cartCount, setCartCount] = useState(0);
  const [activeLearnTab, setActiveLearnTab] = useState("How it Works");
  const learnTabs = ["How it Works", "Benefits", "Real Results", "Why Cata-Kor", "Comparison"];

  return (
    <div className="site-shell product-page">
      <Header cartCount={cartCount} />
      <main id="main-content">
        <div className="product-layout">
          <ProductGallery />
          <ProductPurchase onAdded={() => setCartCount((value) => value + 1)} />
        </div>

        <section className="customer-video-section">
          <div className="section-heading centered-heading">
            <span className="eyebrow">REAL CUSTOMER ROUTINES</span>
            <h2>JOIN 100,000+ OTHERS 💚</h2>
          </div>
          <div className="story-grid">
            {[
              ["A SOLID ENERGY BOOST", "https://catakor.com/cdn/shop/files/image_588.png?v=1762167390&width=408"],
              ["AN EVEN BETTER FORMULA", "https://catakor.com/cdn/shop/files/image_7.png?v=1762167225&width=408"],
              ["I FEEL YOUNGER", "https://catakor.com/cdn/shop/files/image_69898.png?v=1762167381&width=408"],
            ].map(([title, image]) => (
              <article className="story-card" key={title}>
                <img src={image} alt="Cata-Kor customer" />
                <button type="button" aria-label={`Play ${title}`}>▶</button>
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="learn-section" id="science">
          <div className="learn-tabs" role="tablist" aria-label="Learn more about Liposomal NAD">
            {learnTabs.map((tab) => (
              <button key={tab} type="button" role="tab" aria-selected={activeLearnTab === tab} onClick={() => setActiveLearnTab(tab)}>{tab}</button>
            ))}
          </div>
          <div className="learn-content">
            <div>
              <span className="eyebrow">{activeLearnTab.toUpperCase()}</span>
              <h2>CELLULAR ENERGY,<br />DELIVERED SMARTER*</h2>
              <p>
                Liposomal delivery helps protect NAD⁺ through digestion, supporting more effective absorption
                and making this formula simple to use every day.*
              </p>
              <ul><li>500mg per serving</li><li>Advanced liposomal delivery</li><li>Third-party tested</li></ul>
            </div>
            <div className="learn-visual">
              <img src="https://catakor.com/cdn/shop/files/nad_500_web_1440x637_c7a1ec00-69c3-4fbe-9972-6ab3b9c438ee.jpg?v=1759397079" alt="Cata-Kor liposomal NAD science" />
            </div>
          </div>
        </section>

        <section className="daily-use-section">
          <div><span className="eyebrow">A ROUTINE FOR EVERY STAGE</span><h2>RECOMMENDED<br />DAILY USE</h2></div>
          <div className="age-card"><span>AGE 25–34</span><img src="/catakor/product-nad.avif" alt="NAD Core 250mg" /><h3>NAD⁺ CORE</h3><p>LipoNAD™ 250mg</p></div>
          <div className="age-card featured"><span>AGE 35+</span><img src="/catakor/product-nad.avif" alt="NAD Advanced 500mg" /><h3>NAD⁺ ADVANCED</h3><p>LipoNAD™ 500mg</p></div>
        </section>

        <section className="reviews-section" id="reviews">
          <div className="section-heading centered-heading"><span className="eyebrow">RECOMMENDED BY PROFESSIONALS</span><h2>TRUSTED IN REAL ROUTINES*</h2></div>
          <div className="review-grid">
            {testimonials.map((testimonial) => (
              <article className="review-card" key={testimonial.name}>
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="stars">★★★★★</div>
                <p>“{testimonial.quote}”</p>
                <h3>{testimonial.name}</h3>
                <span>{testimonial.role}</span>
              </article>
            ))}
          </div>
          <p className="disclosure">These individuals share personal opinions and experiences and do not provide medical advice.</p>
        </section>

        <section className="results-section">
          <div className="results-image"><img src="https://catakor.com/cdn/shop/files/before-after-image.png?v=1751561115" alt="Before and after Cata-Kor customer results" /></div>
          <div className="results-copy"><span className="eyebrow">AARON’S ROUTINE</span><h2>BEFORE VS. 8 WEEKS<br />USING CATA-KOR</h2><p>“Two months in, I feel sharper, more alert, and noticeably healthier.”*</p><strong>⚡ MORE ENERGY</strong></div>
        </section>

        <section className="peace-section">
          <span className="eyebrow">BUY WITH CONFIDENCE</span><h2>PEACE-OF-MIND GUARANTEE</h2><p>Every bottle is backed by our lifetime Money-Back Promise.</p>
          <div><article><strong>LIFETIME</strong><span>Risk-free return window</span></article><article><strong>&lt; 1%</strong><span>Customers who request a refund</span></article></div>
        </section>

        <section className="faq-section" id="faq">
          <div><span className="eyebrow">QUESTIONS, ANSWERED</span><h2>FREQUENTLY ASKED<br />QUESTIONS</h2></div>
          <div>
            <ProductAccordion title="How should I take the NAD supplement?"><p>Take two capsules every day, with or without food.</p></ProductAccordion>
            <ProductAccordion title="How long does it take to see results?"><p>Results vary, but many customers report changes within a few weeks of daily use.*</p></ProductAccordion>
            <ProductAccordion title="Are there side effects?"><p>The formula is designed for everyday use. Follow the label and consult your clinician if you have questions.</p></ProductAccordion>
            <ProductAccordion title="Is this NAD⁺ made in the USA?"><p>Yes. Cata-Kor supplements are manufactured in the USA and third-party tested.</p></ProductAccordion>
          </div>
        </section>
      </main>
      <Footer />
      <MysteryChip />
    </div>
  );
}
