"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AccountDialog, CartDrawer, Footer, Header } from "../../ExactHome";

const scienceAsset = (file: string) => `/catakor/science/${file}`;

const reviews = [
  {
    name: "Stefano Barberi",
    role: "Professional Mountain Bike and Gravel Racer",
    quote: "In the two weeks since I started using it, I’ve noticed my recovery feels smoother.*",
    image: scienceAsset("review-stefano.jpg"),
  },
  {
    name: "Zach Calls",
    role: "Doctor of Physical Therapy",
    quote:
      "Cata-Kor NAD⁺ has become one of my go-to supplements for supporting overall energy, recovery, and longevity.*",
    image: scienceAsset("review-zach.png"),
  },
  {
    name: "Stephania Rene",
    role: "Personal Trainer",
    quote:
      "I’m so thankful I found such a high quality company to trust with their third party testing efforts!*",
    image: scienceAsset("review-stephania.jpg"),
  },
  {
    name: "Katie Blank",
    role: "Orthopedic Physical Therapist",
    quote: "I recommend Cata-Kor NAD+ due to the high quality ingredients and concentration of NAD+.*",
    image: scienceAsset("review-katie.png"),
  },
  {
    name: "Dr. Maria Sophocles",
    role: "Gynecologist & Women’s Health Advocate",
    quote:
      "Cata-Kor’s liposomal NAD+ formulation is an important distinction when considering an NAD+ formulation.*",
    image: scienceAsset("review-maria.jpg"),
  },
  {
    name: "Dr. Nicole Avena",
    role: "Nutrition Expert and Author, Cata-Kor Partner",
    quote:
      "I recognize the importance of NAD+ in the human body. NAD+ plays an essential role in the process of energy production.*",
    image: scienceAsset("review-nicole.jpg"),
  },
  {
    name: "Dr. Cyntia Brown",
    role: "Clinical Pharmacologist & Women’s Health Expert",
    quote:
      "What really stands out to me about Cata-Kor NAD+ supplement is their dedication to science and transparency.*",
    image: scienceAsset("review-cyntia.png"),
  },
  {
    name: "Sidney Outlaw",
    role: "Professional Fighter",
    quote: "It helps you calm everything down. This is a great product. Don’t waste your time. Give it a try.*",
    image: scienceAsset("review-sidney.png"),
  },
  {
    name: "Dr. Chelsea Azarcon",
    role: "Naturopathic Medical Doctor",
    quote:
      "Cata-Kor NAD was the first NAD that I felt a significant improvement from taking, within a matter of weeks.*",
    image: scienceAsset("review-chelsea.png"),
  },
  {
    name: "Shayna Powless",
    role: "Professional Cyclist",
    quote:
      "I’ve been choosing to supplement with NAD+ due to its role in efficient cellular energy production and overall cellular wellness.*",
    image: scienceAsset("review-shayna.png"),
  },
  {
    name: "Alecia Beckford-Stewart",
    role: "DC, CCSP, ICSC, CSCS",
    quote:
      "With my glowing skin and consistently high energy levels, I can confidently say that Cata-Kor is a wellness product I highly recommend.*",
    image: scienceAsset("review-alecia.png"),
  },
  {
    name: "Tyler Lesher",
    role: "NBA Performance Therapist",
    quote:
      "NAD⁺ supports cellular energy, mitochondrial function, and the natural repair processes that help us move and feel our best.*",
    image: scienceAsset("review-tyler.jpg"),
  },
  {
    name: "Miranda Kay Barber",
    role: "Professional Fighter and Trainer",
    quote:
      "I’ve started incorporating Cata-Kor’s Liposomal NAD⁺ into my recovery routine to support cellular energy and longevity in my performance.*",
    image: scienceAsset("review-miranda.jpg"),
  },
  {
    name: "Kristin Mackay",
    role: "NPC Athlete, Fitness & Nutrition Coach",
    quote:
      "Cata-Kor helps with the overall regeneration of cells and how your body uses energy on a cellular level.*",
    image: scienceAsset("review-kristin.jpg"),
  },
  {
    name: "Morgan Adams",
    role: "Certified Holistic Sleep Coach, MSW",
    quote:
      "After taking Cata-Kor for a couple of weeks, I saw a 6% increase in my recovery scores according to my WHOOP data.*",
    image: scienceAsset("review-morgan.jpg"),
  },
];

