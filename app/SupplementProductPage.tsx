"use client";

import { useEffect, useMemo, useState } from "react";
import { Footer, Header } from "./ExactHome";
import { ProductId, useCart } from "./CartContext";

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
  productId: ProductId;
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
  productId: "glutathione",
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
    { jars: 3, each: 32.99, total: 98.97, label: "BEST VALUE" },
    { jars: 2, each: 34.99, total: 69.98, label: "MOST POPULAR" },
    { jars: 1, each: 39.99, total: 39.99 },
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
  productId: "nmn",
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
      title: "How long does it take to see results from dietary supplements?",
      copy:
        "The time to experience results varies based on the supplement and individual factors. Consistency in usage is key. Some may notice changes quickly, while others may require more time.",
    },
    {
      title: "Are there potential side effects of dietary supplements?",
      copy:
        "Individual responses vary. Stop use and consult a qualified healthcare professional if you experience an unwanted reaction.",
    },
    {
      title: "How does Cata-Kor ensure the quality of its ingredients?",
      copy:
        "Cata-Kor uses transparent formulas and independent testing to verify ingredient identity, purity and product quality.",
    },
    {
      title: "Are your products gluten-free?",
      copy:
        "Review the current ingredient label for product-specific allergen information, and contact our support team if you have a specific sensitivity.",
    },
    {
      title: "Are your products non-GMO/organic?",
      copy:
        "Ingredient sourcing varies by formula. The current product label and quality documentation provide the most up-to-date sourcing details.",
    },
    {
      title: "Are your products safe to take with medications?",
      copy:
        "If you take prescription medication or manage a medical condition, speak with your healthcare professional before starting any dietary supplement.",
    },
    {
      title: "Do you have samples?",
      copy:
        "Samples are not currently listed in this testing storefront. Contact Cata-Kor support for the latest availability.",
    },
  ],
};

type NmnReview = {
  name: string;
  date: string;
  title: string;
  body: string;
};

const nmnExperts = [
  {
    name: "Myro Figura",
    title: "UCLA-Trained MD",
    image: "https://catakor.com/cdn/shop/files/partner-image-1.png?v=1774888818&width=900",
    quote:
      "I’m usually picky about supplements, but with Cata-Kor’s liposomal absorption technology, I know I’m getting unmatched effectiveness.",
  },
  {
    name: "Kayla Barnes-Lentz",
    title: "A Leading Expert in Female Longevity",
    image: "https://catakor.com/cdn/shop/files/partner-image-2.jpg?v=1774888818&width=900",
    quote:
      "NAD+ is non-negotiable in my longevity protocol, and Cata-Kor is a brand I trust. What sets them apart is their rigorous testing standards and commitment to quality.",
  },
  {
    name: "Zach Colls",
    title: "NBA/NFL Physical Rehab Coach",
    image: "https://catakor.com/cdn/shop/files/partner-image-3.png?v=1774888818&width=900",
    quote:
      "Cata-Kor’s products are exactly what I need: bioavailable, clean, trusted ingredients, and easy to take.",
  },
  {
    name: "Jenoah McKiver",
    title: "Olympic Gold Champion",
    image: "https://catakor.com/cdn/shop/files/partner-image-4.jpg?v=1774888817&width=900",
    quote:
      "My intense training career has taken a toll. I rely on Cata-Kor to support recovery, longevity, and cognitive health.",
  },
  {
    name: "Michael Davis",
    title: "Performance Specialist",
    image: "https://catakor.com/cdn/shop/files/partner-image-5.jpg?v=1774888818&width=900",
    quote:
      "I was honestly blown away by how fast I felt the difference in my performance and recovery.",
  },
];

const nmnReviewImages = [
  "https://review-images.judgeme.com/cata-kor/1781396011__0___tyEdVLo__debb9f8f7c54e3db4f45658b751371c~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781396012__0__tCXKEyfU__b11f16284534f3dbdd0d3c51e6acdbe~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781396013__0__UBGtu4HW__b87aa7b0c9341439cd654e480772744~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781396015__0__ZiYJYDnH__57553392dcb4c3dba0d7f16321e576d~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781396015__0__qDJpCmwm__f3d631f549e4dc6bb538775052921eb~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781395998__0__p9pvWSwq__99c70eaea5a43b0aeb36e355faf8cff~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781395998__0__XYxwIDV2__4d248f792d64a46a4152a2820cd04dc~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781395998__0__XUfI4Sz6__05ae2f11d7142e395f218bbbbcb52d6~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781395998__0__v-os1O4M__ba680b897f04713a5b2afd60711ee91~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
  "https://review-images.judgeme.com/cata-kor/1781396011__0__Is5tb-bp__ee58a81b5de400a9d294110d6a573ad~tplv-fhlh96nyum-origin-jpeg__original.jpeg?quality=90&width=500",
];

