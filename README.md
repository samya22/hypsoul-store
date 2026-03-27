# HYPSOUL — Premium Sneaker Store

A production-ready Next.js e-commerce application for Hypsoul, a dark-luxury premium sneaker brand.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| State Management | Zustand (persistent cart) |
| Payments | Razorpay |
| Email | Nodemailer (Gmail SMTP) |
| Language | TypeScript |
| Images | Next.js Image (optimized) |

---

## Project Structure

```
hypsoul/
├── app/
│   ├── api/
│   │   ├── contact/route.ts          # Contact form → Nodemailer
│   │   ├── newsletter/route.ts       # Newsletter subscribe
│   │   └── orders/
│   │       ├── route.ts              # Create / list orders
│   │       └── razorpay/route.ts     # Razorpay order creation
│   ├── cart/                         # Cart page
│   ├── checkout/                     # 2-step checkout + Razorpay
│   ├── contact/                      # Contact form page
│   ├── order-confirmation/           # Post-purchase success
│   ├── product/[id]/                 # Dynamic product detail
│   ├── shop/                         # Filterable product catalog
│   ├── globals.css                   # Design system + utilities
│   ├── layout.tsx                    # Root layout
│   ├── loading.tsx                   # Global loading state
│   ├── not-found.tsx                 # 404 page
│   └── page.tsx                      # Homepage
├── components/
│   ├── CartDrawer.tsx                # Slide-out cart panel
│   ├── Footer.tsx                    # Full footer + newsletter
│   ├── HeroClient.tsx                # Animated hero section
│   ├── Navbar.tsx                    # Sticky nav + search + cart badge
│   ├── ProductCard.tsx               # Reusable product card
│   ├── SectionHeader.tsx             # Reusable section heading
│   └── Toast.tsx                     # Toast notifications
├── lib/
│   ├── cart-store.ts                 # Zustand cart (localStorage)
│   ├── products.ts                   # Mock product database
│   └── utils.ts                      # formatPrice, cn, generateOrderId
├── types/
│   └── index.ts                      # TypeScript interfaces
└── public/images/                    # Product images
```

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Razorpay (get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX

# Gmail SMTP (use App Password, not your real password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_16_char_app_password
CONTACT_TO_EMAIL=hello@hypsoul.in
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Setting Up Razorpay

1. Create an account at [razorpay.com](https://razorpay.com)
2. Go to **Dashboard → Settings → API Keys**
3. Click **Generate Test Key** (for development)
4. Copy the `Key ID` and `Key Secret` into `.env.local`
5. For live payments, generate a **Live Key** and update the env values

---

## Setting Up Gmail SMTP (Nodemailer)

1. Go to your Google Account → **Security → 2-Step Verification** (enable it)
2. Then go to **Security → App Passwords**
3. Create a new App Password for "Mail" on "Other device"
4. Copy the 16-character password into `SMTP_PASS`

---

## Connecting a Real Database

The project uses in-memory arrays for orders (resets on server restart).  
To persist data, replace the array logic in `app/api/orders/route.ts`:

### MongoDB (Mongoose)
```bash
npm install mongoose
```
```typescript
// lib/db.ts
import mongoose from "mongoose";
export const connectDB = () => mongoose.connect(process.env.MONGODB_URI!);
```

### Firebase Firestore
```bash
npm install firebase-admin
```
```typescript
// lib/firebase.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
```

---

## Pages Overview

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured, story banner, fresh drops, why us, CTA |
| `/shop` | Full catalog with live search, category filter, sort |
| `/product/[id]` | Product detail — images, size selector, add to cart, related |
| `/cart` | Full cart page with quantity controls |
| `/checkout` | 2-step: shipping address → payment (Razorpay / COD) |
| `/order-confirmation` | Post-purchase success screen |
| `/contact` | Contact form with API backend + email |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List all products (supports `?q=` and `?category=`) |
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders` | List all orders |
| `POST` | `/api/orders/razorpay` | Create Razorpay payment order |
| `POST` | `/api/contact` | Submit contact form, send emails |
| `POST` | `/api/newsletter` | Subscribe email to newsletter |

---

## Deployment (Vercel — Recommended)

```bash
npm install -g vercel
vercel
```

Add all your `.env.local` variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## Customisation Guide

### Add a New Product
Edit `lib/products.ts` and add to the `products` array:
```typescript
{
  id: "snk-007",
  name: "Your Sneaker Name",
  category: "Lifestyle",
  price: 4999,
  image: "/images/your-image.jpg",
  description: "Your description here.",
  isNew: true,
  featured: false,
  sizes: ["7", "8", "9", "10", "11"],
  stock: 10,
}
```

### Change Brand Colors
Edit `tailwind.config.ts` — update the `accent` color:
```typescript
accent: {
  DEFAULT: "#ff3c00",  // ← change this
  hover: "#ff5722",
}
```

---

## License

© 2026 Hypsoul. All rights reserved.
