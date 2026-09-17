# 🖥️ Remitlytics Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

The client-side administrative interface for the **Remitlytics Financial Core Engine**. Built with Next.js App Router and TypeScript, this dashboard provides real-time monitoring of ledger transactions, invoice lifecycle states, API key management, and webhook delivery status.

⚙️ **Core Engine Backend Repository:** [Sidharth-Async/remitlytics-core](https://github.com/Sidharth-Async/remitlytics-core)

---

## ✨ Features

- **Invoice Lifecycle Management:** View, track, and transition invoices across `DRAFT`, `SENT`, and `PAID` / `OVERDUE` states.
- **Audit & Ledger Visibility:** Monitor real-time double-entry transaction state and account balances.
- **Webhook Delivery Logs:** Inspect outbound webhook dispatches, HTTP status codes, delivery attempts, and trigger manual replay requests.
- **API Key Provisioning:** Create, view, and manage authentication credentials for API access.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **HTTP Client:** Fetch API with custom base URL configuration

---

## 🚀 Getting Started

### Prerequisites

Ensure the [Remitlytics Core Engine](https://github.com/Sidharth-Async/remitlytics-core) is running locally on port `8080`.

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_DEFAULT_API_KEY=remitlytics_local_dev_key

### 2. Install Dependencies
npm install

### 3. Run Development Server
npm run dev

Open http://localhost:3000 in your browser.
📦 Production Build

Verify type checking and create an optimized production build:
Bash

npm run build
npm run start
