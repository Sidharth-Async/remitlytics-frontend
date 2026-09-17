"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, WebhookEvent } from "@/lib/api";
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  RefreshCw, 
  RotateCw, 
  Code2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertTriangle
} from "lucide-react";

export default function WebhooksPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const loadWebhookEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getWebhookEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch webhook events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWebhookEvents();
  }, [loadWebhookEvents]);

  const handleRetry = async (eventId: string) => {
    setRetryingId(eventId);
    try {
      await api.retryWebhookEvent(eventId);
      await loadWebhookEvents();
    } catch (error) {
      console.error("Webhook retry failed:", error);
      alert("Failed to deliver webhook payload. Check backend dispatcher logs.");
    } finally {
      setRetryingId(null);
    }
  };

  const formatPayload = (rawPayload: string) => {
    try {
      return JSON.stringify(JSON.parse(rawPayload), null, 2);
    } catch {
      return rawPayload;
    }
  };

  const getStatusBadge = (status: WebhookEvent["status"]) => {
    if (status === "DELIVERED") {
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          DELIVERED
        </Badge>
      );
    }
    if (status === "FAILED") {
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          FAILED
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
        <Clock className="mr-1 h-3 w-3" />
        PENDING
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Webhook Event Stream
              </h1>
              <p className="text-sm text-slate-500">
                Real-time event dispatcher, payload inspection, and replay mechanism
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadWebhookEvents}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Webhooks Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Dispatched Webhook Delivery Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-48 items-center justify-center text-slate-500">
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Fetching webhook logs...
              </div>
            ) : events.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-slate-500">
                No webhook events logged yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Target Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Attempts</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Payload</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {event.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[11px] border-slate-300">
                          {event.eventType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600 truncate max-w-[200px]" title={event.targetUrl}>
                        {event.targetUrl}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(event.status)}
                          {event.lastErrorMessage && (
                            <span className="flex items-center text-[10px] text-rose-500 max-w-[150px] truncate" title={event.lastErrorMessage}>
                              <AlertTriangle className="mr-1 h-3 w-3 shrink-0" />
                              {event.lastErrorMessage}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {event.attempts}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 font-mono">
                        {new Date(event.createdAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-600 hover:bg-slate-100">
                            <Code2 className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="font-mono text-sm">
                                {event.eventType} Payload
                              </DialogTitle>
                            </DialogHeader>
                            <pre className="max-h-96 overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-indigo-300">
                              {formatPayload(event.payload)}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(event.id)}
                          disabled={retryingId === event.id}
                        >
                          <RotateCw className={`mr-1 h-3.5 w-3.5 ${retryingId === event.id ? "animate-spin" : ""}`} />
                          Retry
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