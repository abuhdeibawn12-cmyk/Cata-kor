"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

const LIVE_SITE = "https://catakor.com";
const NAD_PATH = "/products/nad-advanced-500mg";

type Product = {
  name: string;
  benefit?: string;
  price: string;
  image: string;
  href: string;
  bestseller?: boolean;
};

const products: Product[] = [
  {
    name: "Liposomal NAD⁺",
    benefit: "Daily cellular energy*",
    price: "$44.99",
    image: "/catakor/product-nad.avif",
    href: NAD_PATH,
    bestseller: true,
  },
  {
    name: "NMN Complex",
    benefit: "NAD+ pathway support*",
    price: "$55.95",
    image: "/catakor/product-nmn.avif",
    href: `${LIVE_SITE}/products/nmn`,
    bestseller: true,
  },
  {
    name: "Liposomal Glutathione",
    benefit: "Antioxidant defense*",
    price: "$39.99",
    image: "/catakor/product-glutathione.avif",
    href: `${LIVE_SITE}/products/liposomal-glutathione`,
    bestseller: true,
  },
  {
    name: "CA-AKG",
    benefit: "Healthy aging support*",
    price: "$44.99",
    image: "/catakor/product-caakg.avif",
    href: `${LIVE_SITE}/products/ca-akg`,
    bestseller: true,
  },
  {
    name: "NMN Complex & Liposomal Glutathione",
    price: "$56.99",
    image: "/catakor/product-duo.avif",
    href: `${LIVE_SITE}/products/cata-kor-energy-defense-duo-nmn-1-000-mg-liposomal-glutathione-500-mg-vitamin-c-tmg-resveratrol`,
  },
  {
    name: "Liposomal NAD+ & NMN Complex",
    benefit: "Dual cellular energy support*",
    price: "$85.99",
    image: "/catakor/product-duo.avif",
    href: `${LIVE_SITE}/products/cata-kor-duo-liposomal-nad-advanced-500-mg-nmn-1000-mg-with-resveratrol-tmg-msm`,
  },
  {
    name: "NAD+ & NMN Complex & Glutathione",
    price: "$119.99",
    image: "/catakor/product-trio.avif",
    href: `${LIVE_SITE}/products/cata-kor-liposomal-glutathione-500-mg-nmn-1000-mg-liposomal-nad-advanced-500-mg`,
  },
];

const experts = [
  {
    name: "Myro Figura",
    title: "UCLA-Trained MD",
    image: "/catakor/expert-myro.avif",
    quote:
      "I’m usually picky about supplements, but with Cata-Kor’s liposomal absorption technology, I know I’m getting a formula designed for better effectiveness.",
  },
  {
    name: "Kayla Barnes-Lentz",
    title: "A Leading Expert in Female Longevity",
    image: "/catakor/expert-kayla.webp",
    quote:
      "NAD+ is non-negotiable in my longevity protocol, and Cata-Kor is a brand I trust. Their rigorous testing standards and commitment to quality matter more than anything.",
  },
  {
    name: "Dr. Zach Colls",
    title: "NBA/NFL Physical Rehab Coach",
    image: "/catakor/expert-zach.webp",
    quote:
      "Cata-Kor is exactly what I look for: bioavailable formulas, clean ingredients, trusted quality, and easy daily use.",
  },
  {
    name: "Jenoah McKiver",
    title: "Olympic Gold Champion",
    image: "/catakor/expert-jenoah.webp",
    quote:
      "My athletic career has taken a toll on my body. I use Cata-Kor to support recovery, longevity, and cognitive performance.",
  },
];

