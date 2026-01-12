# GreenBuild Ledger v1.0 🏗️🍃

A professional construction material management system designed for **LEED v4.1 compliance** and **UAE National Sustainability Targets**. This portal allows project managers to track embodied carbon and calculate LEED points in real-time.

## 🚀 Core Features

- **Cloud-Synced Ledger**: Instant data persistence using Supabase (PostgreSQL).
- **LEED v4.1 Calculator**: Automated weighted recycled content and local sourcing logic.
- **Embodied Carbon Gauge**: Real-time tracking against **UAE Estidama Benchmarks** (50,000 kg CO2e).
- **Interactive Analytics**: Carbon footprint breakdown by material category.
- **Audit Export**: One-click CSV export for official sustainability reporting.

## 🛠️ Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Database**: Supabase (Cloud Infrastructure)
- **Charts**: Recharts (Responsive SVG analytics)
- **Icons**: Lucide React / Custom SVG

## 📊 Sustainability Logic

The system implements the following calculation models:

- **Recycled Content**: `Post-Consumer % + (0.5 * Pre-Consumer %)`
- **Embodied Carbon**: `(Weight * Production Factor) + (Logistics Factor * Distance)`
- **Benchmarks**: UAE National Baseline for mid-scale developments.

## ⚙️ Local Setup

1. Clone the repo: `git clone https://github.com/ChromaDiv/GreenBuild.git`
2. Install dependencies: `npm install`
3. Configure Environment: Create a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run: `npm run dev`
