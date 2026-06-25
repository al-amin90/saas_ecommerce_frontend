# SaaS Ecommerce Frontend

A modern, multi-tenant e-commerce frontend built with Next.js and TypeScript. This project provides a polished shopping experience for customers and an admin dashboard for managing products, orders, banners, delivery methods, and system settings.

## 🚀 Overview

This frontend is designed to work with a SaaS-style backend and supports:

- Customer-facing storefront and product browsing
- Shopping cart and order placement flow
- User authentication and account access
- Admin dashboard for managing business operations
- Responsive UI for desktop and mobile devices

## ✨ Features

- Responsive landing page and product catalog
- Product details, cart, and order success experience
- Order tracking and order management interfaces
- Dashboard pages for products, categories, colors, sizes, delivery methods, and banners
- Dynamic admin forms and reusable UI components
- State management with Redux Toolkit and persistence
- Modern animations and toast notifications

## 🛠️ Technology Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- RTK Query / Redux Persist
- shadcn/ui component system
- Framer Motion for UI animation
- Recharts for analytics and charts
- React Hook Form + Zod validation
- Sonner for notifications
- Swiper for sliders

## 📁 Project Structure

```bash
src/
├── app/                 # App routes and layouts
├── components/          # Reusable UI and feature components
├── constants/           # App constants
├── data/                # Static data
├── interface/           # TypeScript interfaces
├── lib/                 # Utility helpers
├── provider/            # Global providers
├── redux/               # Redux store, slices, and API setup
├── utils/               # Shared utilities
└── validation/          # Form validation schemas
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## 🧪 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build the project
npm run start    # Start production build
npm run lint     # Run ESLint
```

## 🌐 Environment Variables

Create a `.env.local` file and configure values such as:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🔗 Backend Integration

This frontend is built to work with a SaaS ecommerce backend that provides authentication, products, orders, banners, delivery methods, and tenant-aware APIs.

## 📌 Notes

- The UI is built with a reusable component system for faster scaling.
- The app is structured for SaaS-style product expansion and multi-module administration.
- You can extend the dashboard and storefront as your business grows.