function Header({
  onCart,
  onAccount,
}: {
  onCart: () => void;
  onAccount: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        <a href={`${LIVE_SITE}/products/nmn`}>Christmas in July - Up to 32% Off</a>
      </div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Cata-Kor home">
          <img src="/catakor/logo.svg" alt="Cata-Kor" />
        </Link>
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
        </button>
        <nav
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <a href={`${LIVE_SITE}/collections`}>Shop</a>
          <a href={`${LIVE_SITE}/collections/all-products`}>Best Sellers</a>
          <a href="#science">Science</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-actions">
          <button className="header-icon-button" type="button" onClick={onCart} aria-label="Cart">
            <span className="bag-icon" aria-hidden="true">
              <span className="bag-handle" />
            </span>
          </button>
          <button
            className="header-icon-button"
            type="button"
            onClick={onAccount}
            aria-label="Log in"
          >
            <span className="user-icon" aria-hidden="true">
              <span />
            </span>
          </button>
        </div>
      </header>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <a className="product-card" href={product.href}>
      <div className="product-card-topline">
        {product.bestseller ? <span>Bestsellers</span> : <i />}
        <small>
          CONTENTS
          <br />
          CERTIFIED
        </small>
      </div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="stars" aria-label="5 out of 5 stars">
        ★★★★★
      </div>
      <h3>{product.name}</h3>
      {product.benefit && <p>{product.benefit}</p>}
      <strong>{product.price}</strong>
    </a>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const joinNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <div>
          <img className="footer-logo" src="/catakor/logo.svg" alt="Cata-Kor" />
          <p className="footer-tagline">AGE ON YOUR TERMS*</p>
          <div className="social-links">
            <a href="https://www.tiktok.com/@trycatakor">TikTok</a>
            <a href="https://www.instagram.com/trycatakor/">Instagram</a>
            <a href="mailto:hello@catakor.com">Email us</a>
          </div>
        </div>
        <div>
          <h2>QUICK LINKS</h2>
          <a href={`${LIVE_SITE}/pages/coa`}>COA</a>
          <a href={NAD_PATH}>NAD⁺ ADVANCED</a>
          <a href={`${LIVE_SITE}/products/nmn`}>NMN SUPPLEMENT</a>
          <a href={`${LIVE_SITE}/products/ca-akg`}>SKIN, HAIR &amp; NAILS</a>
          <a href={`${LIVE_SITE}/pages/science-benefits`}>SCIENCE AND QUALITY</a>
          <a href={`${LIVE_SITE}/pages/affiliate-program`}>AFFILIATE</a>
        </div>
        <div>
          <h2>SUPPORT</h2>
          <a href={`${LIVE_SITE}/policies/terms-of-service`}>TERMS OF SERVICE</a>
          <a href={`${LIVE_SITE}/policies/refund-policy`}>REFUND POLICY</a>
          <a href={`${LIVE_SITE}/policies/privacy-policy`}>PRIVACY POLICY</a>
          <a href={`${LIVE_SITE}/pages/faqs`}>FAQS</a>
          <a href={`${LIVE_SITE}/pages/contact`}>CONTACT US</a>
        </div>
        <div className="newsletter">
          <h2>GET 10% OFF</h2>
          {joined ? (
            <p className="form-success" role="status">
              You’re in — use code WELCOME10 at checkout.
            </p>
          ) : (
            <>
              <p>Signup for our latest news &amp; articles. We won’t give you spam mails.</p>
              <form onSubmit={joinNewsletter}>
                <label className="sr-only" htmlFor="newsletter-email">
                  Enter your email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button type="submit">Join</button>
              </form>
            </>
          )}
          <div className="payment-icons" aria-label="Payment methods">
            {["AMEX", "Pay", "Diners", "Discover", "G Pay", "MC", "PayPal", "Shop", "Venmo", "VISA"].map(
              (method) => <span key={method}>{method}</span>,
            )}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CATA-KOR</span>
        <p>
          *These statements have not been evaluated by the Food and Drug Administration. This product is
          not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </footer>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-heading">
          <h2 id="cart-title">YOUR CART</h2>
          <button type="button" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>
        <div className="empty-cart">
          <span>0</span>
          <h3>Your cart is empty</h3>
          <p>Build a daily longevity routine with our best sellers.</p>
          <a className="primary-button" href="#products" onClick={onClose}>
            SHOP BEST SELLERS
          </a>
        </div>
        <p className="drawer-footnote">Free U.S. shipping with subscription · 60-day guarantee</p>
      </aside>
    </div>
  );
}

function AccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="dialog-layer" role="presentation" onMouseDown={onClose}>
      <section
        className="account-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close login">
          ×
        </button>
        <img src="/catakor/logo.svg" alt="Cata-Kor" />
        <h2 id="account-title">YOUR CATA-KOR ACCOUNT</h2>
        <p>Manage subscriptions, orders, and delivery details through the secure customer portal.</p>
        <a
          className="primary-button"
          href={`${LIVE_SITE}/customer_authentication/redirect?locale=en&region_country=US`}
        >
          CONTINUE TO LOG IN
        </a>
      </section>
    </div>
  );
}

