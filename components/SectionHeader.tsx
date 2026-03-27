import Link from "next/link";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  center?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel = "View All",
  center = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex items-end justify-between mb-12 md:mb-16 ${
        center ? "flex-col items-center text-center" : ""
      }`}
    >
      <div className={center ? "" : ""}>
        {eyebrow && (
          <span className="text-accent text-xs font-bold uppercase tracking-[4px] block mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className={`font-heading font-black text-4xl md:text-5xl line-accent`}>
          {title}
        </h2>
      </div>

      {viewAllHref && !center && (
        <Link
          href={viewAllHref}
          className="hidden md:flex items-center gap-2 text-text-secondary hover:text-white text-sm font-medium uppercase tracking-widest transition-colors group pb-1"
        >
          {viewAllLabel}
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      )}
    </div>
  );
}
