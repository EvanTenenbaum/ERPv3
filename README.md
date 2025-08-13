# ERPv3 - Enterprise Resource Planning System

This repository supersedes ERPv2; see [ERPv2 (archived)](https://github.com/EvanTenenbaum/ERPv2) for history reference.

## Overview

ERPv3 is a modern, web-based Enterprise Resource Planning system built with:

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Prisma** with PostgreSQL for data management
- **Tailwind CSS** for styling
- **Vercel** for deployment

## Features

- 🔍 **Product Search & Filtering** - Advanced search with faceted filters
- 🛒 **Shopping Cart** - Add to cart functionality with quantity management
- 📋 **Quote Management** - Create and manage sales quotes
- 📄 **PDF Export** - Generate professional quote PDFs
- 🔗 **Share Links** - Tokenized public quote sharing
- 💾 **Inventory Management** - Complete CRUD operations for products, batches, and lots
- 📊 **Cost History** - Track batch costs with effective dates
- 🏢 **Vendor Management** - Vendor code masking and company management

## Development Workflow

This repository enforces a strict workflow:
- `staging/*` branches → PR → `main` (protected) → Vercel Production
- All changes require PR approval
- Vercel status checks required for merge
- No direct pushes to main branch

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`

## Deployment

- **Production**: Deploys automatically from `main` branch
- **Preview**: Deploys automatically from all other branches
- **Platform**: Vercel

---

*Migration completed from ERPv2 with full commit history preserved.*