function Promotion({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [interest, setInterest] = useState("");
  const [email, setEmail] = useState("");
  const [complete, setComplete] = useState(false);

  const close = () => {
    onClose();
    window.sessionStorage.setItem("cata-kor-promo-seen", "1");
  };

  const claim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setComplete(true);
  };

  if (!open) return null;
  return (
    <div className="dialog-layer promo-layer" role="presentation" onMouseDown={close}>
      <section
        className="promo-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={close} aria-label="Close popup">
          ×
        </button>
        <div className="promo-orbit" aria-hidden="true">
          <img src="/catakor/product-nad.avif" alt="" />
        </div>
        <div className="promo-copy">
          <span className="eyebrow">MYSTERY DISCOUNT</span>
          {complete ? (
            <>
              <h2 id="promo-title">YOUR DISCOUNT IS UNLOCKED</h2>
              <p>Use this private code on your next Cata-Kor order.</p>
              <button
                className="promo-code"
                type="button"
                onClick={() => navigator.clipboard?.writeText("LONGEVITY15")}
                aria-label="Copy discount code LONGEVITY15"
              >
                LONGEVITY15 <span>CLICK TO COPY</span>
              </button>
              <a className="primary-button" href="#products" onClick={close}>
                SHOP NOW
              </a>
            </>
          ) : interest ? (
            <>
              <h2 id="promo-title">ONE LAST STEP</h2>
              <p>Tell us where to send your {interest.toLowerCase()} offer.</p>
              <form onSubmit={claim}>
                <label htmlFor="promo-email">Email address</label>
                <input
                  id="promo-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button className="primary-button" type="submit">
                  REVEAL MY DISCOUNT
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 id="promo-title">WHAT’S YOUR MAIN GOAL?</h2>
              <p>Choose one to reveal your Cata-Kor mystery offer.</p>
              <div className="promo-choices">
                {["Energy & Focus", "Age Reversal", "Glow Up", "Detox"].map((goal) => (
                  <button type="button" key={goal} onClick={() => setInterest(goal)}>
                    {goal}
                  </button>
                ))}
              </div>
              <button className="promo-skip" type="button" onClick={close}>
                No thanks
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export function HomePage() {
  const productsRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [activeExpert, setActiveExpert] = useState(-1);

  useEffect(() => {
    if (window.sessionStorage.getItem("cata-kor-promo-seen")) return;
    const timer = window.setTimeout(() => setPromoOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen || accountOpen || promoOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [accountOpen, cartOpen, promoOpen]);

  const moveProducts = (direction: number) => {
    const track = productsRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.78, behavior: "smooth" });
  };

  return (
    <div className="site-shell exact-home">
      <Header onCart={() => setCartOpen(true)} onAccount={() => setAccountOpen(true)} />
      <main id="main-content">
        <section className="home-hero">
          <div className="hero-copy">
            <div className="clinicians-line">
              <b>⌇ CLINICIANS’ CHOICE ⌇</b>
              <span>
                170+ clinicians share this product on FrontrowMD.{" "}
                <a
                  href="https://app.thefrontrowhealth.com/general-store/all?spi=true&utm_campaign=brands_website&utm_content=modal&utm_medium=5469&utm_source=1418&sort=featured&pid=5469"
                >
                  View clinicians &amp; learn more
                </a>
              </span>
            </div>
            <h1>
              AGE ON YOUR
              <br />
              TERMS*
            </h1>
            <p>Support your body at the cellular level, so you can feel better for longer*</p>
            <div className="hero-cta-row">
              <div>
                <span className="stars">★★★★★</span> 900,000+ customers, 40,000+ reviews
              </div>
              <a className="primary-button" href="#products">
                SHOP BEST SELLERS
              </a>
            </div>
          </div>
          <img
            className="hero-products"
            src="/catakor/hero-products.webp"
            alt="Cata-Kor longevity supplements"
          />
        </section>

        <section className="products-section" id="products">
          <div className="section-heading products-heading">
            <div>
              <h2>BUILD YOUR DAILY LONGEVITY ROUTINE*</h2>
              <p>
                <b>60 day</b> guarantee <span>·</span> <b>1M+</b> consumers
              </p>
            </div>
            <div className="products-actions">
              <div className="carousel-controls" aria-label="Product carousel controls">
                <button type="button" onClick={() => moveProducts(-1)} aria-label="Previous products">
                  ←
                </button>
                <button type="button" onClick={() => moveProducts(1)} aria-label="Next products">
                  →
                </button>
              </div>
              <a className="lime-button" href={`${LIVE_SITE}/collections/all-products`}>
                SHOP ALL <span>→</span>
              </a>
            </div>
          </div>
          <div className="product-track" ref={productsRef} tabIndex={0} aria-label="Best selling products">
            {products.map((product) => (
              <ProductCard product={product} key={product.name} />
            ))}
          </div>
        </section>

        <section className="experts-section">
          <div className="section-heading centered-heading">
            <h2>RECOMMENDED BY HEALTH EXPERTS &amp; ELITE ATHLETES</h2>
            <p>
              These individuals partner with Cata-Kor as paid ambassadors, sharing their real routines and
              results.
            </p>
          </div>
          <div className="expert-grid">
            {experts.map((expert, index) => (
              <article
                className={activeExpert === index ? "expert-card is-active" : "expert-card"}
                key={expert.name}
              >
                <img src={expert.image} alt={expert.name} />
                <div>
                  <button
                    className="expert-trigger"
                    type="button"
                    onClick={() => setActiveExpert((active) => (active === index ? -1 : index))}
                    aria-expanded={activeExpert === index}
                  >
                    <span>
                      <b>{expert.name}</b>
                      <small>{expert.title}</small>
                    </span>
                    <i>{activeExpert === index ? "−" : "+"}</i>
                  </button>
                  <p className="quote">“{expert.quote}”</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="science-section" id="science">
          <div className="science-live-copy">
            <h2>
              LONGEVITY SUPPORT
              <br />
              MADE SIMPLE*
            </h2>
            <p>
              Our formulas are built to support the key systems behind energy, healthy aging, and cellular
              defense — with every ingredient chosen for a clear reason*
            </p>
            <div className="science-benefits">
              <div><img src="/catakor/science-quality.svg" alt="" /><b>Best-quality<br />ingredients</b></div>
              <div><img src="/catakor/science-dose.svg" alt="" /><b>Transparent<br />dosing</b></div>
              <div><img src="/catakor/science-tested.svg" alt="" /><b>3-rd party<br />tested by NSF</b></div>
            </div>
            <a className="primary-button" href={`${LIVE_SITE}/pages/science-benefits`}>
              EXPLORE OUR SCIENCE
            </a>
          </div>
          <img className="science-bottle" src="/catakor/science-nmn.webp" alt="Cata-Kor NMN Complex" />
        </section>

        <section className="founder-section" id="about">
          <div className="founder-live-inner">
            <h2>LONGEVITY, MADE ACCESSIBLE</h2>
            <span className="founder-quote-mark">“</span>
            <p>When I first became obsessed with the science of longevity, I kept seeing the same pattern.</p>
            <p>
              <b>The most interesting tools — NAD+,</b> advanced wellness protocols, clinical-style testing —
              were often expensive, confusing, or only available to people with access to private clinics.
              But healthy aging should not feel exclusive.
            </p>
            <p>
              I started Cata-Kor to bring serious longevity support into everyday routines: products built
              with quality ingredients, transparent dosing, and testing standards people can trust.
            </p>
            <div className="founder-callout">
              <p>
                My goal was never to make another supplement brand.{" "}
                <b>
                  It was to build a company for people who want to feel better for longer — without making
                  longevity complicated or out of reach.
                </b>
              </p>
              <span>“</span>
            </div>
            <div className="founder-attribution">
              <b>Vlad Seuruk</b>
              <span>Founder of Cata-Kor® - Americas #1<br />NAD+ supplement brand.</span>
            </div>
            <img className="founder-cutout" src="/catakor/founder-cutout.webp" alt="Vlad Seuruk" />
          </div>
        </section>
      </main>
      <Footer />

      <button className="mystery-chip" type="button" onClick={() => setPromoOpen(true)}>
        MYSTERY DISCOUNT <span>×</span>
      </button>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} />
      <Promotion open={promoOpen} onClose={() => setPromoOpen(false)} />
    </div>
  );
}
