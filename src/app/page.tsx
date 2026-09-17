"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  FileCode2, 
  Scale, 
  Activity, 
  ArrowRight, 
  Terminal, 
  Lock 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-mono font-bold text-white shadow-lg shadow-indigo-500/30">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Remitlytics<span className="text-indigo-400">.io</span>
            </span>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
              v1.0 LIVE
            </Badge>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#architecture" className="transition-colors hover:text-white">Architecture</a>
            <a href="#api" className="transition-colors hover:text-white">API Docs</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        
        <div className="relative mx-auto max-w-4xl space-y-8">
          <Badge className="inline-flex items-center gap-2 border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            Enterprise Multi-Tenant Financial Infrastructure
          </Badge>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Zero-Drift Financial Ledger &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Payment Engine</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Engineered for immutable ledger accuracy, tenant isolation, dynamic PDF generation, and automated rate limiting using Spring Boot and PostgreSQL.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 bg-indigo-600 px-8 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500">
                Open Developer Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#api">
              <Button size="lg" variant="outline" className="h-12 border-slate-800 bg-slate-900/50 px-8 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
                <Terminal className="mr-2 h-5 w-5" />
                Inspect API Specs
              </Button>
            </a>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md sm:grid-cols-4 pt-6">
            <div>
              <div className="font-mono text-2xl font-bold text-white">$0.00</div>
              <div className="text-xs text-slate-400">Precision Loss</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-white">100 req/m</div>
              <div className="text-xs text-slate-400">Rate Limit Guard</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-white">SHA-256</div>
              <div className="text-xs text-slate-400">API Key Isolation</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400">Audit Trail Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Engineered for Banking-Grade Reliability</h2>
          <p className="text-sm text-slate-400 mt-2">Every component is isolated, tested, and optimized for high-throughput compliance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader>
              <Scale className="h-8 w-8 text-indigo-400 mb-2" />
              <CardTitle className="text-lg">Zero-Drift Calculation</CardTitle>
              <CardDescription className="text-slate-400">
                Uses strict integer-cent arithmetic and `BigDecimal` rounding to guarantee precise settlement math.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader>
              <Lock className="h-8 w-8 text-cyan-400 mb-2" />
              <CardTitle className="text-lg">SHA-256 Multi-Tenancy</CardTitle>
              <CardDescription className="text-slate-400">
                Requests are authenticated via hashed `X-API-KEY` credentials and bound strictly to isolated tenant schemas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader>
              <Activity className="h-8 w-8 text-emerald-400 mb-2" />
              <CardTitle className="text-lg">Bucket4j Rate Limiter</CardTitle>
              <CardDescription className="text-slate-400">
                In-memory token bucket rate limiting prevents tenant abuse by returning HTTP `429 Too Many Requests`.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader>
              <FileCode2 className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-lg">PDF Stream Engine</CardTitle>
              <CardDescription className="text-slate-400">
                Generates dynamic, formatted PDF invoice documents on demand using OpenPDF binary streams.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-amber-400 mb-2" />
              <CardTitle className="text-lg">Immutable Audit Log</CardTitle>
              <CardDescription className="text-slate-400">
                Database-level `@PreUpdate` state locks prevent modification of finalized ledger records.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader>
              <Zap className="h-8 w-8 text-rose-400 mb-2" />
              <CardTitle className="text-lg">Automated Sweeper</CardTitle>
              <CardDescription className="text-slate-400">
                Background `@Scheduled` cron jobs scan and mark unpaid invoices as `OVERDUE` automatically.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>
      </section>

      {/* Quick API Playground Preview */}
      <section id="api" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-400">cURL Quickstart</span>
            </div>
            <Badge variant="outline" className="font-mono text-xs text-indigo-400 border-indigo-500/30">
              POST /api/v1/invoices
            </Badge>
          </div>

          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-sm text-indigo-300">
{`curl -X POST http://localhost:8080/api/v1/invoices \\
  -H "X-API-KEY: remit_live_secret123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientId": "b1f55a7a-93a9-43d4-b00d-fbe54902892d",
    "amountCents": 10000,
    "dueDate": "2026-08-20"
  }'`}
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-12 text-center text-xs text-slate-500">
        <p>Remitlytics Core Ledger Service &bull; Built with Spring Boot, PostgreSQL &amp; Next.js 14</p>
      </footer>

    </div>
  );
}