const nmnReviewSeeds: NmnReview[] = [
  {
    name: "Gretchen Yeates",
    date: "07/02/2026",
    title: "Great results with NMN",
    body:
      "I have had great results with the NMN. I was on it before, but ran out and I felt the difference. I was so excited to get back on it and add others too. I feel the difference already.",
  },
  {
    name: "Laura Thompson",
    date: "06/14/2026",
    title: "Best skin, hair, and energy",
    body: "Love NMN—my skin and hair have never been better. My energy has picked up too.",
  },
  {
    name: "Lillian Lee",
    date: "06/14/2026",
    title: "Easy capsules, anti-aging at 55+",
    body:
      "Capsules are easy to consume and digest. I bought the three pack and am eager to see the effects.",
  },
  {
    name: "Aaliyah Ward",
    date: "06/14/2026",
    title: "Changes in just five days",
    body:
      "I have been taking this for five days and I’m already noticing a difference in my energy and mood.",
  },
  {
    name: "Daniel",
    date: "06/14/2026",
    title: "Better energy, focus, less brain fog",
    body:
      "I’m about two weeks in and already feeling the benefits. My energy is improving and I feel more focused.",
  },
  {
    name: "Grace Hill",
    date: "06/14/2026",
    title: "Helped my brain fog and fatigue",
    body:
      "Great product and easy to take. If you’re feeling brain fog and exhaustion, this has been helpful for me.",
  },
  {
    name: "Ruth Rodriguez",
    date: "06/14/2026",
    title: "Skin improving by day three",
    body: "My skin already feels better and it’s only day three. I can’t wait to see what a month brings.",
  },
  {
    name: "Barbara Ortiz",
    date: "06/14/2026",
    title: "A difference in just a week",
    body: "So far I love this product. I am one week in and I can see a difference and feel better.",
  },
  {
    name: "Jennifer Ramirez",
    date: "06/14/2026",
    title: "The real deal with consistency",
    body: "This is my second bottle of NMN and I notice the difference when I take it consistently.",
  },
  {
    name: "Leah Richardson",
    date: "06/14/2026",
    title: "My favorite supplement",
    body: "My favorite supplement. It has become an easy part of my daily routine.",
  },
  {
    name: "Tara Patel",
    date: "06/14/2026",
    title: "Will always take this",
    body: "I love this product and plan to keep it in my routine.",
  },
  {
    name: "Zoey Myers",
    date: "06/14/2026",
    title: "Day one of my journey",
    body: "So excited to start my Cata-Kor NMN supplement journey and track my progress.",
  },
  {
    name: "Megan Perez",
    date: "06/14/2026",
    title: "Nice quality bottle",
    body: "The order arrived in good condition and the bottle feels high quality.",
  },
  {
    name: "Brooklyn Young",
    date: "06/14/2026",
    title: "Improved facial texture",
    body:
      "I am starting to notice a difference in the overall texture of my skin after taking it consistently.",
  },
  {
    name: "Sofia Collins",
    date: "06/14/2026",
    title: "On my fourth bottle",
    body: "I’m on my fourth bottle and still love how easy it is to keep up with.",
  },
  {
    name: "Barbara Collins",
    date: "06/14/2026",
    title: "Sealed with clear instructions",
    body: "Great product. It came sealed and included simple, clear instructions.",
  },
  {
    name: "Nicole Williams",
    date: "06/14/2026",
    title: "Three days in",
    body: "I’m three days in and looking forward to reporting back on my progress.",
  },
  {
    name: "Linda Jackson",
    date: "06/14/2026",
    title: "Others noticed my healthier skin",
    body:
      "I’m on my second month of taking NMN daily. Friends and family have commented that my skin looks healthier.",
  },
  {
    name: "Jasmine Robinson",
    date: "06/14/2026",
    title: "Less brain fog, more energy",
    body:
      "Fast delivery and an easy routine. I feel more energetic during the day and have noticed less brain fog.",
  },
  {
    name: "Stephanie Kim",
    date: "06/14/2026",
    title: "Sharper memory",
    body: "I have been taking it consistently for three months and feel sharper in my daily routine.",
  },
];

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