const faqs = [
  {
    question: "How long does it take to see results from dietary supplements?",
    answer:
      "The time to experience results varies based on the supplement and individual factors. Consistency in usage is key. Some may notice changes quickly, while others may require more time.",
  },
  {
    question: "Are there potential side effects of dietary supplements?",
    answer:
      "While most people tolerate supplements well, side effects can occur, especially when exceeding recommended dosages. Common side effects are usually mild, but it’s essential to report any adverse reactions to a healthcare provider.",
  },
  {
    question: "What makes this supplement unique?",
    answer:
      "LipoNAD+ combines liposomal NAD+ with resveratrol in a formulation designed to support overall cellular function and general wellness as part of a healthy lifestyle.",
  },
  { question: "Are your products gluten-free?", answer: "Yes." },
  { question: "Are your products non-GMO/organic?", answer: "Yes." },
  {
    question: "Are your products safe to take with medications?",
    answer:
      "Please consult with a certified healthcare professional before trying any Cata-Kor supplement if you are currently taking medication or have a known medical condition.",
  },
  { question: "Do you have samples?", answer: "Not at this time." },
];

function ScienceProductCard({
  name,
  image,
  certificate,
  productHref,
  sale,
  benefit,
}: {
  name: string;
  image: string;
  certificate: string;
  productHref: string;
  sale?: boolean;
  benefit?: string;
}) {
  return (
    <article className="science-product-card">
      <Link className="science-product-image" href={productHref}>
        <img src={image} alt={name} />
        {sale && <span>Sale</span>}
      </Link>
      <Link className="science-product-name" href={productHref}>
        {name}
      </Link>
      {benefit && <p>{benefit}</p>}
      <a
        className="science-pill-button"
        href={certificate}
        target="_blank"
        rel="noopener noreferrer"
      >
        COA CERTIFICATE
      </a>
    </article>
  );
}

