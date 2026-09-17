"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { api, Invoice } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  FileText,
  Clock,
  Download,
  RefreshCw,
  Plus,
  ArrowLeft,
  Loader2,
  Webhook,
  KeyRound,
  Send,
  CreditCard,
  CheckCircle2,
  CalendarClock
} from "lucide-react";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [sweeping, setSweeping] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Create Invoice Modal State with real client UUID from database
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "6a2dc3cb-0c17-4326-820b-4895166668b7",
    amountCents: 150000,
    dueDate: new Date().toISOString().split("T")[0],
  });

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createInvoice({
        clientId: formData.clientId,
        amountCents: Number(formData.amountCents),
        dueDate: formData.dueDate,
      });
      setIsDialogOpen(false);
      await loadInvoices();
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert("Error creating invoice. Check backend logs.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    setProcessingId(invoiceId);
    try {
      await api.updateInvoiceStatus(invoiceId, "SENT", "Invoice issued to client via dashboard UI");
      await loadInvoices();
    } catch (error) {
      console.error("Failed to send invoice:", error);
      alert("Failed to send invoice. Check backend logs.");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    setProcessingId(invoiceId);
    try {
      await api.updateInvoiceStatus(invoiceId, "PAID", "Manual payment settlement via dashboard UI");
      await loadInvoices();
    } catch (error) {
      console.error("Failed to settle invoice:", error);
      alert("Failed to settle invoice. Check backend logs.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOverdueSweep = async () => {
    setSweeping(true);
    try {
      const res = await api.processOverdueInvoices();
      alert(`Overdue sweep completed! Processed: ${res.processedCount} invoices.`);
      await loadInvoices();
    } catch (error) {
      console.error("Failed overdue sweep:", error);
      alert("Failed to trigger overdue sweeper. Ensure backend is reachable.");
    } finally {
      setSweeping(false);
    }
  };

  const metrics = useMemo(() => {
    const totalProcessedCents = invoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + (i.totalCents ?? 0), 0);

    const pendingDraftsCount = invoices.filter((i) => i.status === "DRAFT").length;

    const overdueCents = invoices
      .filter((i) => i.status === "OVERDUE")
      .reduce((sum, i) => sum + (i.totalCents ?? 0), 0);

    return {
      totalProcessed: (totalProcessedCents / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      pendingDrafts: pendingDraftsCount,
      overdueBalance: (overdueCents / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    if (statusFilter === "ALL") return invoices;
    return invoices.filter((i) => i.status === statusFilter);
  }, [invoices, statusFilter]);

  const handleDownloadPdf = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    try {
      const blob = await api.downloadPdf(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoiceId.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Could not download invoice PDF. Check backend availability.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">PAID</Badge>;
      case "SENT":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">SENT</Badge>;
      case "DRAFT":
        return <Badge variant="secondary" className="bg-slate-200 text-slate-800">DRAFT</Badge>;
      case "OVERDUE":
        return <Badge variant="destructive">OVERDUE</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="text-slate-500">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Developer Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Remitlytics Ledger &amp; Financial Overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/webhooks">
              <Button variant="outline" size="sm" className="text-slate-700">
                <Webhook className="mr-2 h-4 w-4" />
                Webhooks
              </Button>
            </Link>

            <Link href="/api-keys">
              <Button variant="outline" size="sm" className="text-slate-700">
                <KeyRound className="mr-2 h-4 w-4" />
                API Keys
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOverdueSweep}
              disabled={sweeping}
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              <CalendarClock className={`mr-2 h-4 w-4 ${sweeping ? "animate-spin" : ""}`} />
              Sweep Overdue
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadInvoices}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {/* Create Invoice Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleCreateInvoice}>
                  <DialogHeader>
                    <DialogTitle>Issue New Invoice</DialogTitle>
                    <DialogDescription>
                      Calculates platform fees and tax automatically using integer-cent arithmetic.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-700">Client UUID</label>
                      <Input
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                        required
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-700">Base Amount (Cents)</label>
                      <Input
                        type="number"
                        value={formData.amountCents}
                        onChange={(e) => setFormData({ ...formData, amountCents: Number(e.target.value) })}
                        required
                      />
                      <p className="text-[11px] text-slate-500">
                        150000 cents = $1,500.00 base charge
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-700">Due Date</label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500">
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Draft Invoice
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Processed Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.totalProcessed}
              </div>
              <p className="text-xs text-slate-500 mt-1">Paid settlement invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Pending Draft Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.pendingDrafts}
              </div>
              <p className="text-xs text-slate-500 mt-1">Awaiting status transition</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Overdue Outstanding Balance
              </CardTitle>
              <Clock className="h-4 w-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.overdueBalance}
              </div>
              <p className="text-xs text-slate-500 mt-1">Requires reconciliation</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Management Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Tenant Invoices
            </CardTitle>

            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    statusFilter === filter
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex h-48 items-center justify-center text-slate-500">
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Fetching ledger records...
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-slate-500">
                No invoices found for status &quot;{statusFilter}&quot;.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Base Amount</TableHead>
                    <TableHead className="text-right">Total (Inc. Tax/Fees)</TableHead>
                    <TableHead className="text-center">Lifecycle Action</TableHead>
                    <TableHead className="text-right">PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {invoice.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="text-slate-900 font-medium">
                        {invoice.clientName || invoice.clientId.substring(0, 8)}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {invoice.dueDate}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        ${(invoice.amountCents / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold text-slate-900">
                        ${((invoice.totalCents ?? 0) / 100).toFixed(2)}
                      </TableCell>

                      {/* State Transition Controls */}
                      <TableCell className="text-center">
                        {invoice.status === "DRAFT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 h-8 text-xs"
                            disabled={processingId === invoice.id}
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            {processingId === invoice.id ? (
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="mr-1 h-3.5 w-3.5" />
                            )}
                            Send Invoice
                          </Button>
                        )}

                        {invoice.status === "SENT" && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs"
                            disabled={processingId === invoice.id}
                            onClick={() => handlePayInvoice(invoice.id)}
                          >
                            {processingId === invoice.id ? (
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CreditCard className="mr-1 h-3.5 w-3.5" />
                            )}
                            Pay (Stripe)
                          </Button>
                        )}

                        {invoice.status === "PAID" && (
                          <span className="inline-flex items-center text-xs text-emerald-600 font-medium">
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            Settled
                          </span>
                        )}

                        {invoice.status !== "DRAFT" && invoice.status !== "SENT" && invoice.status !== "PAID" && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPdf(invoice.id)}
                          disabled={downloadingId === invoice.id}
                        >
                          <Download className={`h-4 w-4 ${downloadingId === invoice.id ? "animate-bounce" : ""}`} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}