"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Footer, Header } from "../../ExactHome";

const aboutFaqs = [
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
    question: "How does Cata-Kor ensure the quality of its ingredients?",
    answer:
      "We source our ingredients meticulously, prioritizing quality, purity, and sustainability. Our commitment to excellence extends to rigorous testing and adherence to industry-leading standards.",
  },
  {
    question: "Are your products gluten-free?",
    answer: "Yes.",
  },
  {
    question: "Are your products non-GMO/organic?",
    answer: "Yes.",
  },
  {
    question: "Are your products safe to take with medications?",
    answer:
      "Please consult with a certified healthcare professional before trying any Cata-Kor supplement if you are currently taking medication or have a known medical condition.",
  },
  {
    question: "Do you have samples?",
    answer: "Not at this time.",
  },
];

export function AboutPage() {
  const faqListRef = useRef<HTMLDivElement>(null);
  const [allOpen, setAllOpen] = useState(false);

  const toggleAllFaqs = () => {
    const nextOpen = !allOpen;
    faqListRef.current?.querySelectorAll("details").forEach((item) => {
      item.open = nextOpen;
    });
    setAllOpen(nextOpen);
  };

  return (
    <div className="site-shell exact-home about-page">
      <Header activePage="about" />
      <main id="main-content">
        <section className="about-hero" aria-labelledby="about-hero-title">
          <div className="about-hero-copy">
            <div>
              <h1 id="about-hero-title">
                Take Charge of Your Aging History!
              </h1>
              <p>
                Experience high-quality ingredients that fuel your body and mind, support your
                health and fitness goals, and help you to surpass your limits.
              </p>
              <Link href="/collections/shop-all">SHOP NOW</Link>
            </div>
          </div>
          <div className="about-hero-image">
            <img
              src="https://catakor.com/cdn/shop/files/cata-kor-aboutus-hero-banner.jpg?v=1741077805&width=2400"
              alt="An active woman standing confidently on a beach"
            />
          </div>
        </section>

        <section className="about-story" aria-labelledby="about-story-title">
          <div className="about-story-inner">
            <span className="about-kicker">Liposomal</span>
            <h2 id="about-story-title">
              The Genesis of Cata-Kor: A Journey to Transform Lives
            </h2>
            <p>
              Meet Cata-Kor, a brand of dietary supplements on a mission to make a genuine impact.
            </p>
            <p>
              More than a brand, Cata-Kor is a community—a community committed to healthier,
              vibrant lives. From groundbreaking formulations in our lab, to positive impacts in
              households, our brand embodies the transformative power of scientific precision at
              a cellular level. With the customer’s health and well-being at the forefront of our
              approach, each of our products undergo rigorous third-party testing to ensure the
              highest standards of quality, safety, and effectiveness are met.
            </p>
            <p>
              Today, Cata-Kor is a catalyst for change, inspiring individuals to embrace a
              healthier life through the marriage of science and wellness.
            </p>
          </div>
        </section>

        <section className="about-faqs" aria-labelledby="about-faq-title">
          <div className="about-faq-heading">
            <span className="about-kicker">FAQs</span>
            <h2 id="about-faq-title">Frequently Asked Questions</h2>
            <span className="about-faq-arrow" aria-hidden="true">↳</span>
            <button type="button" onClick={toggleAllFaqs}>
              {allOpen ? "Close All" : "View All"}
            </button>
          </div>
          <div className="about-faq-list" ref={faqListRef}>
            {aboutFaqs.map((faq, index) => (
              <details key={faq.question}>
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
    </div>
  );
}