export function SciencePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [reviewsPaused, setReviewsPaused] = useState(false);
  const reviewTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = reviewTrackRef.current;
    const card = track?.children.item(activeReview) as HTMLElement | null;
    if (track && card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
  }, [activeReview]);

  useEffect(() => {
    if (reviewsPaused) return;
    const timer = window.setInterval(
      () => setActiveReview((current) => (current + 1) % reviews.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, [reviewsPaused]);

  const changeReview = (direction: number) => {
    setActiveReview((current) => (current + direction + reviews.length) % reviews.length);
  };

  return (
    <div className="site-shell science-page">
      <Header onCart={() => setCartOpen(true)} onAccount={() => setAccountOpen(true)} />
      <main id="main-content">
        <section className="science-coa-section" id="coa">
          <div className="science-page-container science-coa-grid">
            <div className="science-coa-copy">
              <span className="science-kicker">COA</span>
              <h1>Certificate of Analysis (COA)</h1>
              <p>
                As part of our commitment to quality and transparency, we provide official
                Certificates of Analysis for our products. These documents — issued by independent
                third-party laboratories — verify the purity, potency, and safety of each batch of
                our NAD+ supplements, so you can trace their quality firsthand.
              </p>
            </div>
            <div className="science-product-grid">
              <ScienceProductCard
                name="NAD⁺ Core LipoNAD™ 250mg"
                image={scienceAsset("nad-core.png")}
                certificate={scienceAsset("coa-nad-core.jpg")}
                productHref="/collections/shop-all"
              />
              <ScienceProductCard
                name="NAD⁺ Advanced LipoNAD™ 500mg"
                image="/catakor/product-nad-hq.png"
                certificate={scienceAsset("coa-nad-advanced.jpg")}
                productHref="/products/nad-advanced-500mg"
                sale
                benefit="Daily cellular energy*"
              />
            </div>
          </div>
        </section>

        <section className="science-feature science-feature-nmn">
          <div className="science-page-container science-feature-grid">
            <div className="science-feature-art">
              <img src={scienceAsset("nmn.png")} alt="Cata-Kor NMN Supplement" />
            </div>
            <div className="science-feature-copy">
              <h2>Cata-Kor NMN Supplement</h2>
              <p>
                Cata-Kor’s NMN Supplement with Resveratrol, TMG and Quercetin is a high-purity NAD+
                supplement designed to support cellular energy and healthy aging.
              </p>
              <a
                className="science-pill-button"
                href={scienceAsset("coa-nmn.png")}
                target="_blank"
                rel="noopener noreferrer"
              >
                COA CERTIFICATE
              </a>
            </div>
          </div>
        </section>

        <section className="science-feature science-feature-akg">
          <div className="science-page-container science-feature-grid">
            <div className="science-feature-copy">
              <h2>CA AKG</h2>
              <p>
                Some days you glow. Others … not so much. This product was made for both. AKG
                supports lasting energy, biotin feeds your hair, skin, and nails, and MSM helps your
                joints move without protest. Together, they quietly remind your body how to feel
                balanced again. Not a miracle pill. Picture a thoughtful nudge toward feeling
                strong, steady, and a little more you.
              </p>
              <a
                className="science-pill-button"
                href={scienceAsset("coa-ca-akg.png")}
                target="_blank"
                rel="noopener noreferrer"
              >
                COA CERTIFICATE
              </a>
            </div>
            <div className="science-feature-art">
              <img src={scienceAsset("ca-akg.png")} alt="Cata-Kor CA AKG supplement" />
            </div>
          </div>
        </section>

        <section className="science-quality-section" id="quality">
          <div className="science-page-container science-quality-grid">
            <div className="science-quality-copy">
              <span className="science-kicker">Liposomal</span>
              <h2>Science and Quality</h2>
              <p>
                In a preclinical animal study, our LipoNAD™ preserved NAD+ levels in the liver at
                9.31x higher than regular NAD+.**
              </p>
              <a
                className="science-pill-button"
                href={scienceAsset("liponad-study.pdf")}
                target="_blank"
                rel="noopener noreferrer"
              >
                READ THE SCIENTIFIC STUDY
              </a>
            </div>
            <img
              className="science-quality-chart"
              src={scienceAsset("bioavailability.png")}
              alt="Liposomal NAD+ test results showing 9.31 times higher preserved NAD+ levels"
            />
          </div>
        </section>

        <section
          className="science-reviews-section"
          aria-labelledby="science-reviews-title"
          onMouseEnter={() => setReviewsPaused(true)}
          onMouseLeave={() => setReviewsPaused(false)}
          onFocusCapture={() => setReviewsPaused(true)}
          onBlurCapture={() => setReviewsPaused(false)}
        >
          <h2 className="sr-only" id="science-reviews-title">
            Clinician and athlete reviews
          </h2>
          <div className="science-review-track" ref={reviewTrackRef}>
            {reviews.map((review, index) => (
              <article className="science-review-card" key={review.name}>
                <img src={review.image} alt={review.name} />
                <h3>{review.name}</h3>
                <span>{review.role}</span>
                <p>“{review.quote}”</p>
                <small>
                  {index + 1} / {reviews.length}
                </small>
              </article>
            ))}
          </div>
          <div className="science-review-controls">
            <button type="button" onClick={() => changeReview(-1)} aria-label="Previous review">
              ←
            </button>
            <div className="science-review-dots" aria-label="Choose a review">
              {reviews.map((review, index) => (
                <button
                  type="button"
                  className={activeReview === index ? "is-active" : ""}
                  onClick={() => setActiveReview(index)}
                  aria-label={`Go to review ${index + 1}: ${review.name}`}
                  aria-current={activeReview === index ? "true" : undefined}
                  key={review.name}
                />
              ))}
            </div>
            <button type="button" onClick={() => changeReview(1)} aria-label="Next review">
              →
            </button>
          </div>
          <p className="science-review-disclosure">
            *These individuals partner with Cata-Kor as compensated endorsers, sharing their
            personal opinions and experiences. They do not provide medical advice. Statements have
            not been evaluated by the FDA.
          </p>
        </section>

        <section className="science-video-section" aria-label="Cata-Kor NAD+ supplement video">
          {videoLoaded ? (
            <video
              controls
              autoPlay
              playsInline
              poster={scienceAsset("video-poster.jpg")}
              preload="metadata"
            >
              <source src={scienceAsset("nad-story.mp4")} type="video/mp4" />
              Your browser does not support HTML video.
            </video>
          ) : (
            <button
              className="science-video-poster"
              type="button"
              onClick={() => setVideoLoaded(true)}
              aria-label="Play NAD+ supplement video"
            >
              <img src={scienceAsset("video-poster.jpg")} alt="" />
              <span aria-hidden="true">▶</span>
            </button>
          )}
        </section>

        <section className="science-faq-section" id="science-faq">
          <div className="science-faq-heading">
            <span className="science-kicker">FAQs</span>
            <h2>Questions We Receive Often</h2>
            <a className="science-pill-button" href="#science-faq-list">
              VIEW ALL
            </a>
          </div>
          <div className="science-faq-list" id="science-faq-list">
            {faqs.map((faq, index) => (
              <details className="science-faq-item" key={faq.question}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}.</span>
                  <b>{faq.question}</b>
                  <i aria-hidden="true">⌄</i>
                </summary>
                <p>{faq.answer}</p>
              </details>
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
