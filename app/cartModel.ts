export type ProductId = "nad" | "glutathione" | "nmn";
export type JarCount = 1 | 2 | 3;

type ProductPack = {
  each: number;
  total: number;
};

type CatalogProduct = {
  name: string;
  shortName: string;
  image: string;
  href: string;
  packs: Record<JarCount, ProductPack>;
};

export const PRODUCT_CATALOG: Record<ProductId, CatalogProduct> = {
  nad: {
    name: "LIPOSOMAL NAD+ 500MG",
    shortName: "Liposomal NAD+",
    image: "https://catakor.com/cdn/shop/files/Main_NAD.png?v=1783679981&width=500",
    href: "/products/nad-advanced-500mg",
    packs: {
      1: { each: 38.24, total: 38.24 },
      2: { each: 33.99, total: 67.98 },
      3: { each: 32.58, total: 97.74 },
    },
  },
  glutathione: {
    name: "LIPOSOMAL GLUTATHIONE 1155MG",
    shortName: "Liposomal Glutathione",
    image: "https://catakor.com/cdn/shop/files/Main_Glu.png?v=1783680082&width=500",
    href: "/products/liposomal-glutathione",
    packs: {
      1: { each: 33.99, total: 33.99 },
      2: { each: 32.29, total: 64.58 },
      3: { each: 32.86, total: 98.59 },
    },
  },
  nmn: {
    name: "NMN 4-IN-1 NAD+ SUPPORT",
    shortName: "NMN 4-in-1",
    image:
      "https://catakor.com/cdn/shop/files/Main_NMN_42c0bc37-5c6c-48ca-a3cc-4ca3790dca55.png?v=1783680309&width=500",
    href: "/products/nmn",
    packs: {
      1: { each: 39.99, total: 39.99 },
      2: { each: 35.99, total: 71.98 },
      3: { each: 33.99, total: 101.97 },
    },
  },
};

export type CartLine = {
  id: string;
  productId: ProductId;
  jars: JarCount;
  quantity: number;
  price: number;
  originalPrice: number;
  isFlashSale: boolean;
  discountPercent?: number;
  sourceProductId?: ProductId;
  updatedAt: number;
};

export type FlashOffer = {
  id: string;
  sourceProductId: ProductId;
  productId: ProductId;
  jars: JarCount;
  originalPrice: number;
  salePrice: number;
  discountPercent: 20 | 25;
};

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function buildFlashOffers(
  items: CartLine[],
  random: () => number = Math.random,
): FlashOffer[] {
  const latestByProduct = new Map<ProductId, CartLine>();

  items
    .filter((item) => !item.isFlashSale)
    .forEach((item) => {
      const current = latestByProduct.get(item.productId);
      if (!current || item.updatedAt >= current.updatedAt) {
        latestByProduct.set(item.productId, item);
      }
    });

  return Array.from(latestByProduct.values()).map((source) => {
    let productId = source.productId;
    let jars: JarCount;
    let discountPercent: 20 | 25;

    if (source.jars === 1) {
      jars = 2;
      discountPercent = 20;
    } else if (source.jars === 2) {
      jars = 3;
      discountPercent = 20;
    } else {
      const alternatives = (Object.keys(PRODUCT_CATALOG) as ProductId[]).filter(
        (candidate) => candidate !== source.productId,
      );
      const randomIndex = Math.min(
        alternatives.length - 1,
        Math.max(0, Math.floor(random() * alternatives.length)),
      );
      productId = alternatives[randomIndex];
      jars = 1;
      discountPercent = 25;
    }

    const originalPrice = PRODUCT_CATALOG[productId].packs[jars].total;
    const salePrice = roundCurrency(originalPrice * (1 - discountPercent / 100));

    return {
      id: `flash-${source.productId}-${productId}-${jars}-${discountPercent}`,
      sourceProductId: source.productId,
      productId,
      jars,
      originalPrice,
      salePrice,
      discountPercent,
    };
  });
}
