"use client";
import Link from "next/link";

const footerLinks = {
  Shop: [
    { label: "All Sneakers", href: "/shop" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Limited Editions", href: "/shop?category=Limited+Edition" },
    { label: "Sale", href: "/shop" },
  ],
  Support: [
    { label: "FAQ", href: "/" },
    { label: "Shipping & Returns", href: "/" },
    { label: "Size Guide", href: "/" },
    { label: "Track Order", href: "/" },
  ],
  Company: [
    { label: "About Us", href: "/" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/" },
    { label: "Press", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">

      {/* Newsletter Strip */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="max-w-sm">
            <h3 className="font-heading font-bold text-xl md:text-2xl mb-2 line-accent">
              Never Miss A Drop
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mt-4">
              Get early access to exclusive releases, limited collaborations, and insider news before the public.
            </p>
          </div>
          {/* Email + button stack on mobile */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.querySelector("input") as HTMLInputElement;
              input.value = "";
              alert("Subscribed! Welcome to the culture.");
            }}
            className="flex flex-col sm:flex-row gap-2 w-full md:max-w-md"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-bg-card border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-3 rounded-lg uppercase tracking-wider transition-colors touch-manipulation"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 md:py-16 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
        {/* Brand — full width on mobile */}
        <div className="col-span-2 md:col-span-2">
          <Link
            href="/"
            className="font-heading font-black text-2xl text-white hover:text-accent transition-colors"
          >
            HYPSOUL<span className="text-accent">.</span>
          </Link>
          <p className="text-text-secondary text-sm leading-relaxed mt-4 max-w-xs">
            Born in the shadows. Built for the streets. Premium sneaker culture for those who move with intent.
          </p>
          {/* Social */}
          <div className="flex gap-3 mt-6">
            {[
              {
                label: "Instagram",
                icon: <InstagramIcon />,
                href: "https://www.instagram.com/samya.22_/",
              },
              {
                label: "Twitter",
                icon: <TwitterIcon />,
                href: "https://x.com/samyakkharat22",
              },
              { label: "YouTube", icon: <YouTubeIcon />, href: "#" },
            ].map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="w-10 h-10 md:w-9 md:h-9 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-accent/50 hover:bg-accent/10 transition-all touch-manipulation"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links — 3 columns on mobile (one per section), same on desktop */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-heading font-semibold text-xs md:text-sm uppercase tracking-widest mb-4 md:mb-5 text-white">
              {title}
            </h4>
            <ul className="space-y-2.5 md:space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-text-secondary text-xs md:text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} Hypsoul. All rights reserved.
          </p>
          {/* Legal links — wrap on mobile */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-text-muted text-xs hover:text-text-secondary transition-colors whitespace-nowrap">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Social icons
function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.5 6.2a3 3 0 00-2.1-2.12C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.4.58A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.12c1.85.58 9.4.58 9.4.58s7.55 0 9.4-.58a3 3 0 002.1-2.12A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.8zM9.6 15.8V8.2L16 12l-6.4 3.8z" />
    </svg>
  );
}