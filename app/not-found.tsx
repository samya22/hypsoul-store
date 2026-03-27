import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-5">
      <div className="text-center max-w-lg">
        {/* Giant 404 */}
        <div className="font-heading font-black text-[160px] md:text-[200px] leading-none text-white/[0.04] select-none mb-0">
          404
        </div>
        <div className="-mt-10 relative z-10">
          <h1 className="font-heading font-black text-4xl md:text-5xl mb-4">
            Page Not Found
          </h1>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Looks like this page dropped and sold out before you got here. Try heading back to the collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary-full">
              Back to Home
            </Link>
            <Link href="/shop" className="btn-secondary-full">
              Shop Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
