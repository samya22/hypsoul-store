import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  let result = [...products];

  if (category && category !== "all") {
    result = result.filter((p) => p.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ products: result });
}