function NmnLongFormSections({ faqs }: { faqs: AccordionItem[] }) {
  const [expertStart, setExpertStart] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilterOpen, setReviewFilterOpen] = useState(false);
  const [picturesOnly, setPicturesOnly] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const visibleExperts = Array.from(
    { length: 4 },
    (_, index) => nmnExperts[(expertStart + index) % nmnExperts.length],
  );

  const visibleReviews = Array.from({ length: 5 }, (_, index) => {
    const offset = (reviewPage - 1) * 5 + Math.floor((reviewPage - 1) / 4);
    const review = nmnReviewSeeds[(offset + index) % nmnReviewSeeds.length];
    const image = index % 2 === 1 || picturesOnly
      ? nmnReviewImages[(offset + index) % nmnReviewImages.length]
      : "";
    return { ...review, image };
  });

  const paginationItems: Array<number | "ellipsis"> =
    reviewPage <= 4
      ? [1, 2, 3, 4, "ellipsis", 20]
      : reviewPage >= 17
        ? [1, "ellipsis", 17, 18, 19, 20]
        : [1, "ellipsis", reviewPage - 1, reviewPage, reviewPage + 1, "ellipsis", 20];

  const goToReviewPage = (page: number) => {
    setReviewPage(page);
    window.requestAnimationFrame(() => {
      document.getElementById("nmn-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <section className="nmn-cellular-section">
        <div className="nmn-cellular-copy">
          <span>NMN</span>
          <h2>Support Cellular<br />Health</h2>
          <p>
            NMN is a vital coenzyme found in every cell of the body. It plays a key role in supporting
            mitochondrial function and cellular energy production. Maintaining NMN levels may help promote
            cellular resilience, support healthy aging, and contribute to cognitive and metabolic function
            over time.*
          </p>
          <ul>
            {[
              "Supports cellular energy production*",
              "Helps maintain healthy cellular function*",
              "Brain support*",
              "Promotes mitochondrial function*",
            ].map((benefit) => (
              <li key={benefit}>
                <span aria-hidden="true">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <img
          className="nmn-cellular-art"
          src="https://catakor.com/cdn/shop/files/Image_gp-inline-block_01a37bd0-b432-4a3e-8fb5-ef27f162b876.webp?v=1775054572"
          alt="Cata-Kor NMN supplement alongside a cellular-health visual"
          loading="lazy"
        />
      </section>

      <section className="nmn-benefits-section">
        <picture>
          <source
            media="(max-width: 700px)"
            srcSet="https://catakor.com/cdn/shop/files/benefits-img-mob.webp?v=1775054571"
          />
          <img
            src="https://catakor.com/cdn/shop/files/benefits-img.webp?v=1775054572"
            alt="Cata-Kor NMN capsules and supplement jar"
            loading="lazy"
          />
        </picture>
        <div className="nmn-benefits-copy">
          <span>NMN</span>
          <h2>Key Benefits</h2>
          {[
            [
              "https://catakor.com/cdn/shop/files/benefits-icon-1.svg?v=1774889226",
              "Cellular Energy",
              "NMN is a naturally occurring coenzyme that plays a supportive role in normal cellular metabolism. It helps the body convert nutrients into cellular energy and helps maintain healthy energy processes in cells.*",
            ],
            [
              "https://catakor.com/cdn/shop/files/benefits-icon-2.svg?v=1774889464",
              "Cellular Health",
              "NMN helps support normal enzymatic activity involved in DNA processes and cellular maintenance, contributing to the maintenance of overall healthy cellular function.*",
            ],
            [
              "https://catakor.com/cdn/shop/files/benefits-icon-3.svg?v=1774889626",
              "Mitochondrial Support",
              "NMN is involved in supporting healthy mitochondrial activity, which plays an important role in normal cellular energy production and overall metabolic wellbeing.*",
            ],
            [
              "https://catakor.com/cdn/shop/files/benefits-icon-4.svg?v=1774889668",
              "Brain Support",
              "NMN can help support healthy brain cell metabolism and mitochondrial activity, which may help maintain normal cognitive function and overall cellular resilience.*",
            ],
          ].map(([icon, title, copy]) => (
            <article key={title}>
              <img src={icon} alt="" />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="nmn-experts-section">
        <div className="nmn-section-heading">
          <div>
            <span>RECOMMENDED BY</span>
            <h2>Top Health Experts &amp; Medical Partners</h2>
          </div>
          <div className="nmn-expert-controls">
            <button
              type="button"
              onClick={() =>
                setExpertStart((start) => (start - 1 + nmnExperts.length) % nmnExperts.length)
              }
              aria-label="Previous expert"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setExpertStart((start) => (start + 1) % nmnExperts.length)}
              aria-label="Next expert"
            >
              →
            </button>
          </div>
        </div>
        <div className="nmn-expert-grid" aria-live="polite">
          {visibleExperts.map((expert) => (
            <article key={expert.name}>
              <img src={expert.image} alt={expert.name} loading="lazy" />
              <h3>{expert.name}</h3>
              <span>{expert.title}</span>
              <p><b aria-hidden="true">”</b>{expert.quote}</p>
            </article>
          ))}
        </div>
        <p className="nmn-expert-disclaimer">
          These individuals partner with Cata-Kor as paid ambassadors, sharing their real routines and
          results.
        </p>
      </section>

      <section className="nmn-compare-section">
        <div className="nmn-compare-heading">
          <h2>How We Compare</h2>
          <p>MOST NAD+ SUPPLEMENTS ARE GUESSING. WE’RE NOT.</p>
        </div>
        <div className="nmn-compare-table" role="table" aria-label="Cata-Kor compared with typical NAD supplements">
          <div className="nmn-compare-labels" role="rowgroup">
            <b>Efficacy</b>
            <b>Dosage</b>
            <b>Certification</b>
            <b>Convenience</b>
            <b>Price</b>
          </div>
          <div className="nmn-compare-brand" role="rowgroup">
            <img src="/catakor/logo.svg" alt="Cata-Kor" />
            {[
              "Targets All 4 Hallmarks Of Aging",
              "Therapeutic Doses",
              "NSF Certified",
              "2 Capsules Per Day",
              "$1.13/Day",
            ].map((item) => (
              <span key={item}><b aria-hidden="true">✓</b>{item}</span>
            ))}
          </div>
          <div className="nmn-compare-typical" role="rowgroup">
            <strong>Typical NAD+<br />Supplements</strong>
            {[
              "Focuses On 1 Hallmark Only",
              "Often Underdosed",
              "Rarely Certified",
              "Multiple Pills Daily",
              "~$3/Day",
            ].map((item, index) => (
              <span key={item}><b aria-hidden="true">{index < 2 ? "!" : "×"}</b>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="nmn-reviews-section" id="nmn-reviews">
        <div className="nmn-reviews-inner">
          <div className="nmn-reviews-heading">
            <div>
              <h2>Customer Reviews</h2>
              <p><b>5.0</b> <span>392 reviews</span></p>
            </div>
            <div className="nmn-review-actions">
              <button type="button" onClick={() => setReviewFormOpen(true)}>Write a review</button>
              <button
                type="button"
                className={reviewFilterOpen ? "is-active" : ""}
                onClick={() => setReviewFilterOpen((open) => !open)}
                aria-expanded={reviewFilterOpen}
              >
                Filter
              </button>
              <select aria-label="Sort customer reviews">
                <option>Most recent</option>
                <option>Highest rating</option>
                <option>Pictures first</option>
              </select>
            </div>
          </div>
          {reviewFilterOpen && (
            <label className="nmn-review-filter">
              <input
                type="checkbox"
                checked={picturesOnly}
                onChange={(event) => setPicturesOnly(event.target.checked)}
              />
              Show reviews with pictures
            </label>
          )}

          <div className="nmn-review-photo-strip" aria-label="Customer review photos">
            {nmnReviewImages.map((image, index) => (
              <button type="button" key={image} onClick={() => setPicturesOnly(true)}>
                <img src={image} alt={`Customer review photo ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>

          <div className="nmn-review-list" aria-live="polite">
            {visibleReviews.map((review, index) => (
              <article key={`${reviewPage}-${review.name}-${index}`}>
                <div className="nmn-review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <div className="nmn-reviewer">
                  <span>{review.name.charAt(0)}</span>
                  <div>
                    <b>{review.name}</b>
                    {index === 0 && <em>Verified</em>}
                    <small>{review.date}</small>
                  </div>
                </div>
                <h3>{review.title}</h3>
                <p>{review.body}</p>
                {review.image && (
                  <img
                    className="nmn-review-image"
                    src={review.image}
                    alt={review.title}
                    loading="lazy"
                  />
                )}
                <div className="nmn-reviewed-product">
                  <img
                    src="https://catakor.com/cdn/shop/files/Main_NMN_42c0bc37-5c6c-48ca-a3cc-4ca3790dca55.png?v=1783680309&width=180"
                    alt=""
                  />
                  <span>Review for<br /><u>NMN 4-in-1</u></span>
                </div>
              </article>
            ))}
          </div>

          <nav className="nmn-review-pagination" aria-label="Customer review pages">
            <button
              type="button"
              disabled={reviewPage === 1}
              onClick={() => goToReviewPage(reviewPage - 1)}
              aria-label="Previous review page"
            >
              ←
            </button>
            {paginationItems.map((item, index) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${index}`}>…</span>
              ) : (
                <button
                  type="button"
                  className={reviewPage === item ? "is-active" : ""}
                  onClick={() => goToReviewPage(item)}
                  aria-label={`Go to review page ${item}`}
                  aria-current={reviewPage === item ? "page" : undefined}
                  key={item}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={reviewPage === 20}
              onClick={() => goToReviewPage(reviewPage + 1)}
              aria-label="Next review page"
            >
              →
            </button>
          </nav>
          <p className="nmn-review-page-count">Page {reviewPage} of 20</p>
        </div>
      </section>

      <section className="nmn-faq-section">
        <h2>Questions? We<br />have answers!</h2>
        <AccordionList items={faqs} className="nmn-faq-list" />
      </section>

      {reviewFormOpen && (
        <div className="nmn-review-dialog-layer" role="presentation" onMouseDown={() => setReviewFormOpen(false)}>
          <section
            className="nmn-review-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nmn-review-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={() => setReviewFormOpen(false)} aria-label="Close review form">×</button>
            {reviewSubmitted ? (
              <>
                <h2 id="nmn-review-dialog-title">Thank you for your review</h2>
                <p>Your feedback has been received for moderation.</p>
              </>
            ) : (
              <>
                <h2 id="nmn-review-dialog-title">Write a review</h2>
                <p className="nmn-dialog-stars">★★★★★</p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setReviewSubmitted(true);
                  }}
                >
                  <label>
                    Name
                    <input type="text" required />
                  </label>
                  <label>
                    Review title
                    <input type="text" required />
                  </label>
                  <label>
                    Your review
                    <textarea rows={5} required />
                  </label>
                  <button type="submit">Submit review</button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function SupplementProductPage({ product }: { product: SupplementProduct }) {
  const [activeImage, setActiveImage] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [selectedJars, setSelectedJars] = useState<PackOption["jars"]>(3);
  const { addRegularItem, openCart } = useCart();

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

  const visibleThumbnails = product.gallery.slice(thumbnailStart, thumbnailStart + 6);
  const chooseImage = (index: number) => {
    setActiveImage(index);
    if (index < thumbnailStart) setThumbnailStart(index);
    if (index >= thumbnailStart + 6) setThumbnailStart(Math.min(index - 5, product.gallery.length - 6));
  };

  return (
    <div className={`site-shell exact-home secondary-product-page accent-${product.accent}`}>
      <Header />
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
            <button
              className="secondary-add-button"
              type="button"
              onClick={() => {
                addRegularItem(product.productId, selected.jars);
                openCart();
              }}
            >
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

        {product.accent === "brown" ? (
          <NmnLongFormSections faqs={product.faqs} />
        ) : (
          <>
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
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export function GlutathioneProductPage() {
  return <SupplementProductPage product={glutathione} />;
}

export function NmnProductPage() {
  return <SupplementProductPage product={nmn} />;
}
