import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next";
import "./globals.css";

import ClientWrapper from "@/components/ClientWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Hypsoul | Premium Sneakers",
    template: "%s | Hypsoul",
  },
  description:
    "Hypsoul — Premium sneakers for the modern streetwear culture. Exclusive drops, limited editions, and iconic silhouettes.",
  keywords: ["sneakers", "streetwear", "premium shoes", "hypsoul", "limited edition"],
  openGraph: {
    title: "Hypsoul | Premium Sneakers",
    description: "Premium sneakers for the modern streetwear culture.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-bg-primary text-white antialiased overflow-x-hidden"
      >
        {/* 🔥 FORCE CLIENT SIDE RENDER */}
        <ClientWrapper>
          <Navbar />
          <CartDrawer />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}