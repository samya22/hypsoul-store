import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getNewArrivals } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import HeroClient from "@/components/HeroClient";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals().slice(0, 4);

  return (
    <>
      {/* Hero */}
      <HeroClient />

      {/* Brand Stats Strip */}
      <div className="bg-bg-secondary border-y border-border">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border">
          {[
            { value: "500+", label: "Exclusive Styles" },
            { value: "50K+", label: "Happy Customers" },
            { value: "100%", label: "Authentic Pairs" },
            { value: "Free", label: "Returns & Exchanges" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center md:px-8">
              <div className="font-heading font-black text-3xl md:text-4xl text-white">{value}</div>
              <div className="text-text-secondary text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Kicks */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-bg-primary">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-[4px]">Collection</span>
              <h2 className="font-heading font-black text-4xl md:text-5xl mt-2 line-accent">
                Featured Kicks
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-text-secondary hover:text-white text-sm font-medium uppercase tracking-widest transition-colors group"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link href="/shop" className="btn-secondary-full">View All Sneakers</Link>
          </div>
        </div>
      </section>

      {/* Full-width Banner */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/images/HS.jpg"
          alt="Hypsoul Story"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full">
            <div className="max-w-xl">
              <span className="text-accent text-xs font-bold uppercase tracking-[4px]">Our Story</span>
              <h2 className="font-heading font-black text-4xl md:text-6xl mt-3 mb-5 leading-tight">
                Born In<br />The Shadows
              </h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                Sneakers aren't just footwear. They're identity, culture, and art. Hypsoul was built for those who understand that.
              </p>
              <Link href="/shop" className="btn-primary-full">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Drops */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-bg-secondary">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-[4px]">Latest</span>
              <h2 className="font-heading font-black text-4xl md:text-5xl mt-2 line-accent">
                Fresh Drops
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Hypsoul */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-bg-primary">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-accent text-xs font-bold uppercase tracking-[4px]">Why Us</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl mt-2">The Hypsoul Edge</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldIcon />,
                title: "100% Authentic",
                desc: "Every pair is verified and sourced directly from authorized retailers. No replicas, no compromises.",
              },
              {
                icon: <TruckIcon />,
                title: "Free Express Shipping",
                desc: "Orders above ₹2,999 ship free with express delivery across India. Track your order in real-time.",
              },
              {
                icon: <RefreshIcon />,
                title: "Easy Returns",
                desc: "14-day hassle-free returns. If they don't fit the vibe, we'll sort it. No questions asked.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-8 bg-bg-card border border-border rounded-2xl group hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  {icon}
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-5 md:px-10 bg-accent relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 80px)",
            }}
          />
        </div>
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <h2 className="font-heading font-black text-4xl md:text-6xl text-white mb-4">
            Find Your Next Pair
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-md mx-auto">
            Explore our full collection of premium sneakers. New drops added weekly.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-lg hover:bg-white/90 transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </>
  );
}

// Icons
function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0H3m14 0h2" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
