export function formatPrice(price: number): string {
  return "₹" + price.toLocaleString("en-IN");
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateOrderId(): string {
  return "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5).toUpperCase();
}
