import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import ProductActions from "./ProductActions";
import ProductCard from "@/components/ProductCard";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ id: string }>;
}

function getProductModel() {
  if (mongoose.models.Product) return mongoose.models.Product;

  const schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    category: String,
    price: Number,
    image: String,
    images: { type: [String], default: [] },
    description: String,
    isNew: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    sizes: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  });

  return mongoose.model("Product", schema);
}

// 🔥 SERIALIZER FUNCTION (MAIN FIX)
function serialize(product: any) {
  return {
    ...product,
    _id: product._id?.toString(),
    createdAt: product.createdAt?.toISOString?.(),
  };
}

async function getProduct(id: string) {
  try {
    await connectDB();
    const Product = getProductModel();

    const dbProduct = await Product.findOne({ id }).lean();

    if (dbProduct) return serialize(dbProduct);
  } catch {}

  return getProductById(id) ?? null;
}

async function getRelated(category: string, currentId: string) {
  try {
    await connectDB();
    const Product = getProductModel();

    const dbRelated = await Product.find({
      category,
      id: { $ne: currentId },
    })
      .limit(4)
      .lean();

    if (dbRelated.length > 0) {
      return dbRelated.map(serialize);
    }
  } catch {}

  return products
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, 4);
}

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return { title: "Not Found" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const related = await getRelated(product.category, product.id);

  return (
    <div className="min-h-screen bg-bg-primary pt-20">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-text-muted text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{product.name}</span>
        </nav>
      </div>

      {/* Main Product */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image */}
          <div className="relative">
            <div className="sticky top-24 aspect-square rounded-2xl overflow-hidden bg-bg-card border border-border">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              <div className="absolute top-4 left-4 flex gap-2">
                {product.isNew && (
                  <span className="bg-accent text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    New Drop
                  </span>
                )}

                {(product.category === "Limited Edition" ||
                  product.category === "Collector") && (
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Limited
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-bg-card border border-border"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-accent text-xs font-bold uppercase tracking-[4px] mb-3">
              {product.category}
            </span>

            <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading font-black text-4xl">
                {formatPrice(product.price)}
              </span>
              <span className="text-text-secondary text-sm">incl. GST</span>
            </div>

            {product.stock !== undefined && product.stock <= 5 && (
              <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-orange-400 text-sm font-medium">
                  Only {product.stock} pairs left in stock
                </span>
              </div>
            )}

            <p className="text-text-secondary text-base leading-relaxed mb-8">
              {product.description}
            </p>

            <ProductActions product={product} />

            <div className="mt-8 space-y-3 border-t border-border pt-8">
              {[
                { icon: "🚚", text: "Free shipping on orders above ₹2,999" },
                { icon: "↩️", text: "14-day returns & exchanges" },
                { icon: "✅", text: "100% authentic pairs" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-text-secondary text-sm">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 md:mt-32">
            <div className="mb-10">
              <span className="text-accent text-xs font-bold uppercase tracking-[4px]">
                More Like This
              </span>
              <h2 className="font-heading font-black text-3xl md:text-4xl mt-2">
                You Might Also Like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}