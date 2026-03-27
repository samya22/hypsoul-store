import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "snk-001",
    name: "Nike Air Force 1",
    category: "Lifestyle",
    price: 3999,
    image: "/images/AF1.avif",
    description:
      "The iconic Air Force 1 — a sneaker that transcends generations. Classic silhouette built on Air cushioning, wrapped in premium leather. A cornerstone of street culture and effortless style since 1982.",
    isNew: true,
    featured: true,
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 15,
  },
  {
    id: "snk-002",
    name: "Nike SB Dunk Jarritos",
    category: "Skate",
    price: 5499,
    image: "/images/NikeSBDunkLowJarritos.webp",
    description:
      "The Nike SB Dunk Low Jarritos is a vibrant collaboration celebrating Mexico's beloved beverage brand. Featuring a multi-color upper with premium suede and leather, this limited edition drop blends heritage skating culture with bold pop-art energy.",
    isNew: true,
    featured: true,
    sizes: ["7", "8", "9", "10", "11"],
    stock: 8,
  },
  {
    id: "snk-003",
    name: "Nike Air Force 1 Low SP AMBUSH Phantom WHITE",
    category: "Limited Edition",
    price: 6999,
    image: "/images/NikeAmbush.avif",
    description:
      "The Nike x Ambush Dunk High pushes the boundaries of sneaker design. Created with Japanese designer Yoon Ahn, this oversized, sculptural interpretation of the classic Dunk silhouette delivers maximum statement in monochromatic premium suede.",
    isNew: true,
    featured: true,
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 5,
  },
  {
    id: "snk-004",
    name: "Air Jordan 1 Low Fragment Design x Travis Scott",
    category: "Collector",
    price: 6499,
    image: "/images/fragment.avif",
    description:
      "A holy grail of sneaker culture. The Air Jordan 1 High Fragment Design × Nike, crafted in collaboration with Hiroshi Fujiwara's Fragment Design label. Clean white and black with signature lightning bolt detailing — one of the most sought-after Jordans ever produced.",
    isNew: false,
    featured: true,
    sizes: ["8", "9", "10", "11"],
    stock: 3,
  },
  {
    id: "snk-005",
    name: "AF 1 Chrome Hearts",
    category: "Lifestyle",
    price: 4599,
    image: "/images/chrome.png",
    description:
      "A bold fusion of luxury streetwear and performance design. The AF 1 Chrome Hearts delivers a striking aesthetic with signature cross detailing and premium materials, crafted for those who move with confidence. Built for everyday wear with elevated comfort, this silhouette blends iconic style with modern edge—making it a standout piece in any rotation.",
    isNew: true,
    featured: false,
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 20,
  },
  {
    id: "snk-006",
    name: "Street Bunny Low",
    category: "Lifestyle",
    price: 5299,
    image: "/images/bunny.webp",
    description:
      "Everyday wear redefined. The Street Bunny Low combines a relaxed low-profile silhouette with plush cushioning and a durable vulcanized sole. Versatile enough for the streets, premium enough for the culture.",
    isNew: true,
    featured: false,
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 12,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export const categories = [
  "all",
  "Lifestyle",
  "Skate",
  "Running",
  "Limited Edition",
  "Collector",
];
