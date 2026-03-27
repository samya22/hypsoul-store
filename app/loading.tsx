export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="font-heading font-black text-3xl tracking-tight text-white/20 select-none">
            HYPSOUL<span className="text-accent/20">.</span>
          </div>
          <div
            className="absolute inset-0 font-heading font-black text-3xl tracking-tight text-transparent bg-gradient-to-r from-transparent via-white/60 to-transparent bg-clip-text animate-shimmer"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          >
            HYPSOUL.
          </div>
        </div>
        {/* Spinner */}
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    </div>
  );
}
